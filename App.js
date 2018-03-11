import React from 'react';
import { TabNavigator, StackNavigator } from 'react-navigation';
import MapScreen from './screens/MapScreen';
import AboutScreen from './screens/AboutScreen';
import InfoScreen from './screens/InfoScreen';
import { Provider } from 'react-redux';
import store from './store';

export default class App extends React.Component {

render() {
    const MainNavigator = TabNavigator({
        main: { screen: TabNavigator({
          other: {
          screen: StackNavigator({
             map: { screen: MapScreen },
            info: { screen: InfoScreen }
          })
        },            
            about: { screen: AboutScreen }
        }) },           
      }, {navigationOptions: {
        tabBarVisible: false 
      }   
      }           
    );

    return (
      <Provider store={store}>
        <MainNavigator />
      </Provider>
    );
  }

}
