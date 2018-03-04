import React, { Component } from 'react';
import { View, Text, ActivityIndicator, Platform } from 'react-native';
import { MapView, Constants, Location, Permissions } from 'expo';
import { connect } from 'react-redux';
import { Button, Icon } from 'react-native-elements';

import * as actions from '../actions';

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
  };

  componentDidMount() {
    this.setState({ mapLoaded: true });
  }

  onRegionChangeComplete = (region) => {
    console.log(region);
    this.setState({ region });
  }

  onButtonPress = () => {
    this.props.fetchFlights(this.state.region, () => {
      //this.props.navigation.navigate('deck');
    });
  }

  renderPoints = () => {    
    return this.props.flights.map((flight, index) => {
      console.log(flight);
      return (
        <MapView.Marker
            key={flight.Id}
            title={flight.Icao}
            coordinate={{latitude: flight.Lat, longitude: flight.Long}}
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
        <View style={styles.buttonContainer}>
          <Button
            large
            title="Search This Area"
            backgroundColor="#009688"
            icon={{ name: 'search' }}
            onPress={this.onButtonPress}
          />
        </View>
      </View>
    );
  }
}

const styles = {
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0
  }
}

function mapStateToProps({ flights }) {
  return { flights: flights.results };
}

export default connect(mapStateToProps, actions)(MapScreen);
