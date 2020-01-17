import React from 'react';
import { View } from 'react-native';
import { Header, Input, Button } from 'react-native-elements';
import { Spinner } from 'native-base';
import { api } from '../const.js';

export default class Login extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username : 'client',
      password : 'client'
    }
  }

  goBack() {
    this.props.navigation.navigate('Home');
  }

  doLogin = () => {
    fetch(api.root + api.login, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
        }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.status === 'ok')
        this.setState({
          loginData : responseJson.data
        });
        if (responseJson.data.type === 1)
          this.props.navigation.navigate('Store', {
            auth : responseJson.data
          });
        else
          this.props.navigation.navigate('Client', {
            auth : responseJson.data
          });
    })
    .catch((error) => {
        console.error(error);
    });
  }
  renderHeader = () => (
    <Header
      placement="center"
      leftComponent={{ icon: 'arrow-back', color: '#fff', onPress: () => this.goBack() }}
      centerComponent={{ text: 'Login', style: { color: '#fff', fontSize: 19 } }}
      containerStyle={{ backgroundColor: '#2B2F33' }}
    />
  );

  renderContent = () => (
    <View style={{
        margin : 10,
        flexDirection : 'column'
      }}>
      <Input
        label='Username'
        placeholder='...'
        onChangeText={(text) => this.setState({username : text})}
      />
      <Input
        label='Password'
        placeholder='...'
        onChangeText={(text) => this.setState({password : text})}
      />
      <Button title="Log in" onPress={() => this.doLogin()} containerStyle={{marginTop : 10}}/>
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
        <View style={{
            flex : 1,
            justifyContent : 'center'
          }}
        >
          {this.renderContent()}
        </View>
      </View>
    );
  }
}
