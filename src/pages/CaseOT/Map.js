import React from 'react';
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';
import Autocomplete from 'react-google-autocomplete';

class MapContainer extends React.Component {
  constructor(props){
    super(props);
    this.state={
      key: 1,
      width: this.props.width? this.props.width : "75%",
      mapPosition:{
        lat: this.props.mapPosition.lat,
        lng: this.props.mapPosition.lng
      },
      markers: this.props.markers
    }

    this.mapHandleClick=this.mapHandleClick.bind(this);
  }

  mapHandleClick(mapProps, map, coord){

    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    
    let marker = [{
      position: {
        lat: lat,
        lng: lng
      }
    }];

    this.setState({
      markers: marker
    });

    this.props.onMarkerDragEnd(coord, 0)

  }

  render() {
    return (
      <Map
        key={this.state.key}
        google={this.props.google}
        onClick={this.mapHandleClick}
        style={{
          width: this.state.width,
          height: "90%",
        }}
        initialCenter={{ lat: this.props.mapPosition.lat, lng: this.props.mapPosition.lng}}
        zoom={8}
      >
        {this.state.markers.map((marker, index) => (
          <Marker
            position={marker.position}
            draggable={true}
            onDragend={(t, map, coord) => this.props.onMarkerDragEnd(coord, index)}
            name={marker.name}
          />
        ))}
        <Autocomplete
          style={{
              width: '35%',
              height: '40px',
              marginLeft: this.props.width? '42%' : '20%',
              paddingLeft: '16px',
              position:"absolute",
              marginTop: '0px',
          }}
          onClick={()=>{
            //
          }}
          onPlaceSelected={ place => {
            if(this.props.onPlaceSelected)this.props.onPlaceSelected(place)
            this.setState({
              key: this.state.key+1,
              mapPosition:{
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              }
            })
          }}
          types={['(regions)']}
          />
      </Map>
    );
  }
}


export default GoogleApiWrapper({
  apiKey: 'AIzaSyCNFjFmnGwCekQz-GMUXupRUAEjSkqNmi8'
})(MapContainer)