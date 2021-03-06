import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, InputToolbar, Image } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import MapView from 'react-native-maps';

import CustomActions from './CustomActions';

// import firestore/firebase
const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      user: {
        _id: '',
        name: '',
        avatar: '',
      },
      loggedInText: '',
      uid: '',
      isConnected: false,
      image: null,
      location: null,
    };

    // configure firebase
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: 'AIzaSyC3t9OfTAt7QUvlG1pG7ZezCVeN65fzA9M',
        authDomain: 'chat-app-57c52.firebaseapp.com',
        databaseURL: 'https://chat-app-57c52.firebaseio.com',
        projectId: 'chat-app-57c52',
        storageBucket: 'chat-app-57c52.appspot.com',
        messagingSenderId: '1061771951937',
        appId: '1:1061771951937:web:ef054cdab8b10d8d576bc0',
        measurementId: 'G-S4G8BTXP7F',
      });
    }

    // reference messages from firebase
    this.referenceMessages = firebase.firestore().collection('messages');
  }

  componentDidMount() {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        // Listen to authentication events
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (!user) {
            try {
              await firebase.auth().signInAnonymously();
            } catch (error) {
              console.log('Unable to sign in');
            }
          }

          // update user state with currently active user data
          this.setState({
            messages: [],
            user: {
              _id: user.uid,
              name: this.props.route.params.name,
            },
            loggedInText: `${this.props.route.params.name} has entered the chat`,
            isConnected: true,
          });

          // Listen for changes for current user
          this.unsubscribeMessagesUser = this.referenceMessages
            .orderBy('createdAt', 'desc')
            .onSnapshot(this.onCollectionUpdate);
        });
      } else {
        this.setState({
          isConnected: false,
        });
        this.getMessages();
      }
    });
  }

  componentWillUnmount() {
    // Stop listening to authentication
    this.authUnsubscribe();
    // Stop listening for changes
    this.unsubscribeMessagesUser();
  }

  /**
   * sends messages
   * @function onSend
   * @param {object} messages
   */
  onSend(messages = []) {
    this.setState((previousState) => ({
      // Allow previous messages to be viewed after new messages are sent
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessage();
      this.saveMessages();
    });
  }

  /**
   * get data in message collection
   * @function onCollectionUpdate
   * @param {string} _id
   * @param {string} text
   * @param {date} createdAt
   * @param {string} uid
   * @param {object} user
   * @param {string} user._id
   * @param {string} user.name
   * @param {string} user.avatar
   * @param {string} image
   * @param {string} location
   */
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // Go through each document
    querySnapshot.forEach((doc) => {
      // Get the QueryDocumentSnapshot's data
      const data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        uid: data.uid,
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
        image: data.image || '',
        location: data.location || '',
      });
    });
    this.setState({
      messages,
    });
  };

  /**
   * loads all messages from AsyncStorage
   * @async
   * @function getMessages
   * @param {string} messages
  */
  getMessages = async () => {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  /**
   * saves all messages from AsyncStorage
   * @async
   * @function saveMessages
   * @param {string} messages
   */
  saveMessages = async () => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  };

  /**
   * deletes messages from AsyncStorage
   * @async
   * @function deleteMessages
   * @param {string} messages
   */
  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  /**
   * adds new messages
   * @function addMessage
   * @param {string} _id
   * @param {string} text
   * @param {date} createdAt
   * @param {object} user
   * @param {boolean} sent
   * @param {string} image
   * @param {string} location
  */
  addMessage() {
    this.referenceMessages.add({
      _id: this.state.messages[0]._id,
      text: this.state.messages[0].text || '',
      createdAt: this.state.messages[0].createdAt,
      user: this.state.messages[0].user,
      sent: true,
      image: this.state.messages[0].image || null,
      location: this.state.messages[0].location || null,
    });
  }

  /**
   * allows messages to be composed only when online
   * @function renderInputToolbar
   * @param {*} props
   */
  renderInputToolbar(props) {
    if (this.state.isConnected === false) {
    } else {
      return (
        <InputToolbar
          {...props}
        />
      );
    }
  }

  /**
   * shows the map view if geolocation is activated
   * @function renderCustomView
   * @param {*} props
   * @return {MapView}
   */
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={
            {
              width: 150,
              height: 100,
              borderRadius: 13,
              margin: 3,
            }
          }
          region={
            {
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }
          }
        />
      );
    }
    return null;
  }

  /**
   * renders pick image from photo library, access camera and access maps selection
   * @function renderCustomActions
   * @param {*} props
   * @return {CustomActions}
   */
  renderCustomActions = (props) => <CustomActions {...props} />;

  render() {
    // Pull username from Start screen
    const { name } = this.props.route.params;
    // Pull background color selection from Start screen
    const { color } = this.props.route.params;

    // Set username in Chat screen
    this.props.navigation.setOptions({ title: name });

    return (
      <View style={{
        flex: 1,
        backgroundColor: color,
      }}
      >

        {this.state.image
          && (
            <Image
              source={{ uri: this.state.image.uri }}
              style={{ width: 200, height: 200 }}
            />
          )}

        <GiftedChat
          messages={this.state.messages}
          image={this.state.image}
          onSend={(messages) => this.onSend(messages)}
          user={this.state.user}
          renderInputToolbar={(props) => this.renderInputToolbar(props)}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
        />
        {/* Force height of keyboard to not overlap chat view */}
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    );
  }
}
