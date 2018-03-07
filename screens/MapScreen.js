import React, { Component } from 'react';
import { View, Text, ActivityIndicator, Platform } from 'react-native';
import { MapView, Constants, Location, Permissions } from 'expo';
import { connect } from 'react-redux';
import { Button, Icon } from 'react-native-elements';

import * as actions from '../actions';

import flightImg from '../assets/black-plane.png';
import selectedFlightImg from '../assets/red-plane.png';

class MapScreen extends Component {
  static navigationOptions = {
    title: 'Map',
    tabBarIcon:  ({ tintColor }) => {
      return <Icon name="map" size={30} color={tintColor} />;      
    }
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
  };

  componentDidMount() {
    this.setState({ mapLoaded: true });
    setInterval(() => this.props.fetchFlights(this.state.region), 3000);
  }

  onRegionChangeComplete = (region) => {
    this.setState({ region});
  }

  _getFlightAngle(flight) {
    // This is because 90º image rotation
    return (flight.Trak -90)+'deg';
  }

  markerClick(flight) {
    this.props.selectFlight(flight);
  }

  getFlightImage(flight) {
    if (this.props.selectedFlight !== null && flight.Id === this.props.selectedFlight.Id) {
      return selectedFlightImg;
    }
    return flightImg;
  }

  renderPoints = () => {    
    return this.props.flights.map((flight, index) => {
      //console.log(flight);
      if (index < 20) {
      return (
        <MapView.Marker
            key={flight.Id}
            coordinate={{latitude: flight.Lat, longitude: flight.Long}}
            image={this.getFlightImage(flight)} 
            style={{ transform: [{ rotate: this._getFlightAngle(flight)}] }}           
            onPress= {()=>this.markerClick(flight)}
        />        
      );
    } 
    });
  }

  closeFlightInfo() {
    this.props.selectFlight(null);
  }

  renderSelectedFlight() {
    const flight = this.props.selectedFlight;
    if (flight !== null) {
      return(
        <View>
          <Text>Selected flight</Text>
          <Text>Icao {flight.Icao}</Text>
          <Button title="Close" onPress={()=>this.closeFlightInfo()}>Close</Button>
        </View>
      )
    }
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
        {this.renderSelectedFlight()}    
      </View>
    );
  }
}

function mapStateToProps({ flights }) {
  return { flights: flights.results, selectedFlight: flights.selectedFlight };
}

export default connect(mapStateToProps, actions)(MapScreen);
