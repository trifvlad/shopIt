import React, { Component } from 'react';
import {View, Button, Text, TextInput} from 'react-native';
import BarcodeScanner from './components/BarcodeScanner';

export default class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      cameraVisible : false,
      barcode : undefined,
      response : undefined
    }
  }

  getByBarcode = (barcode) => {
    fetch('http://192.168.43.246:3000/product/' + barcode.data, {
        method: 'GET'
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        response : responseJson
      });
    })
    .catch((error) => {
        console.error(error);
    });
  }

  openCamera = () => {
    this.setState({
      cameraVisible : true
    })
  };

  readBarcode = (barcode) => {
    this.setState({
      barcode : barcode,
      cameraVisible : false
    }, () => this.getByBarcode(barcode));
  };
  
  renderBarcodeText = () => {
    const {barcode, response} = this.state;

    if (response) {
      console.log(response);
      return (
        <View>
          <Text>Type : {barcode.type}</Text>
          <Text>Barcode : {barcode.data}</Text>
          <Text>Name : {response[0].pname}</Text>
        </View>
      )
    }
  }

  render () {
    if (this.state.cameraVisible){
      return (
        <BarcodeScanner readBarcode={this.readBarcode}/>
      );
    }
    return (
      <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
        <Button 
          title={'Open camera'} 
          onPress={this.openCamera}
        />
        {this.renderBarcodeText()}
      </View>
    ); 
  }
}
