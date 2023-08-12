/* eslint-disable array-callback-return */
import React from "react";
import "./zoneDataMap.css";
import mapboxgl from "mapbox-gl";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import 'mapbox-gl/dist/mapbox-gl.css'; 
import * as turf from "@turf/turf";

var map1;
var circle;


mapboxgl.accessToken =
  "pk.eyJ1IjoidnNza2FtYWwiLCJhIjoiY2tkcGh6bXRzMjF2aTMwcm9oMnF6dG1pNyJ9.ACZ2VOCng21xRwfj5n2XIw";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zoneMode: this.props.zoneMode,
      poiMode: this.props.poiMode,
      polygonData: this.props.points, // for the zone selected
      multipleMarkers: this.props.multipleMarkers, //from the DataTable
      center: this.props.zoneMode===true ? 
        this.props.points[0][3] : 
        [
          this.props.markers[0].position.lat , 
          this.props.markers[0].position.lng
        ],  
      markers: this.props.markers, //becomes centre of circle for selected POI
      zoom: this.props.poiMode? 13 : 8,
      
    };
  }

  pointInPolygon(pt,polygonData){
    let poly = turf.polygon(polygonData);

    let isInside=turf.booleanPointInPolygon(pt, poly);
    if(isInside)
      return true;
    else
      return false;
  }

  markersUnderZone(markerInput,map)
  {  
    let center=[markerInput.position.lat, markerInput.position.lng];

    if(this.pointInPolygon(center, this.state.polygonData)){
    }
  }

  markersUnderPOICircle(markerInput,map)
  {  
    let center=[];
    center.push(markerInput.position.lat);
    center.push(markerInput.position.lng);
    let isPointInsideCircle=this.pointInPolygon(center,circle.geometry.coordinates);
    if(isPointInsideCircle)
    {
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

  componentDidMount() {
    const { center,zoom,polygonData } = this.state;
     
     map1 = new mapboxgl.Map({
        container: 'map',
        style: "mapbox://styles/mapbox/streets-v9",
        center: center,
        zoom: zoom,
      });

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
      
      
      this.displayPolygon(this.props.markers[0].position.lat.toString(),circle.geometry.coordinates);
      

      this.props.multipleMarkers.map((marker)=>{
        return(
          this.markersUnderPOICircle(marker,map1)
          );
      });
    }
    else
    {
      this.state.multipleMarkers.map((markerInput)=>{    
        let centerMultipleMarkers=[];
        centerMultipleMarkers.push(markerInput.position.lat);
        centerMultipleMarkers.push(markerInput.position.lng);
        
      });
    }
  }


  
  render() {
    return (
      <div id='map-container'>
        <div id="map" style={{height: window.innerHeight*1.2}}></div>
      </div>
    );
  }
}
export default App;

 
