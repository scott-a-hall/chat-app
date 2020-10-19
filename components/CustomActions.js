import PropTypes from 'prop-types';
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const firebase = require('firebase');
require('firebase/firestore');

export default class CustomActions extends React.Component {
    constructor() {
        super();
        this.state = {

        }
    }

    pickImage = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (status === 'granted') {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'Images',
            }).catch(error => console.log(error));

            if (!result.cancelled) {
                try {
                    const imageUrlLink = await this.uploadImage(result.uri);
                    this.props.onSend({ image: imageUrlLink });
                } catch (error) {
                    console.log(error);
                }
            }
        }
    };

    takePhoto = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);

        if (status === 'granted') {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
            }).catch(error => console.log(error));

            if (!result.cancelled) {
                try {
                    const imageUrlLink = await this.uploadImage(result.uri);
                    this.props.onSend({ image: imageUrlLink });
                } catch (error) {
                    console.log(error);
                }
            }
        }
    };

    getLocation = async () => {
        const { status } = await Permissions.askAsync(Permissions.LOCATION);

        if (status === 'granted') {
            const result = await Location.getCurrentPositionAsync({
            }).catch(error => console.log(error));

            if (result) {
                this.props.onSend({
                    location: {
                        longitude: result.coords.longitude,
                        latitude: result.coords.latitude,
                    },
                });
            }
        }
    }

    onActionPress = () => {
        const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        this.context.actionSheet().showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        console.log('user wants to pick an image');
                        this.pickImage();
                        return;
                    case 1:
                        console.log('user wants to take a photo');
                        this.takePhoto();
                        return;
                    case 2:
                        console.log('user wants to get their location');
                        this.getLocation();
                    default:
                }
            },
        );
    };

    uploadImage = async (uri) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });

        const getImageName = uri.split('/');
        const imageArrayLength = getImageName.length - 1;
        const ref = firebase
            .storage()
            .ref()
            .child(getImageName[imageArrayLength]);

        const snapshot = await ref.put(blob);

        blob.close();

        const imageURL = await snapshot.ref.getDownloadURL();
        return imageURL;
    };

    render() {
        return (
            <TouchableOpacity
                style={[styles.container]}
                onPress={this.onActionPress}
                accessible={true}
                accessibilityLabel={"More actions"}
                accessibilityHint={"Send an image or your location in the chat"}
            >
                <View style={[styles.wrapper, this.props.wrapperStyle]}>
                    <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },

    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },

    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
});

CustomActions.contextTypes = {
    actionSheet: PropTypes.func,
};