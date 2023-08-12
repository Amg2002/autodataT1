import React from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
class DataMap extends React.Component {
    
      state = {
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {},
        };
    
    
      onMarkerClick=(props, marker, e)=>{
        this.setState({
          selectedPlace: props,
          activeMarker: marker,
          showingInfoWindow: true
        });
      }
    
      render() {
        const {		        	            
            selectedJobCdrList,		         
        } = this.props;	
        return (
            <Map
        google={this.props.google}
        style={{
            width: "45%",
            height: "80%"
          }}
        initialCenter={{ lat: 9.58817943397567, lng: 8.016038970947266}}
        zoom={8}
      >
        {selectedJobCdrList.map((marker, index) => (
          <Marker
            position={{lat: marker['locationlat'], lng: marker['locationlon']}}
            // draggable={true}
            // onDragend={(t, map, coord) => this.props.onMarkerDragEnd(coord, index)}
            onClick={this.onMarkerClick}
           
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
}


export default GoogleApiWrapper({
  apiKey: ('AIzaSyCNFjFmnGwCekQz-GMUXupRUAEjSkqNmi8')
})(DataMap)