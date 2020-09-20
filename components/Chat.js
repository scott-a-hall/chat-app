import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

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
        }

        var firebaseConfig = {
            apiKey: "AIzaSyC3t9OfTAt7QUvlG1pG7ZezCVeN65fzA9M",
            authDomain: "chat-app-57c52.firebaseapp.com",
            databaseURL: "https://chat-app-57c52.firebaseio.com",
            projectId: "chat-app-57c52",
            storageBucket: "chat-app-57c52.appspot.com",
            messagingSenderId: "1061771951937",
        }
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig)
        }

        this.referenceMessages = firebase.firestore().collection('messages');
    }

    componentDidMount() {
        //Listen to authentication events
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
            if (!user) {
                await firebase.auth().signInAnonymously();
            }
            //update user state with currently active user data
            this.setState({
                /*Set static message*/
                messages: [],
                user: {
                    _id: user.uid,
                    name: this.props.route.params.name,
                },
                loggedInText: this.props.route.params.name + ' has entered the chat',
            });

            //Create a reference to the active user's messages
            this.referenceMessagesUser = firebase.firestore().collection('messages').where('uid', '==', this.state.uid);
            //Listen for changes for current user
            this.unsubscribeMessagesUser = this.referenceMessagesUser.onSnapshot(this.onCollectionUpdate);
        });
    }

    componentWillUnmount() {
        //Stop listening to authentication
        this.authUnsubscribe();
        //Stop listening for changes
        this.unsubscribeMessagesUser();
    }

    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        //Go through each document
        querySnapshot.forEach((doc) => {
            //Get the QueryDocumentSnapshot's data
            var data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt,
                uid: data.uid,
                user: {
                    _id: data.user._id,
                    name: data.user.name,
                    avatar: data.user.avatar,
                },
            });
        });
        this.setState({
            messages,
        });
    }

    addMessage() {
        //Add new message to chat
        this.referenceMessages.add({
            _id: this.state.messages[0]._id,
            text: this.state.messages[0].text || '',
            createdAt: this.state.messages[0].createdAt,
            user: this.state.messages[0].user,
            sent: true
        })
    }

    //Allow previous messages to be viewed after new messages are sent
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }), () => {
            this.addMessage();
        });
    }

    render() {
        //Pull username from Start screen
        let name = this.props.route.params.name;
        //Pull background color selection from Start screen
        let color = this.props.route.params.color;

        //Set username in Chat screen
        this.props.navigation.setOptions({ title: name });

        return (
            <View style={{
                flex: 1,
                backgroundColor: color
            }}>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={this.state.user}
                />
                {/*Force height of keyboard to not overlap chat view*/}
                { Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null}
            </View>
        )
    }
}