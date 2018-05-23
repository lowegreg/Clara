import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class SimpleMap extends Component {
  static defaultProps = {
    center: {
      lat: 43.45083153,
      lng: -80.488831378
    },
    zoom: 11
  };

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyDq3ZF-Hh1zAkSUdcOqjzxDTcMGeP6WjBo' }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          layerTypes={['TrafficLayer', 'TransitLayer']}
        >
          <AnyReactComponent
            lat={43.45083153}
            lng={-80.488831378}
            text={'Kreyser Avrora'}
          />
        </GoogleMapReact>
      </div>
    );
  }
}

export default SimpleMap;