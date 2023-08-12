import React from 'react';
import {Map, Polygon,GoogleApiWrapper} from 'google-maps-react';


class ZoneMapPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      center: this.props.coordinates[3],
      zoom: 8,
      polygonData: this.props.coordinates
    };
  }
  
  render() {
     const { center, zoom,polygonData } = this.state;
    return (
       <Map
        key={this.state.key}
        google={this.props.google}
        style={{
          width: "100%",
          height: "100%"
        }}
        initialCenter={center}
        zoom={zoom}
      >
         <Polygon
            paths={polygonData}
            strokeColor="#0000FF"
            strokeOpacity={0.8}
            strokeWeight={2}
            fillColor="#0000FF"
            fillOpacity={0.3} />
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCNFjFmnGwCekQz-GMUXupRUAEjSkqNmi8'
})(ZoneMapPreview)