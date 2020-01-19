import React from 'react';
import { Text, View, Alert, ScrollView, RefreshControl, Dimensions, TouchableOpacity } from 'react-native';
import { Header, Input, Button, ListItem } from 'react-native-elements';
import { Spinner, Picker } from 'native-base';
import BarcodeScanner from './BarcodeScanner';
import { Overlay } from 'react-native-elements';
import { api } from '../const';

export default class Store extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      authData : {},
      loading: false,
      refreshing : true,
      price : '',
      barcode : '',
      quantity : '',
      productName : '',
      barcodeExists : false,
      cameraVisible : false,
      fillProductDetailsVisible : false,
      editProductDetailsVisible : false,
      editStoreDetailsVisible : false,
      storeName    : '',
      storeAddress : '',
      storeIBAN    : '',
      products : []
    };
  }

  componentDidMount() {
    this.fetchStoreDetails();
    this.fetchStoreProducts();
  }

  checkIfBarcodeExists(barcode) {
    const sid = this.props.navigation.getParam('auth').sid;
    const url = api.root + api.product + barcode + '/' + sid;
    console.log(url);
    fetch(url, {
        method: 'GET',
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      if (responseJson.status === 'exists'){
        this.setState({
          barcodeExists : true,
          productName : responseJson.data.pname,
          quantity : responseJson.data.quantity ? responseJson.data.quantity : '',
          price : responseJson.data.price ? responseJson.data.price : ''
        });
      } else if (responseJson.status === 'nonExistant'){
        this.setState({
          barcodeExists : false
        });
      }
       else if(responseJson.status === 'fail') {
        Alert.alert('Something went wrong...');
      }
    })
    .catch((error) => {
        console.error(error);
    });

  }

  logOut = () => {
    this.props.navigation.navigate('Home');
  }

  renderHeader = () => (
    <Header
      placement="center"
      leftComponent={
        <View style={{flexDirection : 'column', width : Math.round(Dimensions.get('window').width / 2)}}>
          <Text style={{ color : '#fff', fontSize : 14 }}>{this.props.navigation.getParam('auth').fname}</Text>
          <Text style={{ color : '#fff', fontSize : 14 }}>{this.state.storeName}</Text>
        </View>
      }
      rightComponent={
        <View style={{flexDirection : 'column', alignItems : 'flex-end' ,width : Math.round(Dimensions.get('window').width / 2)}}>
          <TouchableOpacity onPress={this.logOut}>
            <Text style={{color : 'white'}}>Log out</Text>
          </TouchableOpacity>
        </View>
      }
      containerStyle={{ backgroundColor: '#2B2F33' }}
    />
  );

  readBarcode = (barcode) => {
    this.setState({
      barcode : barcode.data,
      productName : '',
      price : '',
      quantity : '',
      cameraVisible : false,
      fillProductDetailsVisible : true,
    });
    this.checkIfBarcodeExists(barcode.data);
  };

  showScanner = () => {
    this.setState({cameraVisible:true})
  };

  postProduct = () => {
    fetch(api.root + api.addProduct, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sid: this.props.navigation.getParam('auth').sid,
          barcode: this.state.barcode,
          pname : this.state.productName,
          price : parseInt(this.state.price, 10),
          quantity : parseInt(this.state.quantity, 10)
        }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.status === 'ok'){
        this.fetchStoreProducts();
      } else {
        Alert.alert('Something went wrong...');
      }
    })
    .catch((error) => {
        console.error(error);
    });
  }

  renderAddProductForm = () => (
    <Overlay isVisible={this.state.fillProductDetailsVisible} onBackdropPress={() => this.setState({fillProductDetailsVisible : false})}>
      <View style={{
          marginTop : 100,
          flexDirection : 'column'
        }}>
        <Input
          label='Barcode'
          placeholder={this.state.barcode}
          editable={false}
        />
        <Input
          label='Product Name'
          placeholder={'...'}
          value={this.state.productName}
          editable={!this.state.barcodeExists}
          onChangeText={(text) => this.setState({productName : text})}
        />
        <Input
          label='Price/unit'
          placeholder='...'
          keyboardType={'numeric'}
          value={this.state.price.toString()}
          onChangeText={(text) => this.setState({price : text})}
        />
        <Input
          label='Quantity'
          placeholder='...'
          keyboardType={'numeric'}
          value={this.state.quantity.toString()}
          onChangeText={(text) => this.setState({quantity : text})}
        />
        <Button title="Add product" onPress={() => this.postProduct()} containerStyle={{marginTop : 10}}/>
      </View>
    </Overlay>
  );

  renderEditProductForm = () => {
    return (
      <Overlay isVisible={this.state.editProductDetailsVisible} onBackdropPress={() => this.setState({editProductDetailsVisible : false})}>
        <View style={{
            marginTop : 100,
            flexDirection : 'column'
          }}>
          <Input
            label='Barcode'
            placeholder={this.state.barcode}
            editable={false}
          />
          <Input
            label='Product Name'
            placeholder={'...'}
            value={this.state.productName}
            editable={false}
            onChangeText={(text) => this.setState({productName : text})}
          />
          <Input
            label='Price/unit'
            placeholder='...'
            keyboardType={'numeric'}
            value={this.state.price.toString()}
            onChangeText={(text) => this.setState({price : text})}
          />
          <Input
            label='Quantity'
            placeholder='...'
            keyboardType={'numeric'}
            value={this.state.quantity.toString()}
            onChangeText={(text) => this.setState({quantity : text})}
          />
          <Button title="Edit product" onPress={() => this.postProduct()} containerStyle={{marginTop : 10}}/>
        </View>
      </Overlay>
    );
  };

  renderEditStoreDetailsForm = () => {
    return (
      <Overlay isVisible={this.state.editStoreDetailsVisible} onBackdropPress={() => this.setState({editStoreDetailsVisible : false})}>
        <View style={{
          marginTop : 100,
          flexDirection : 'column'
          }}>
            <Input
              label='Store name'
              placeholder={'...'}
              value={this.state.storeName}
              onChangeText={(text) => this.setState({storeName : text})}
            />
            <Input
              label='Store address'
              placeholder={'...'}
              value={this.state.storeAddress}
              onChangeText={(text) => this.setState({storeAddress : text})}
            />
            <Input
              label='IBAN'
              placeholder='...'
              value={this.state.storeIBAN}
              onChangeText={(text) => this.setState({storeIBAN : text})}
            />
            <Button title="Update details" onPress={() => this.updateStoreDetails()} containerStyle={{marginTop : 10}}/>
        </View>
      </Overlay>
    );
  }

  fetchStoreDetails = () => {
    const sid = this.props.navigation.getParam('auth').sid;
    if (sid){
      fetch(api.root + api.store + sid, {
        method: 'GET',
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status === 'ok'){
          console.log(responseJson);
          this.setState({
            storeName    : responseJson.data[0].name,
            storeAddress : responseJson.data[0].adress,
            storeIBAN    : responseJson.data[0].iban
          });
        } else {
          Alert.alert('Something went wrong...');
        }
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }

  fetchStoreProducts = () => {
    const sid = this.props.navigation.getParam('auth').sid;
    if (sid){
      fetch(api.root + api.getAllProducts + sid, {
        method: 'GET',
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status === 'ok'){
          console.log(responseJson);
          this.setState({
            refreshing : false,
            products : responseJson.data
          });
        } else {
          Alert.alert('Something went wrong...');
        }
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }

  updateStoreDetails = () => {
    const sid = this.props.navigation.getParam('auth').sid;
    fetch(api.root + api.store + sid, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name : this.state.storeName,
          address : this.state.storeAddress,
          iban : this.state.storeIBAN
        }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      if (responseJson.status === 'ok'){
        Alert.alert('Details updated!');
      } else {
        Alert.alert('Something went wrong...');
      }
    })
    .catch((error) => {
        console.error(error);
    });
  }

  renderContent = () => {
    return (
      <View style={{
          margin : 10,
          flexDirection : 'row',
          justifyContent : 'space-between'
        }}>

        <Button title="Scan" containerStyle={{width : '45%'}} onPress={() => this.showScanner()}/>
        <Button title="Edit store details" containerStyle={{width : '45%'}} onPress={() => this.setState({editStoreDetailsVisible : true})}/>
        {this.renderAddProductForm()}
        {this.renderEditProductForm()}
        {this.renderEditStoreDetailsForm()}

      </View>
    );
  }

  editProduct = (product) => {
    this.setState({
      price : product.price,
      barcode : product.barcode,
      quantity : product.quantity,
      productName : product.pname,
      editProductDetailsVisible : true
    });
  };

  _onRefresh = () => {
    this.setState({
      refreshing : true
    });
    this.fetchStoreProducts();
  };

  render() {
    if (!this.props.navigation.getParam('auth').sid) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Spinner color="green" />
        </View>
      );
    }
    if (this.state.cameraVisible)
      return (
        <BarcodeScanner readBarcode={this.readBarcode}/>
      );
    return (
      <View style={{ flex: 1 }}>
        {this.renderHeader()}
        {this.renderContent()}
        <ScrollView 
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          {
            this.state.products.map((l, i) => (
              <ListItem
                key={i}
                title={<Text style={{fontWeight: 'bold', fontSize:18}}>{l.pname}</Text>}
                subtitle={l.barcode}
                onPress={() => this.editProduct(l)}
                rightElement={
                  <View style={{
                      width: '25%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start'
                    }}>
                    <Text style={{color:'green'}}>{l.price} RON</Text>
                    <Text style={{fontWeight: 'bold'}}>{l.quantity} Pcs</Text>
                  </View>
                }
                bottomDivider
              />
            ))
          }
        </ScrollView>
      </View>
    );
  }
}
