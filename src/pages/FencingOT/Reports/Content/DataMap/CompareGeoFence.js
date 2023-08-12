/* eslint-disable array-callback-return */
import React from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import MapboxAutocomplete from 'react-mapbox-autocomplete';
import * as turf from "@turf/turf";
import { 
  Card, 
  CardContent
} from '@material-ui/core';
import moment from "moment";

import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import 'mapbox-gl/dist/mapbox-gl.css'; 
import "./zoneDataMap.css";


var map1;
var draw;
var marker;
var center;
var mapId = 1;

mapboxgl.accessToken =
  "pk.eyJ1IjoidnNza2FtYWwiLCJhIjoiY2tkcGh6bXRzMjF2aTMwcm9oMnF6dG1pNyJ9.ACZ2VOCng21xRwfj5n2XIw";


class App extends React.Component {
  constructor(props) {
    super(props);
    
    if( this.props.currentCenter){
      center = [this.props.currentCenter.lng, this.props.currentCenter.lat]
    }else if(this.props.selectedCaseLocationJobCdrList.length){
      center =  this.props.selectedCaseLocationJobCdrList[0].query.split(",");
      center = [center[0], center[1]]
    }else{
      center = [9.58817943397567, 8.016038970947266]
    }

    this.state = {
      center:  center,  
      zoom: this.props.zoom? this.props.zoom : 12,
      radius: 15
    };

    this.updateMap = this.updateMap.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  showLatLng(lat, lng){
    this.setState({
        center: [lng, lat]
    }, () => this.props.getCompareGeoLocationDetails(this.state.center[1], this.state.center[0], this.state.radius))
    let coordinates=document.getElementById('coordinates');
    coordinates.style.display = 'block';
    coordinates.innerHTML =
    'Longitude: ' + lng + '<br />Latitude: ' + lat;
  }

  onDragEnd(){
    var lngLat = marker.getLngLat();
    this.showLatLng(lngLat.lat, lngLat.lng);  
  }

  removeMarker(id){
    if(map1.getLayer(id)) map1.removeLayer(id);
    if(map1.getSource(id)) map1.removeSource(id);
    if (marker) marker.remove();
  }

  updateMap(e){
    let data = draw.getAll();
    let radius = this.state.radius ? this.state.radius: 0.5;
    let center;

    if(e){
      center = data.features[data.features.length-1]? data.features[data.features.length-1].geometry.coordinates: this.state.center; 
      this.showLatLng(center[1], center[0])  
    }else{
      center = this.state.center;
    }

    let options = {steps: 100, units: 'kilometers', properties: {foo: 'bar'}};
    let circle = turf.circle(center, radius, options);

    if(mapId-1 !== 0){
      this.removeMarker(mapId-1);
    }

    marker = (new mapboxgl.Marker({color: '#D63324', draggable: true})
    .setLngLat(center)
    .addTo(map1))

    marker.on('dragend', this.onDragEnd);

    this.displayPolygon((mapId++).toString(), circle.geometry.coordinates);
    

  }


  loadMap(){
    const { center,zoom } = this.state;
     
    map1 = new mapboxgl.Map({
      container: 'map',
      style: "mapbox://styles/mapbox/streets-v9",
      center: center,
      zoom: zoom,
      radius: 0,
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

    if(!this.props.compareGeoFenceMode){
      draw = new MapboxDraw({
        displayControlsDefault: false,
        controls:{
          point:true
        }
      })
  
      map1.addControl(draw);
  
      map1.on('draw.create', this.updateMap);
      
    }else{

      let selectedCaseLocationJobCdrList = this.props.selectedCaseLocationJobCdrList;
      let compareGeoFenceData = this.props.compareGeoFenceData;

      map1.on('load', function(){
        
        selectedCaseLocationJobCdrList.map((job)=>{

          let data = job.query.split(",");
          let center = [data[0], data[1]];
          let radius = Number(data[2]);
          let options = {steps: 100, units: 'meters'};
          let id = (mapId++).toString();

          let circle = turf.circle(center, radius, options);
          marker = (new mapboxgl.Marker({color: '#D63324'})
          .setLngLat(center)
          .setPopup(new mapboxgl.Popup().setHTML(`<div>
          <strong>Latitude</strong>: ${data[0]} <br />
          <strong>Longitute:</strong> ${data[1]} <br/>
          <strong>Distance:</strong> ${data[2]} <br />
          <br />
          <strong>Start Time:</strong> ${moment.unix(job['startTime']/1000).format("DD/MM/YYYY HH:mm")}<br/>
          <strong>End Time:</strong> ${moment.unix(job['endTime']/1000).format("DD/MM/YYYY HH:mm")}<br/>
        </div>`))
          .addTo(map1))

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
              'fill-color': '#088',
            'fill-opacity': 0.4
            }
          });
           
        })
          

        /*for (let data in compareGeoFenceData){
          compareGeoFenceData[data].map(position => {
            marker = new mapboxgl.Marker()
            .setLngLat([position.lat, position.lng])
            .setPopup(new mapboxgl.Popup().setHTML('<div><strong>'+data+': </strong>'+position.lat+','+position.lng+'</div>'))
            .addTo(map1);
          })
        }*/


        Object.keys(compareGeoFenceData).forEach( data => {
          compareGeoFenceData[data].map( position => {
            marker = new mapboxgl.Marker()
            .setLngLat([position.lat, position.lng])
            .setPopup(new mapboxgl.Popup().setHTML('<div><strong>'+data+': </strong>'+position.lat+','+position.lng+'</div>'))
            .addTo(map1);
          })
        })
        
      })
    }
    
  }

  displayPolygon(id,polygonData){
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
  }

  componentDidUpdate(prevProps, prevState){
    if(prevState.radius !== this.state.radius || 
        (prevState.center[0] !== this.state.center[0] && 
          prevState.center[1] !== this.state.center[1]  
        )
      )
    {  
      let LayerId = mapId-1;
      if(LayerId !== 0){
        this.props.getCompareGeoLocationDetails(this.state.center[1], this.state.center[0], this.state.radius);
        this.removeMarker(LayerId);
        this.updateMap(null);
      }
    }
  }

  componentDidMount() {
    this.loadMap();
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
        {this.props.compareGeoFenceMode? null : (         
          <div>
        <div className='calculated-area'>
          <Card>
            <CardContent>
              <MapboxAutocomplete 
                publicKey='pk.eyJ1IjoidnNza2FtYWwiLCJhIjoiY2tkcGh6bXRzMjF2aTMwcm9oMnF6dG1pNyJ9.ACZ2VOCng21xRwfj5n2XIw'
                onSuggestionSelect={this.onPlaceSelected}
                resetSearch={false}
              />
            </CardContent>
            <div style={{paddingLeft: 20}}>
              <pre id="coordinates" className="coordinates"></pre>
            </div>
            </Card>
        </div> </div>)}
        <div id="map" style={{height: window.innerHeight*1.2}}></div>
      </div>
    );
  }
}
export default App;

 
