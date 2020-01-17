import React from 'react';
import { View, Alert, KeyboardAvoidingView, Picker } from 'react-native';
import { Header, Input, Button } from 'react-native-elements';
import { Spinner } from 'native-base';
import { api } from '../const.js';

export default class Register extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username  : '',
      email     : '',
      password  : '',
      firstName : '',
      lastName  : '',
      type      : 'Client'
    }
  }
  goBack() {
    this.props.navigation.navigate('Home');
  }

  renderHeader = () => (
    <Header
      placement="center"
      leftComponent={{ icon: 'arrow-back', color: '#fff', onPress: () => this.goBack() }}
      centerComponent={{ text: 'Register', style: { color: '#fff', fontSize: 19 } }}
      containerStyle={{ backgroundColor: '#2B2F33' }}
    />
  );


  registerUser = (sid = null) => {
     fetch(api.root + api.register, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uname: this.state.username,
          password: this.state.password,
          fname: this.state.firstName,
          lname: this.state.lastName,
          type: this.state.type === 'Client' ? 0 : 1,
          email: this.state.email,
          sid: sid
        }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("user : ");
      console.log(responseJson);
      if (responseJson.status === 'ok'){
        Alert.alert('You have been successfully registered!');
        this.props.navigation.navigate('Login');
      } else {
        Alert.alert('Something went wrong...');
      }
    })
    .catch((error) => {
        console.error(error);
    });
  };

  registerStore = async() => {
    await fetch(api.root + api.store, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: this.state.firstName + ' ' + this.state.lastName,
          address: ''
        }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("store : ");
      console.log(responseJson);
      if (responseJson.status === 'ok'){
        this.registerUser(responseJson.data);
      } else {
        Alert.alert('Something went wrong...');
      }
    })
    .catch((error) => {
        console.error(error);
    });
  }

  register = () => {
    if (this.state.type === 'Client'){
      this.registerUser();
    } else {
      this.registerStore();
    }
  }

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
        label='E-mail'
        placeholder='...'
        onChangeText={(text) => this.setState({email : text})}
      />
      <Input
        label='First Name'
        placeholder='...'
        onChangeText={(text) => this.setState({firstName : text})}
      />
      <Input
        label='Last Name'
        placeholder='...'
        onChangeText={(text) => this.setState({lastName : text})}
      />
      <Input
        label='Password'
        placeholder='...'
        onChangeText={(text) => this.setState({password : text})}
      />
      <Picker
        selectedValue={this.state.type}
        style={{height: 50}}
        onValueChange={(itemValue, itemIndex) =>
          this.setState({type: itemValue})
        }>
        <Picker.Item label="Client" value="Client" />
        <Picker.Item label="Store" value="Store" />
      </Picker>
      <Button title="Register" onPress={() => this.register()} containerStyle={{marginTop : 10}}/>
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
        <KeyboardAvoidingView style={{
            flex : 1,
            justifyContent : 'center'
          }}
          behavior="height"
        >
          {this.renderContent()}
        </KeyboardAvoidingView>
      </View>
    );
  }
}
