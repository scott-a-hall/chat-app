import React from 'react';
import { ImageBackground, View, Text, TextInput, TouchableOpacity, Button, StyleSheet } from 'react-native';

export default class Start extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            color: ''
        };
    }

    render() {
        return (
            <ImageBackground source={require("../assets/BackgroundImage.png")} style={styles.image}>
                <View style={styles.container}>
                    <Text style={styles.title}>
                        Chat App
                    </Text>
                    <View style={styles.selection}>
                        <TextInput
                            style={styles.userInput}
                            onChangeText={(name) => this.setState({ name })}
                            value={this.state.name}
                            placeholder='Your name'
                        />
                        <Text style={styles.chatColor}>
                            Choose background color:
                        </Text>
                        <View style={styles.colorOptions}>
                            <TouchableOpacity
                                onPress={() => this.setState({ color: '#090C08' })}
                                style={[styles.colorButton, styles.colorButton1]}
                            />
                            <TouchableOpacity
                                onPress={() => this.setState({ color: '#474056' })}
                                style={[styles.colorButton, styles.colorButton2]}
                            />
                            <TouchableOpacity
                                onPress={() => this.setState({ color: '#8A95A5' })}
                                style={[styles.colorButton, styles.colorButton3]}
                            />
                            <TouchableOpacity
                                onPress={() => this.setState({ color: '#B9C6AE' })}
                                style={[styles.colorButton, styles.colorButton4]}
                            />
                        </View>
                        <Button
                            accessible={true}
                            accessibilityLabel="start chatting"
                            color="#708573"
                            title="Start Chatting"
                            onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, color: this.state.color })}
                        />
                    </View>
                </View>
            </ImageBackground >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    title: {
        fontSize: 45,
        fontWeight: '600',
        color: '#fff',
        flex: .6,
        marginTop: 15
    },
    selection: {
        flex: .6,
        backgroundColor: '#fff',
        alignItems: 'center',
        height: '44%',
        width: '88%',
        marginBottom: 20
    },
    userInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
        opacity: .5,
        marginTop: 20,
        marginBottom: 20,
        width: '88%'
    },
    chatColor: {
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
        opacity: '100%',
        width: '88%'
    },
    colorOptions: {
        flex: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        margin: 15,
        width: '88%'
    },
    colorButton: {
        height: 50,
        width: 50,
        borderRadius: 25,
        margin: 5
    },
    colorButton1: {
        backgroundColor: '#090C08'
    },
    colorButton2: {
        backgroundColor: '#474056'
    },
    colorButton3: {
        backgroundColor: '#8A95A5'
    },
    colorButton4: {
        backgroundColor: '#B9C6AE'
    }
});