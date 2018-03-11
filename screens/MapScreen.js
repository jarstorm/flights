import React, { Component } from 'react';
import { View, Text, ActivityIndicator, Platform, Dimensions } from 'react-native';
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
    setInterval(() => this.props.fetchFlights(this.state.region), 5000);
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

  showFlightInfo() {
    this.props.navigation.navigate('info');
  }

  renderSelectedFlight() {
    const flight = this.props.selectedFlight;
    if (flight !== null) {
      return(
        <View style={styles.bubble}>
          <Text style={styles.selectedText}>Selected flight</Text>
          <Text style={styles.selectedText}>Icao {flight.Icao}</Text>
          <Text style={styles.selectedText}>Id {flight.Id}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Button title="Close" onPress={()=>this.closeFlightInfo() } style={styles.button}>Close</Button>
          <Button title="Follow" onPress={()=>this.closeFlightInfo() } style={styles.button}>Follow</Button>
          <Button title="More" onPress={()=>this.showFlightInfo() } style={styles.button}>More</Button>
          </View>
        </View>
      )
    }
  }

  render() {     
    if (!this.state.mapLoaded) {
      return (
        <View>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <MapView
          region={this.state.region}
          style={styles.map}
          onRegionChangeComplete={this.onRegionChangeComplete}
        >
          {this.renderPoints()}
        </MapView>    
        {this.renderSelectedFlight()}    
      </View>
    );
  }
}

const styles = {
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bubble: {    
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 20,
    marginVertical: 20,
    width: Dimensions.get('window').width - 20
  },
  button: {
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  selectedText: {
    color: 'white'
  }
};

function mapStateToProps({ flights }) {
  return { flights: flights.results, selectedFlight: flights.selectedFlight };
}

export default connect(mapStateToProps, actions)(MapScreen);
