import React, { Component } from 'react';
import { View, Text, Platform } from 'react-native';
import { Icon } from 'react-native-elements';

class AboutScreen extends Component {
  static navigationOptions = {
    title: 'About',
    tabBarIcon:  ({ tintColor }) => {
      return <Icon name="description" size={30} color={tintColor} />;      
    }
  }

  render() {
    return(
      <View>
        <Text>About</Text>
      </View>
    )
  }
}

export default AboutScreen;
