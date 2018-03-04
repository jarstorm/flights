import React, { Component } from 'react';
import { View, Text, ActivityIndicator, Platform } from 'react-native';
import { MapView, Constants, Location, Permissions } from 'expo';
import { connect } from 'react-redux';
import { Button, Icon } from 'react-native-elements';

import * as actions from '../actions';

import flightImg from '../assets/plane.png';

class MapScreen extends Component {
  static navigationOptions = {
    title: 'Map'
  }

  state = {
    mapLoaded: false,
    region: {
      longitude: 0,
      latitude: 0,
      longitudeDelta: 0.74,
      latitudeDelta: 0.93
    }
  }

componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ region: { latitude: location.coords.latitude, 
                              longitude: location.coords.longitude, 
                              latitudeDelta: this.state.region.latitudeDelta, 
                              longitudeDelta: this.state.region.longitudeDelta }});
    this.props.fetchFlights(this.state.region);
  };

  componentDidMount() {
    this.setState({ mapLoaded: true });
  }

  onRegionChangeComplete = (region) => {
    this.props.fetchFlights(region);
    this.setState({ region});
  }

  _getFlightAngle(flight) {
    // This is because 90º image rotation
    return (flight.Trak -90)+'deg';
  }

  renderPoints = () => {    
    return this.props.flights.map((flight, index) => {
      console.log(flight);
      return (
        <MapView.Marker
            key={flight.Id}
            title={flight.Icao}
            coordinate={{latitude: flight.Lat, longitude: flight.Long}}
            image={flightImg} 
            style={{ transform: [{ rotate: this._getFlightAngle(flight)}] }}           
        />
      );
    });
  }

  render() {    
    if (!this.state.mapLoaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <MapView
          region={this.state.region}
          style={{ flex: 1 }}
          onRegionChangeComplete={this.onRegionChangeComplete}
        >
          {this.renderPoints()}
        </MapView>        
      </View>
    );
  }
}

function mapStateToProps({ flights }) {
  return { flights: flights.results };
}

export default connect(mapStateToProps, actions)(MapScreen);
