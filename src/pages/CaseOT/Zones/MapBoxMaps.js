import React from "react";
import "./maps.css";
import mapboxgl from "mapbox-gl";
import MapboxAutocomplete from 'react-mapbox-autocomplete';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import DrawRectangle from 'mapbox-gl-draw-rectangle-mode';
import './searchbox.css';

var map;
var draw;
mapboxgl.accessToken =
  "pk.eyJ1IjoidnNza2FtYWwiLCJhIjoiY2tkcGh6bXRzMjF2aTMwcm9oMnF6dG1pNyJ9.ACZ2VOCng21xRwfj5n2XIw";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: 8.016038970947266,
      lat: 9.58817943397567,
      zoom: 8.5,
      key: 1
    };

    this.drawPolygon = this.drawPolygon.bind(this);
    this.createArea = this.createArea.bind(this);
    this.updateArea = this.updateArea.bind(this);
  
  }

  loadMap(){
    map = new mapboxgl.Map({
      container: this.mapDiv,
      style: "mapbox://styles/mapbox/streets-v9",
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    });

    const modes = MapboxDraw.modes;
    modes.draw_rectangle = DrawRectangle;

    draw = new MapboxDraw({
      modes: modes,
      displayControlsDefault: false,
      controls: {
        polygon: false,
        trash: true
      },
    });
    
    map.addControl(draw);

    draw.changeMode('draw_rectangle');

    map.on("draw.create", this.createArea);
    map.on("draw.delete", this.deleteArea);
    map.on("draw.update", this.updateArea);

  }

  componentDidUpdate(prevProps, prevState){
    if(prevState.key !== this.state.key){
      this.loadMap();
    }
  }

  componentDidMount() {
    this.loadMap(); 

  }

  onPlaceSelected = (name, lat, lng, text) => {
    this.setState({
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    }, () => {
      map.flyTo({
        center: [
          parseFloat(lng),
          parseFloat(lat)
        ],
        essential: true
      })
    });
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
            coordinates: points,
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

  createArea(e) {
    let data = draw.getAll();
    const polygonData = data.features[0].geometry.coordinates;
    this.props.updateCoordinates(polygonData[0][0][0] + ','+ polygonData[0][0][1],
                                polygonData[0][1][0] + ','+ polygonData[0][1][1],
                                polygonData[0][2][0] + ','+ polygonData[0][2][1],
                                polygonData[0][3][0] + ','+ polygonData[0][3][1] );
    this.drawPolygon(polygonData);
  }


  deleteArea(e) {
    map.removeLayer("maine").removeSource("maine");
    draw.changeMode('draw_rectangle');
  }

  updateArea(e) {
    let data = draw.getAll();
    map.removeLayer("maine").removeSource("maine");
    const polygonData = data.features[0].geometry.coordinates;
    this.props.updateCoordinates(polygonData[0][0][0] + ','+ polygonData[0][0][1],
                                polygonData[0][1][0] + ','+ polygonData[0][1][1],
                                polygonData[0][2][0] + ','+ polygonData[0][2][1],
                                polygonData[0][3][0] + ','+ polygonData[0][3][1] );
    this.drawPolygon(polygonData);
  }

  render() {
    return (
      <div>
        <MapboxAutocomplete publicKey='pk.eyJ1IjoidnNza2FtYWwiLCJhIjoiY2tkcGh6bXRzMjF2aTMwcm9oMnF6dG1pNyJ9.ACZ2VOCng21xRwfj5n2XIw'
        style={{position: 'absolute'}}
          onSuggestionSelect={this.onPlaceSelected}
          resetSearch={false}/>
          <div key={this.state.key}>
            <div ref={(e) => (this.mapDiv = e)} className="map" ></div>
          </div>
      </div>
    );
  }
}
export default App;