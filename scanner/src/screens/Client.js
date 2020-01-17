import React from 'react';
import { Text, View, ScrollView, Alert, TouchableOpacity, Dimensions } from 'react-native';
import { Header, Overlay, Button, ListItem } from 'react-native-elements';
import { Spinner } from 'native-base';
import { api } from '../const';
export default class Client extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      authData           : {},
      loading            : true,
      selectStoreVisible : true,
      selectedStore      : undefined,
      allStores          : [],
      
    };
  }

  componentDidMount() {
    const auth = this.props.navigation.getParam('auth');
    this.setState({ authData : auth }, () => this.setState({ loading : false }))
    this.fetchAllStores();
  }

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
            <Text style={{ color : '#fff', fontSize : 14 }}>{this.state.authData.fname}</Text>
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
    this.setState({
      selectStoreVisible : false,
      selectedStore      : store
    })
  };

  renderSelectStore = () => {
    return (
      <Overlay isVisible={this.state.selectStoreVisible} >
        <View style={{
            marginTop : 100,
            flexDirection : 'column'
          }}
        >
          <View>
            <Text>Select one of the stores below</Text>
          </View>
          <ScrollView>
            {
              this.state.allStores.map((store, index) => (
                <ListItem
                  key={index}
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

  renderContent = () => (
    <View style={{
        margin : 10,
        marginTop : Math.round(Dimensions.get('window').height) - 150,
        flexDirection : 'row',
        justifyContent : 'space-between'
      }}>
        {this.renderSelectStore()}
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
    return (
      <View style={{ flex: 1 }}>
        {this.renderHeader()}
        {this.renderContent()}
      </View>
    );
  }
}
