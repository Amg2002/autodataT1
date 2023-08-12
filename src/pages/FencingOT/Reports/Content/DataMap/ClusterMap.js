/* eslint-disable no-unused-labels */
/* eslint-disable no-labels */
import React from "react";
import { 
  Card, 
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import mapboxgl from "mapbox-gl";
import MapboxAutocomplete from 'react-mapbox-autocomplete';
import * as turf from "@turf/turf";

import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import 'mapbox-gl/dist/mapbox-gl.css'; 
import "./zoneDataMap.css";

var map1;
let center;

mapboxgl.accessToken =
  "pk.eyJ1IjoidnNza2FtYWwiLCJhIjoiY2tkcGh6bXRzMjF2aTMwcm9oMnF6dG1pNyJ9.ACZ2VOCng21xRwfj5n2XIw";


class App extends React.Component {
  constructor(props) {
    super(props);
    
    if(this.props.currentCenter){ center = [this.props.currentCenter.lng, this.props.currentCenter.lat] }
    else if(this.props.clusterData.length){ center = [this.props.clusterData[0].lng, this.props.clusterData[0].lat]
    }else{ center = [this.props.marker[0].position.lng, this.props.marker[0].position.lat] }

    this.state = {
      center: center,
      zoom: this.props.zoom? this.props.zoom : 12,
      clusterType: this.props.clusterType,
      clusterData: this.props.clusterData,
      clusterMode: this.props.clusterMode
    };

    this.addPoint = this.addPoint.bind(this);
    //this.displayPolygon = this.displayPolygon.bind(this);

  }

  loadMap(){
    const { center,zoom } = this.state;
     
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

    map1.on('load', () => {
      if(this.state.clusterData.length) {
        if(this.state.clusterType === 'K-MEANS'){
          if(this.state.clusterData.length > 2){

            let polygonData = this.state.clusterData.map((position) => [position.lng, position.lat]);
            polygonData.push(polygonData[0])
            polygonData = [polygonData];
            let polygon = turf.polygon(polygonData);
            
            this.displayPolygon('region1', polygon.geometry.coordinates);
            
            this.state.clusterData.forEach( data => this.addPoint([data.lng, data.lat]));
            
          }else{
            this.state.clusterData.forEach( data => this.addPoint([data.lng, data.lat]));  
          }
        }else{
          this.state.clusterData.forEach( data => this.addPoint([data.lng, data.lat]));
        }
      }
    })  
  }

  addPoint(center){

    marker: (new mapboxgl.Marker()
    .setLngLat(center)
    .setPopup(new mapboxgl.Popup().setHTML("<p>"+center+"</p>"))
    .addTo(map1))
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
        <div className='calculated-area'>
        <Card>
          <CardContent>
            <MapboxAutocomplete publicKey='pk.eyJ1IjoidnNza2FtYWwiLCJhIjoiY2tkcGh6bXRzMjF2aTMwcm9oMnF6dG1pNyJ9.ACZ2VOCng21xRwfj5n2XIw'
            onSuggestionSelect={this.onPlaceSelected}
            className='mapbox-autocomplete'
            resetSearch={false}/>
            </CardContent>
            <CardContent>
                <FormControl variant="outlined" style={{width:'100%'}}>
                <InputLabel>Select Feature</InputLabel>
                <Select
                    aria-label="clusterType" 
                    name="clusterType"
                    value={this.state.clusterType} 
                    onChange={(event) => this.props.handleClusterChange(event.target.value)}
                    label="clusterType"
                >
                    <MenuItem value='K-MEANS'>K-mean</MenuItem>
                    <MenuItem value='DBSCAN'>DBSCAN</MenuItem>
                </Select>
            </FormControl>
        </CardContent>  
        </Card>
        </div>
        <div id="map" style={{height: window.innerHeight*1.2}}></div>
      </div>
    );
  }
}
export default App;

 
