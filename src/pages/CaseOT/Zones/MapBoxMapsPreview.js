import React from "react";
import "./maps.css";
import mapboxgl from "mapbox-gl";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
var map;
mapboxgl.accessToken =
  "pk.eyJ1IjoidnNza2FtYWwiLCJhIjoiY2tkcGh6bXRzMjF2aTMwcm9oMnF6dG1pNyJ9.ACZ2VOCng21xRwfj5n2XIw";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      center: this.props.points[0][3],
      zoom: 7,
      polygonData: this.props.points
    };
    // this.drawPolygon = this.drawPolygon.bind(this);
    // this.createArea = this.createArea.bind(this);
    // this.updateArea = this.updateArea.bind(this);
  }

  componentDidMount() {
    const { center, zoom,polygonData } = this.state;

     map = new mapboxgl.Map({
        container: 'map',
      style: "mapbox://styles/mapbox/streets-v9",
      center: center,
      zoom: zoom,
    });
     map.on('load', function() {
			map.addSource('maine', {
			'type': 'geojson',
			'data': {
			'type': 'Feature',
			'geometry': {
			'type': 'Polygon',
			'coordinates': polygonData,
			}
			}
			});
			map.addLayer({
			'id': 'maine',
			'type': 'fill',
			'source': 'maine',
			'layout': {},
			'paint': {
			'fill-color': '#088',
			'fill-opacity': 0.4
			}
			});
			});
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