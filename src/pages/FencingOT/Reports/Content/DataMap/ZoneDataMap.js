/* eslint-disable array-callback-return */
import React from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import MapboxAutocomplete from 'react-mapbox-autocomplete';
import * as turf from "@turf/turf";
import { 
  Button,
  Card, 
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@material-ui/core';

import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import 'mapbox-gl/dist/mapbox-gl.css'; 
import "./zoneDataMap.css";

var map1;
var circle;
var draw;

var marker;
var markerList = [];

let shortestPathPoints = [];
let shortestPathMarkers = [];
let alongMarkers = [];
let spId = 1;

mapboxgl.accessToken =
  "pk.eyJ1IjoidnNza2FtYWwiLCJhIjoiY2tkcGh6bXRzMjF2aTMwcm9oMnF6dG1pNyJ9.ACZ2VOCng21xRwfj5n2XIw";


class App extends React.Component {
  constructor(props) {
    super(props);

    shortestPathPoints = [];
    shortestPathMarkers = [];
    alongMarkers = [];
    let center;

    if(this.props.currentCenter){
      center = [this.props.currentCenter.lng, this.props.currentCenter.lat];
    }else if(this.props.poiMode){
      center = [this.props.markers[0].position.lng, this.props.markers[0].position.lat];
    }else if(this.props.zoneMode){
      let polygon = turf.polygon(this.props.points);
      center = turf.centerOfMass(polygon);
      center = center.geometry.coordinates;
    }else if(this.props.multipleMarkers.length){
      center = [this.props.multipleMarkers[0].position.lat, this.props.multipleMarkers[0].position.lng] 
    }else{
      center = [this.props.markers[0].position.lng, this.props.markers[0].position.lat];
    } 
    
    this.state = {
      zoneMode: this.props.zoneMode,
      poiMode: this.props.poiMode,
      polygonData: this.props.points, // for the zone selected
      multipleMarkers: this.props.multipleMarkers, //from the DataTable
      center: center,
      markers: this.props.markers, //becomes centre of circle for selected POI
      zoom: this.props.zoom? this.props.zoom : (this.props.poiMode? 13 : this.props.zoneMode? 8 : 12),
      featureMode: this.props.featureMode?this.props.featureMode: false,
      alongDistance: 200,
      clusterType: 'dbscan',
      clusterMode: this.props.clusterMode
    };

    this.deletePoint = this.deletePoint.bind(this);
    this.updateArea = this.updateArea.bind(this);
    this.drawArea=this.drawArea.bind(this);
    this.addPoint = this.addPoint.bind(this);
    this.findShortestPath = this.findShortestPath.bind(this);
    this.getAlong = this.getAlong.bind(this);
    this.drawDelete = this.drawDelete.bind(this);
    this.plotCellSites = this.plotCellSites.bind(this);
    this.fetchCellSites = this.fetchCellSites.bind(this);
  }

  loadMap(){
    const { center,zoom,polygonData } = this.state;
     
    map1 = new mapboxgl.Map({
      container: 'map',
      style: "mapbox://styles/mapbox/streets-v11",
      center: center,
      zoom: zoom,
    });

    var nav = new mapboxgl.NavigationControl();
    map1.addControl(nav, 'top-right');

    map1.on('zoom', () => {
      let zoomLvl = map1.getZoom();
      let currentCenter = map1.getCenter();
      this.props.getZoom(zoomLvl, currentCenter);
    })

    map1.on('move', () => {
      let zoomLvl = map1.getZoom();
      let currentCenter = map1.getCenter();
      this.props.getZoom(zoomLvl, currentCenter);
    })

    if(this.props.cellSites){
      this.plotCellSites(this.props.cellSites);
    }
    if(this.props.mapEditMode){//map tools

      draw = new MapboxDraw({
        displayControlsDefault: false,
        controls:{
          point:true, 
          line_string: true, 
          polygon: true, 
          trash: true
        }
      })

      map1.addControl(draw);
  
      map1.on('draw.create', this.updateArea);
      map1.on('draw.delete', this.drawDelete);
      
      /*map1.on('draw.selectionchange', () => {
        const mode = draw.getMode();
        const selected = draw.getSelectedIds()[0];
  
        if (selected && mode === 'simple_select') {
          draw.changeMode('direct_select', { featureId: selected });
        }
      });
      */
      if(this.props.mapEditData){
        let mapEditData = this.props.mapEditData;
        let drawArea = this.drawArea;

        map1.on('load', function(){
          mapEditData.features.map((data) => {
            let geometryType = data.geometry.type;
            let dataCoordinates = data.geometry.coordinates;
            let id = data.id; 
            
            draw.add(data);

            drawArea(geometryType, dataCoordinates, id);
          })
        })
      }
      

    }
    if(this.state.zoneMode)  //for zone selection
    {   
      this.displayPolygon('zone', polygonData)
      this.state.multipleMarkers.map((marker)=>{
        return(this.markersUnderZone(marker,map1));
      });
    }
    else if(this.props.poiMode) //for poi selection
    {  
     let centreCircle = [this.props.markers[0].position.lat,this.props.markers[0].position.lng]
      
      let radius = 0.8;
      let options = {steps: 100, units: 'kilometers', properties: {foo: 'bar'}};
      circle = turf.circle(centreCircle, radius, options);
      
      //POI marker
      marker = new mapboxgl.Marker({color: '#D63324'})
      .setLngLat(centreCircle)
      .setPopup(new mapboxgl.Popup().setHTML("<h1>POI</h1>"))
      .addTo(map1);
      
      this.displayPolygon(this.props.markers[0].position.lat.toString(),circle.geometry.coordinates);
      

      this.props.multipleMarkers.map((marker)=>{
        return(
          this.markersUnderPOICircle(marker,map1)
          );
      });
    }
    else
    {
      if(this.props.clusterMode){ //clustering
        let points = [];
        let i = 1;
        this.state.multipleMarkers.forEach(marker => {
          points.push(turf.point([marker.position.lat, marker.position.lng], { name: i.toString() }))
        });

        if(points.length){
          points = turf.featureCollection(points)
        
          if(this.state.clusterType === 'dbscan'){
            //var points = turf.randomPoint(35, {bbox: [0, 30, 20, 50]});
            var maxDistance = 10;
            var clustered = turf.clustersDbscan(points, maxDistance);

            map1.on('load', function(){
                map1.addSource('dbscan', {
              type : 'geojson',
              data : clustered,
              cluster: true,
            })

            map1.addLayer({
              id: 'dbscan-cluster',
              type: 'circle',
              source: 'dbscan',
              filter: ['has', 'point_count'],
              paint: {
                'circle-color': [
                'step',
                ['get', 'point_count'],
                '#EE1B22',
                100,
                '#EE1B22',
                750,
                '#EE1B22'
                ],
                'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,
                100,
                30,
                750,
                40
                ]
              }

            })
            })
            

          }else{

            map1.on('load', function(){
                map1.addSource('dbscan', {
              type : 'geojson',
              data : clustered,
              cluster: true,
            })

            map1.addLayer({
              id: 'dbscan-cluster',
              type: 'circle',
              source: 'dbscan',
              filter: ['has', 'point_count'],
              paint: {
                'circle-color': [
                'step',
                ['get', 'point_count'],
                '#EE1B22',
                100,
                '#EE1B22',
                750,
                '#EE1B22'
                ],
                'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,
                100,
                30,
                750,
                40
                ]
              }

            })
            })
          }
        }
      }else{
        this.state.multipleMarkers.map((markerInput)=>{    
        let centerMultipleMarkers=[];
        centerMultipleMarkers.push(markerInput.position.lat);
        centerMultipleMarkers.push(markerInput.position.lng);
        
        marker = new mapboxgl.Marker()
          .setLngLat(centerMultipleMarkers)
          .addTo(map1);
        });
      }
      
    }
  }

  drawDelete(e){
    var data = draw.getAll();
    this.props.getMapEditData(data);
    
    if(e.features[0].geometry.type === 'Point'){
      let pointCoord = e.features[0].geometry.coordinates;

      //remove deleted point from shortestPathPoint
      shortestPathPoints = shortestPathPoints.filter(spPoint => !(spPoint[0] === pointCoord[0] && spPoint[1] === pointCoord[1]) )

      //check if the deleted point is start or end point on shortestPath
      shortestPathMarkers.forEach((marker) => {
        if((marker.startPoint[0] === pointCoord[0] && marker.startPoint[1] === pointCoord[1]) ||
          (marker.endPoint[0] === pointCoord[0] && marker.endPoint[1] === pointCoord[1])){
            if (map1.getLayer(marker.layerId)) {
              map1.removeLayer(marker.layerId);
            }
            if (map1.getSource(marker.layerId)) {
              map1.removeSource(marker.layerId);
            }
          }
      }) 
      this.deletePoint(e);  
      this.props.getMapToolsCoordinates(null);   
    }else if(e.features[0].geometry.type === 'LineString'){
      
      let id = e.features[0].id;
      //check if there are alongmarkers for the line string
      alongMarkers.forEach((alongMarker) => {
        if(alongMarker.id === id){
          alongMarker.marker.remove();  
        }
      })
      this.props.getMapToolsLength(null)
    }else if(e.features[0].geometry.type === 'Polygon'){
      this.props.getMapToolsArea(null);
    }
  }

  findShortestPath(dataCoordinates){
    if(this.state.featureMode === 'shortestPath'){
      shortestPathPoints.push(dataCoordinates);          
      
      if(shortestPathPoints.length >= 2){
        let startPoint = shortestPathPoints[shortestPathPoints.length-2];
        let endPoint = shortestPathPoints[shortestPathPoints.length-1]
        let options = {
          obstacles: turf.polygon([[[0, -7], [5, -7], [5, -3], [0, -3], [0, -7]]])
        };

        let path = turf.shortestPath(startPoint, endPoint, options);
        
        map1.addSource('spId-'+spId, {
          'type': 'geojson',
          'data': path
        });
        map1.addLayer({
          'id': 'spId-'+spId,
          'type': 'line',
          'source': 'spId-'+spId,
          'layout': {
            'line-join': 'round',
            'line-cap': 'round'
          },
          'paint': {
            'line-color': '#EE1B22',
            'line-width': 3
          }
        });

        shortestPathMarkers.push({ startPoint: startPoint, endPoint: endPoint, layerId: 'spId-'+spId++ })
        
        this.props.getMapToolsSPData(startPoint, endPoint);
      }
    }
  }

  getAlong(id, line){
    var options = {units: 'kilometers'};
    var along = turf.along(line, this.state.alongDistance, options);
    
    marker = new mapboxgl.Marker({color: '#008650'})
    .setLngLat(along.geometry.coordinates)
    .setPopup(new mapboxgl.Popup().setHTML("<p>"+along.geometry.coordinates+" </p>"))
    .addTo(map1);

    alongMarkers.push({id: id, marker: marker});

  }

  addPoint(id, centreCircle, circle){
    markerList.push({
      id: id, 
      marker: (new mapboxgl.Marker({color: '#D63324'})
        .setLngLat(centreCircle)
        .setPopup(new mapboxgl.Popup().setHTML("<p>"+centreCircle+"</p>"))
        .addTo(map1))
      }
    );

    map1.addSource(id, {
      'type': 'geojson',
      'data': {
       'type': 'Feature',
       'geometry': {
         'type': 'Polygon',
         'coordinates': circle.geometry.coordinates,
       }
      }
     });
     
    map1.addLayer({
    'id': id,
    'type': 'fill',
    'source': id,
    'layout': {},
    'paint': {
      'fill-color': '#2ECC71',
      'fill-opacity': 0.4
    }
    });
  }

  drawArea(geometryType, dataCoordinates, id){
      if (geometryType === 'Point' ){
        let centreCircle = dataCoordinates;      
        let radius = 0.01;
        let options = {steps: 100, units: 'kilometers', properties: {foo: 'bar'}};
        circle = turf.circle(centreCircle, radius, options);

        this.addPoint(id, centreCircle, circle);
        this.findShortestPath(dataCoordinates);
        
        this.props.getMapToolsCoordinates(dataCoordinates);
        
      }else if(geometryType === 'LineString'){
        let line = turf.lineString(dataCoordinates)
        let length = turf.length(line)
        length = Math.round(length);
        
        this.props.getMapToolsLength(length)

        if(this.state.featureMode === 'along'){
          this.getAlong(id, line);
        }

      }else if(geometryType === 'Polygon'){
        let polygon = turf.polygon(dataCoordinates);
        let area = turf.area(polygon);
        this.props.getMapToolsArea(area);

      }else {
        //if (e.type !== 'draw.delete')
        //alert('Use the draw tools to draw a polygon!');
      }
  }

  updateArea(e){
    if(e){
      var data = draw.getAll();
      this.props.getMapEditData(data);
      let geometryType = data.features[data.features.length-1] ? data.features[data.features.length-1].geometry.type : '';
      let dataCoordinates = data.features[data.features.length-1]? data.features[data.features.length-1].geometry.coordinates : [];
      let id = data.features[data.features.length-1]? data.features[data.features.length-1].id : '0' ; 

      this.drawArea(geometryType, dataCoordinates, id);

    }
  }

  deletePoint = (e) => {
    let id = e.features[0]? e.features[0].id : '0';
    let removeMarker = markerList.find(( marker, index ) => {
      if(marker.id === id) return marker;
    });
    map1.removeLayer(id);
    removeMarker.marker.remove();
    map1.removeSource(id);
  }

  pointInPolygon(pt,polygonData){
    let point = turf.point([pt[0], pt[1]]);
    let poly = turf.polygon(polygonData);

    let isInside=turf.booleanPointInPolygon(point, poly);
    if(isInside)
      return true;
    else
      return false;
  }

  markersUnderZone(markerInput,map)
  {  
    if(markerInput.position.lat && markerInput.position.lng){
      let center=[markerInput.position.lat, markerInput.position.lng];

      if(this.pointInPolygon(center, this.state.polygonData)){
        marker = new mapboxgl.Marker()
          .setLngLat(center)
          .addTo(map);
      }
    }
  }

  markersUnderPOICircle(markerInput,map)
  {  
    let center=[];
    if(markerInput.position.lat && markerInput.position.lng){
      center.push(markerInput.position.lat);
      center.push(markerInput.position.lng);
      let isPointInsideCircle=this.pointInPolygon(center,circle.geometry.coordinates);
      if(isPointInsideCircle)
      {
        marker = new mapboxgl.Marker()
        .setLngLat(center)
        .addTo(map);
      }
    }
    
  }

  displayPolygon(id,polygonData){
    map1.on('load', function() {
        map1.addSource(id, {
         'type': 'geojson',
         'data': {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': polygonData,
          }
         }
        });
        map1.addLayer({
         'id': id,
         'type': 'fill',
         'source': id,
         'layout': {},
         'paint': {
           'fill-color': '#088',
          'fill-opacity': 0.4
          }
        });
    });
  }

  plotCellSites(cellSites){

    cellSites.forEach( site => {
      let el = document.createElement('div');
      el.className = 'towermarker';
      new mapboxgl.Marker(el)
      .setLngLat([site.longitude, site.latitude])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML(`<div>
          Operator: ${site.operator}<br/>
          Latitude: ${site.latitude}<br/>
          Longitude: ${site.longitude}<br/>
          LGA: ${site.lga}<br/>
          Address: ${site.address}<br/>
          City: ${site.city}<br/>
        </div>`)
      )
      .addTo(map1);
    })
  }

  componentDidUpdate(prevProps, prevState){
    if(prevState.featureMode !== this.state.featureMode  || prevState.alongDistance !== this.state.alongDistance){
      this.updateArea(null);
    }
    if(prevState.clusterType !== this.state.clusterType ){
      this.loadMap();
    }
  }

  componentDidMount() {
    this.loadMap();
    markerList=[];
  }
  
  onPlaceSelected = (name, lat, lng, text) => {
    map1.flyTo({
      center: [
        parseFloat(lng),
        parseFloat(lat)
      ],
      essential: true
    });
  }

  render() {
    return (
      <div id='map-container'>
        <div className='calculated-area'>
        <Card>
          <CardContent>
            <MapboxAutocomplete publicKey='pk.eyJ1IjoidnNza2FtYWwiLCJhIjoiY2tkcGh6bXRzMjF2aTMwcm9oMnF6dG1pNyJ9.ACZ2VOCng21xRwfj5n2XIw'
            onSuggestionSelect={this.onPlaceSelected}
            className='mapbox-autocomplete'
            resetSearch={false}/>
            <br />
            <Button 
              variant={'contained'}
              fullWidth
              color={'primary'}
              onClick={() => {
                this.fetchCellSites();
              }}
            >
              Show Cell Towers
            </Button>
            {
            this.state.featureMode === 'along'?
            (<div id='along'>
                <br/>
                <FormControl variant="outlined" style={{width:'100%'}}>
                <TextField 
                type='number' 
                id='alongDistance'
                defaultValue={this.state.alongDistance} 
                label="Enter distance(in km)" 
                variant="outlined"
                name='alongDistance' 
                onBlur={(e) => {this.setState({alongDistance : e.target.value })}}  
                />
                </FormControl>
            </div>): null
            }

            {
            this.state.clusterMode && (
              <CardContent>
                  <FormControl variant="outlined" style={{width:'100%'}}>
                  <InputLabel>Select Feature</InputLabel>
                  <Select
                      aria-label="clusterType" 
                      name="clusterType"
                      value={this.state.clusterType} 
                      onChange={(event) => {
                      this.setState({ clusterType: event.target.value })
                      }}
                      label="names"
                  >
                  <MenuItem value='dbscan'>DBSCAN</MenuItem>
                  <MenuItem value='kmean'>K-mean</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            )
        }
          </CardContent>
        </Card>
        </div>
        <div id="map" style={{height: window.innerHeight*1.2}}></div>
      </div>
    );
  }

  fetchCellSites = () => {
    let bounds = map1.getBounds();
    let csDetails = {
      lat1: bounds._ne['lat'],
      lat2: bounds._sw['lat'],
      lon1: bounds._ne['lng'], 
      lon2: bounds._sw['lng']
    }
    this.props.getCellSitesDetails(csDetails);
  }
}
export default App;

 
