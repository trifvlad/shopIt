import React from 'react';
import { Text, View, Image, Alert, Linking, Dimensions } from 'react-native';
import { Header, Input, SearchBar, Button } from 'react-native-elements';
import { Spinner, ListItem, Separator } from 'native-base';
import logo from '../../assets/logo.jpeg';

export default class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      authData : {}
    };
  }

  goToLogin = () => {
    this.props.navigation.navigate('Login');
  }

  goToRegister = () => {
    this.props.navigation.navigate('Register');
  }

  renderHeader = () => (
    <Header
      placement="center"
      centerComponent={{ text: 'Welcome to ShopIt', style: { color: '#fff', fontSize: 19 }}}
      containerStyle={{ backgroundColor: '#2B2F33' }}
    />
  );

  renderContent = () => (
    <View style={{
        margin : 10,
        flexDirection : 'column'
      }}>
        <Image source={logo} style={{
          width : logo.width
        }} />
        <View style={{
          flexDirection : 'row',
          justifyContent : 'space-between',
          marginTop : Math.round(Dimensions.get('window').height/3.3)
        }}>
          <Button title="Log in" containerStyle={{width : '45%'}} onPress={() => this.goToLogin()}/>
          <Button title="Register" containerStyle={{width : '45%'}} onPress={() => this.goToRegister()}/>
        </View>
    </View>
  );

  isLoading = () => {
    if (true) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Spinner color="green" />
        </View>
      );
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderHeader()}
        {this.renderContent()}
      </View>
    );
  }
}
