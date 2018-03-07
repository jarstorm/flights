import React from 'react';
import { TabNavigator } from 'react-navigation';
import MapScreen from './screens/MapScreen';
import AboutScreen from './screens/AboutScreen';
import { Provider } from 'react-redux';
import store from './store';

export default class App extends React.Component {

render() {
    const MainNavigator = TabNavigator({      
        map: { screen: MapScreen },
        about: { screen: AboutScreen }
    });

    return (
      <Provider store={store}>
        <MainNavigator />
      </Provider>
    );
  }

}
