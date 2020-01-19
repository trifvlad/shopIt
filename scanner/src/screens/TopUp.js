import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";

import React from 'react';
import { View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Header, Input, Button } from 'react-native-elements';
import { Spinner } from 'native-base';
import { api } from '../const.js';

export default class TopUp extends React.Component {
  constructor(props){
    super(props);
  }

  goBack() {
    this.props.navigation.pop;
  }

  renderHeader = () => (
    <Header
      placement="center"
      leftComponent={{ icon: 'arrow-back', color: '#fff', onPress: () => this.goBack() }}
      centerComponent={{ text: 'Top Up', style: { color: '#fff', fontSize: 19 } }}
      containerStyle={{ backgroundColor: '#2B2F33' }}
    />
  );

  _onChange = () => form => console.log(form);

  renderContent = () => (
    <CreditCardInput onChange={this._onChange} />
  );

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderHeader()}
        <KeyboardAvoidingView 
            style={{
                flex : 1,
                justifyContent : 'center'
            }}
            behavior={'padding'}
        >
          {this.renderContent()}
        </KeyboardAvoidingView>
      </View>
    );
  }
}
