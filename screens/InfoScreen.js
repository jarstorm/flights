import React, { Component } from 'react';
import { View, Text, Platform } from 'react-native';
import { Icon } from 'react-native-elements';

class InfoScreen extends Component {
  static navigationOptions = {
    title: 'Info',
    tabBarIcon:  ({ tintColor }) => {
      return <Icon name="description" size={30} color={tintColor} />;      
    },
    tabBarVisible: false
  }

  render() {
    return(
      <View>
        <Text>Info</Text>
      </View>
    )
  }
}

export default InfoScreen;
