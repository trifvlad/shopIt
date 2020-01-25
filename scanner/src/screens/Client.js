import React from 'react';
import { Text, View, ScrollView, Alert, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Header, Overlay, Button, ListItem, Input } from 'react-native-elements';
import { Spinner } from 'native-base';
import { api } from '../const';
import BarcodeScanner from './BarcodeScanner';
import { CreditCardInput } from "react-native-credit-card-input";
import RNQRGenerator from 'rn-qr-generator';

export default class Client extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      authData           : {},
      loading            : true,
      selectStoreVisible : true,
      selectedStore      : undefined,
      allStores          : [],
      shoppingCartItems  : [],
      cameraVisible      : false,
      topUpFormVisible   : false,
      topUpAmount        : 0,
      paymentDoneVisible : false,
      greenTickURL       : 'https://www.yourhipaatraining.com/images/green-tick.png'
    };
  }

  reInit = () => {
    this.setState({
      selectStoreVisible : true,
      selectedStore      : undefined,
      shoppingCartItems  : [],
      paymentDoneVisible : false
    });
  }

  renderPaymentDone = () => {
    let chitanta = [];
    let sum = 0;
    this.state.shoppingCartItems.forEach(p => {
      chitanta.push({
        name     : p.pname,
        quantity : p.quantity,
        price    : parseInt(p.price, 10) * parseInt(p.quantity, 10)
      })
      sum += parseInt(p.price, 10) * parseInt(p.quantity, 10)
    });
    return (
      <Overlay isVisible={this.state.paymentDoneVisible} onBackdropPress={this.reInit} >
        <View style={{ flex : 1, justifyContent : 'center', flexDirection : 'column' }}>
          <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
            <Image style={{width: 50, height: 50}} source={{uri: this.state.greenTickURL}} />
            <Text style={{marginBottom : 5, fontSize : 20, fontWeight : 'bold'}}>Payment sent!</Text>
          </View>
          <View style={{ width:'100%', flexDirection : 'column', justifyContent : 'center', alignItems : 'center'}}>
            {
              chitanta.map(p => {
                return (
                  <Text style={{fontWeight : 'bold'}}>{p.name} * {p.quantity} -> {p.price} RON</Text>
                );
              })
            }
            <Text style={{fontWeight : 'bold'}}>Total : {sum} RON</Text>
          </View>
        </View>
      </Overlay>
    );
  };

  componentDidMount() {
    const auth = this.props.navigation.getParam('auth');
    this.setState({ authData : auth }, () => this.setState({ loading : false }))
    this.fetchAllStores();
  }

  refreshUserData = () => {
    fetch(api.root + api.login, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.authData.uname,
        password: this.state.authData.pwd,
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.status === 'ok')
        this.setState({
          authData : responseJson.data
        });
    })
    .catch((error) => {
        console.error(error);
    });
  };

  fetchAllStores = () => {
    this.setState({ loading : true });
    fetch(api.root + api.store, {
      method: 'GET',
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.status === 'ok'){
        console.log('All stores : ', responseJson.data);
        this.setState({
          allStores : responseJson.data,
          loading : false
        });
      } else {
        Alert.alert('Something went wrong...');
      }
    })
    .catch(error => console.error(error));
  };

  logOut = () => {
    this.props.navigation.navigate('Home');
  };

  renderHeader = () => {
    return (
      <Header
        placement="center"
        leftComponent={
          <View style={{flexDirection : 'column', width : Math.round(Dimensions.get('window').width / 2)}}>
            <View style={{flexDirection : 'row'}}>
              <Text style={{ color : '#fff', fontSize : 14 }}>{this.state.authData.fname} - B : {this.state.authData.balance} RON - </Text>
              <TouchableOpacity 
                style={{
                  width : 50
                }}
                onPress={() => this.setState({topUpFormVisible : true})}
              >
                <Text style={{color : 'green'}}>Top Up</Text>
              </TouchableOpacity>
            </View>
            {this.state.selectedStore && <Text style={{ color : '#fff', fontSize : 14 }}>{this.state.selectedStore.name}</Text>}
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
  };

  selectStore = (store) => {
    if (this.state.selectedStore) {
      Alert.alert(
        'Do you wish to continue?',
        'Changing the shop will empty your current shopping cart.',
        [
          {
            text: 'No',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Yes', 
            onPress: () => this.setState({
              selectStoreVisible : false,
              selectedStore      : store,
              shoppingCartItems  : this.state.selectedStore.name === store.name ? this.state.shoppingCartItems : []
            })
          },
        ],
        {cancelable: false},
      );
    } else {
      this.setState({
        selectStoreVisible : false,
        selectedStore      : store
      })
    }
  };

  fetchStoreProduct = (barcode) => {
    const sid = this.state.selectedStore.sid;
    const url = api.root + api.checkProductForClient + barcode + '/' + sid;
    if (sid){
      fetch(url, {
        method: 'GET',
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.status === 'exists'){
          this.addToCart(responseJson.data);
        } else if (responseJson.status === 'nonExistant'){
          Alert.alert('This product does not exist in the current store.')
        } else {
          Alert.alert('Something went wrong...');
        }
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }

  addToCart(product){
    const cart = this.state.shoppingCartItems;
    let changedQuantity = false;
    cart.forEach(p => {
      if (p.id === product.id) {
        p.quantity = parseInt(p.quantity, 10) + 1;
        changedQuantity = true;
      }
    });
    if (!changedQuantity) {
      product.quantity = 1;
      cart.push(product);
    }
    this.setState({
      shoppingCartItems : cart
    }, () => console.log(this.state.shoppingCartItems));
  };

  readBarcode = (barcode) => {
    this.setState({
      cameraVisible : false
    });
    this.fetchStoreProduct(barcode.data);
  };

  processTopUp = () => {
    fetch(api.root + api.topUp + '/' + this.state.authData.uid, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount : this.state.topUpAmount
      }),
    })
    .then((response) => {
      response.json()
    })
    .then((responseJson) => {
      this.setState({
        authData : {
          ...this.state.authData,
          balance : parseInt(this.state.authData.balance, 10) + parseInt(this.state.topUpAmount, 10)
        },
        topUpAmount : 0,
        topUpFormVisible : false
      })
    })
    .catch((error) => {
      console.error(error);
    });
  };

  _onChange = () => form => console.log(form);

  renderTopUpForm = () => {
    return (
      <Overlay isVisible={this.state.topUpFormVisible} onBackdropPress={() => this.setState({topUpFormVisible : false})} >
        <View style={{
            flex : 1,
            justifyContent : 'center',
            flexDirection : 'column'
          }}
        >
          <CreditCardInput onChange={this._onChange} allowScroll={true}/>
          <Input inputContainerStyle={{marginLeft : 10}} keyboardType={'numeric'} labelStyle={{marginLeft : 10}} label={'Amount to top up'} onChangeText={(text) => this.setState({topUpAmount : text})}/>
          <Button containerStyle={{marginTop : 5}} title={'Top up'} onPress={this.processTopUp}/>
        </View>
      </Overlay>
    );
  };

  renderSelectStore = () => {
    return (
      <Overlay isVisible={this.state.selectStoreVisible} >
        <View style={{
            marginTop : 100,
            flexDirection : 'column'
          }}
        >
          <ScrollView>
            {
              this.state.allStores.map((store, index) => (
                <ListItem
                  key={index}
                  containerStyle={{justifyContent:'center'}}
                  contentContainerStyle={{alignItems:'center'}}
                  title={<Text style={{fontWeight: 'bold', fontSize:18}}>{store.name}</Text>}
                  subtitle={<Text>{store.adress}</Text>}
                  onPress={() => this.selectStore(store)}
                  bottomDivider
                />
              ))
            }
          </ScrollView>
        </View>
      </Overlay>
    );
  };

  renderShoppingCartItems = () => {
    console.log('x');
    return this.state.shoppingCartItems.map((product, index) => (
      <ListItem
        key={index}
        title={<Text style={{fontWeight: 'bold', fontSize:18}}>{product.pname} * {product.quantity}</Text>}
        subtitle={product.barcode}
        rightElement={
          <View style={{
              width: '15%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start'
            }}>
            <Text style={{color:'green'}}>{product.price} RON</Text>
          </View>
        }
        bottomDivider
      />
    ));
  }

  processCheckout = () => {
    let products = [];
    let sum = 0;
    this.state.shoppingCartItems.map((p, i) => {
      products.push({
        barcode  : p.barcode,
        quantity : p.quantity
      });
      sum += parseInt(p.quantity, 10) * parseInt(p.price, 10);
    });
    let payload = {
      sid : this.state.selectedStore.sid,
      uid : this.state.authData.uid,
      cart : products
    };
    fetch(api.root + api.checkout, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      if (responseJson.status === 'ok'){
        this.refreshUserData();
        this.setState({ paymentDoneVisible : true });
      } else {
        if (this.state.authData.balance < sum)
          Alert.alert('Insufficient funds. Please top up.');
        else
          Alert.alert('Something went wrong...');
      }
    })
    .catch((error) => {
        console.error(error);
    });
  };

  renderCheckoutButton = () => {
    if (this.state.shoppingCartItems.length > 0){
      return (
        <Button title="Checkout" containerStyle={{width : '70%'}} onPress={this.processCheckout}/>
      );
    }
  };

  calculateTotal()
  {
    let total = 0;
    this.state.shoppingCartItems.forEach(function (item) {
        total += item.price*item.quantity;
    })
      return total;
  }

  renderTotal = () => {
    if (this.state.shoppingCartItems.length > 0){
      return (
        <View style={{
          width : '30%',
          alignItems : 'center',
          justifyContent : 'center'
        }}>
          <Text>{this.calculateTotal()} RON</Text>
        </View>
      );
    }
  };

  renderClientButtons = () => {
    if (!this.state.selectStoreVisible) {
      return (
        <View style={{
          flexDirection : 'row',
          justifyContent : 'space-between'
        }}>
          <Button title="Pick another store" containerStyle={{width : '45%'}} onPress={() => this.setState({ selectStoreVisible : true})}/>
          <Button title="Scan a product" containerStyle={{width : '45%'}} onPress={() => this.setState({ cameraVisible : true})}/>
        </View>
      );
    }
  }

  renderContent = () => (
    <View style={{
        margin : 10,
        flexDirection : 'column',
        justifyContent : 'center'
      }}>
        {this.renderClientButtons()}
        {this.renderSelectStore()}
        {this.renderTopUpForm()}
        {this.renderPaymentDone()}
        <ScrollView 
          style={{
            height : '80%'
          }}
        >
          {this.renderShoppingCartItems()}
        </ScrollView>
        <View style={{
          paddingTop : 5,
          width : '100%',
          flexDirection : 'row',
          justifyContent : 'space-between'
        }}>
          {this.renderCheckoutButton()}
          {this.renderTotal()}
        </View>
    </View>
  );

  renderLoader = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Spinner color="green" />
    </View>
  );

  render() {
    if (this.state.loading) {
      return this.renderLoader();
    }
    if (this.state.cameraVisible)
      return (
        <BarcodeScanner readBarcode={this.readBarcode}/>
      );
    return (
      <View style={{ flex: 1 }}>
        {this.renderHeader()}
        {this.renderContent()}
      </View>
    );
  }
}
