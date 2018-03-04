import React from 'react';
import { TabNavigator } from 'react-navigation';
import MapScreen from './screens/MapScreen';
import DeckScreen from './screens/DeckScreen';
import { Provider } from 'react-redux';
import store from './store';

export default class App extends React.Component {

render() {
    const MainNavigator = TabNavigator({      
        map: { screen: MapScreen },
        deck: { screen: DeckScreen }
    });

    return (
      <Provider store={store}>
        <MainNavigator />
      </Provider>
    );
  }

}
