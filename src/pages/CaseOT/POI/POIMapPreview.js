import React from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
 

class POIMapPreview extends React.Component {
  
    state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    };

  render() {
    
    return (
      <Map
        google={this.props.google}
        style={{
          width: "100%",
          height: "100%"
        }}
        initialCenter={this.props.markers[0].position}
        zoom={8}
      >
        {this.props.markers.map((marker, index) => (
          <Marker
            position={marker.position}
            // draggable={true}
            // onDragend={(t, map, coord) => this.props.onMarkerDragEnd(coord, index)}
            onClick={this.onMarkerClick}
            name={'Lat:'+ marker.position.lat + ', Lng:' + marker.position.lng}
          />
        ))}
          <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}>
            <div>
              <h3>{this.state.selectedPlace.name}</h3>
            </div>
          </InfoWindow>
      </Map>
    );
  }

  onMarkerClick=(props, marker, e)=>{
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }


}


export default GoogleApiWrapper({
  apiKey: 'AIzaSyCNFjFmnGwCekQz-GMUXupRUAEjSkqNmi8'
})(POIMapPreview)