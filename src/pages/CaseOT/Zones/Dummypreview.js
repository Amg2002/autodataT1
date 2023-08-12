import React from "react";
import "./maps.css";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
var map;
var draw;
mapboxgl.accessToken =
  "pk.eyJ1IjoidnNza2FtYWwiLCJhIjoiY2tkcGh6bXRzMjF2aTMwcm9oMnF6dG1pNyJ9.ACZ2VOCng21xRwfj5n2XIw";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 9.58817943397567,
      lng: 8.016038970947266,
      zoom: 9,
      polygonData : this.props.points,
    };
    this.drawPolygon = this.drawPolygon.bind(this);
    this.createArea = this.createArea.bind(this);
    // this.updateArea = this.updateArea.bind(this);
  }

  componentDidMount() {
    const { lat, lng, zoom } = this.state;
     map = new mapboxgl.Map({
        container: 'map',
      style: "mapbox://styles/mapbox/streets-v9",
      center: [lng, lat],
      zoom: zoom,
    });

     draw = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
                polygon: true,
                trash: true
            }
        });
        
       map.addControl(draw);

    map.on("draw.create", this.createArea);
    // map.on("draw.update", this.updateArea);
    map.on("draw.delete", this.deleteArea);
    console.log(this.props.points);
  }

    drawPolygon(points) {
    map.addLayer({
      id: "maine",
      type: "fill",
      source: {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: this.state.polygonData,
          },
        },
      },
      layout: {},
      paint: {
        "fill-color": "#088",
        "fill-opacity": 0.3,
      },
    });
  }

  createArea() {
    
    const polygonData = this.state.polygonData;
    //console.log(data.features[0].geometry.coordinates[0][0]);
    //console.log(data.features[0].geometry.coordinates[0][0][0]);

    
    this.drawPolygon(polygonData);
    console.log("this data bro:"+ polygonData);
  }

  deleteArea(e) {
    map.removeLayer("maine").removeSource("maine");
  }
  
  render() {
    return (
      <div>
        <div id="map"></div>
      </div>
    );
  }
}
export default App;