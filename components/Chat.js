import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: []
        }
    }

    componentDidMount() {
        let newUser = this.props.route.params.name;

        this.setState({
            /*Set static message*/
            messages: [
                {
                    _id: 1,
                    text: 'Hello developer',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                },
                {
                    _id: 2,
                    text: newUser + ' has entered the chat',
                    createdAt: new Date(),
                    system: true,
                },
            ],
        })
    }

    //Allow previous messages to be viewed after new messages are sent
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
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
                    user={{
                        _id: 1,
                    }}
                />
                {/*Force height of keyboard to not overlap chat view*/}
                { Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null}
            </View>
        )
    }
}