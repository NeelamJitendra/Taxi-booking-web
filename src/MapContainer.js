import React, { Component } from 'react';
import { Map, Marker, Polyline } from 'google-maps-react';
import taxi from './Images/taxi.png';
import stop from './Images/stop.png';

const mapStyles = {
  map: {
    position: 'absolute',
    width: '75%',
    height: '100%'
  }
};

export class MapContainer extends Component {
  constructor(props) {
    super(props);
  };

  showMarkers = () => {
    let route = this.props.route;
    if (route.length !== 0) {
      return <Polyline
        path={route}
        geodesic={true}
        options={{
          strokeColor: '#40E0D0',
          strokeOpacity: 1,
          strokeWeight: 4,
          icons: [{
            offset: '0',
            repeat: '10px'
          }],
        }}
      />
    }
  }

  startMarker = () => {
    let route = this.props.route;
    if (route.length !== 0) {
      return <Marker
        position={{
          lat: route[0].lat || 59.33,
          lng: route[0].lng || 18.056
        }}
        icon={{
          url: taxi,
          scaledSize: new this.props.google.maps.Size(60, 50)
        }}

      />
    }
  }

  stopMarker = () => {
    let route = this.props.route;
    if (route.length !== 0) {
      return <Marker
        position={{
          lat: route[route.length - 1].lat,
          lng: route[route.length - 1].lng
        }}
        icon={{
          url: stop,
          scaledSize: new this.props.google.maps.Size(25, 50)
        }}

      />
    }
  }

  render() {
    const style = Object.assign({}, mapStyles.map);
    let route = this.props.route;
    var bounds = new this.props.google.maps.LatLngBounds();
    for (var i = 0; i < route.length; i++) {
      bounds.extend(route[i]);
    }
    return (
      <div style={style}>
        <Map
          google={this.props.google}
          zoom={14}
          key='map'
          initialCenter={{
            lat: 59.33,
            lng: 18.056
          }}
          center={route}
          bounds={bounds}
        >
          {this.startMarker()}
          {this.showMarkers()}
          {this.stopMarker()}
        </Map>
      </div>
    );
  }
}
export default MapContainer;