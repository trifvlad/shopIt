import React, { Component } from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import Home from './screens/Home';
import Login from './screens/Login';
import Register from './screens/Register';
import Store from './screens/Store';
import Client from './screens/Client';
import BarcodeScanner from './screens/BarcodeScanner';
import TopUp from './screens/TopUp';

export default class Index extends Component {
  render() {
    return (
      <AppContainer />
    );
  }
}

const AppSwitchNavigator = createSwitchNavigator({
  Home: { screen: Home },
  Login: { screen: Login},
  Register: { screen: Register},
  Store: { screen: Store},
  Client: { screen: Client },
  BarcodeScanner: { screen: BarcodeScanner },
  TopUp: { screen : TopUp }
});

const AppContainer = createAppContainer(AppSwitchNavigator);
