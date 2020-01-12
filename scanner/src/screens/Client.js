import React from 'react';
import { Text, View, ScrollView, Alert, Linking, Dimensions } from 'react-native';
import { Header, Input, SearchBar, Button } from 'react-native-elements';
import { Spinner, ListItem, Separator } from 'native-base';
import IconF from 'react-native-vector-icons/FontAwesome';

import { Font } from 'expo';

export default class Client extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      authData : {},
      loading: true
    };
  }

  componentDidMount() {
    this.setState({
      authData : JSON.stringify(this.props.navigation.getParam('auth'))
    }, () => this.setState({loading : false}))
  }

  renderHeader = () => (
    <Header
      placement="center"
      centerComponent={{ text: 'Welcome, ' + this.props.navigation.getParam('auth').fname, style: { color: '#fff', fontSize: 19 } }}
      containerStyle={{ backgroundColor: '#2B2F33' }}
    />
  );

  renderContent = () => (
    <View style={{
        margin : 10,
        marginTop : Math.round(Dimensions.get('window').height) - 150,
        flexDirection : 'row',
        justifyContent : 'space-between'
      }}>
      <Button
        title="Log in"
        containerStyle={{width : '45%'}}
        onPress={() => this.goToLogin()}
      />
    <Button title="Register" containerStyle={{width : '45%'}} onPress={() => this.goToRegister()}/>
    </View>
  );

  isLoading = () => {
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Spinner color="green" />
        </View>
      );
    }
  }

  render() {
    this.isLoading();
    return (
      <View style={{ flex: 1 }}>
        {this.renderHeader()}
        {this.renderContent()}
      </View>
    );
  }
}
