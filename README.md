# Chat-App

### Introduction

This chat app is created using [React-Native](https://reactnative.dev/docs/getting-started).
### Installation and Set-up

Install [Expo](https://expo.io/learn) in the terminal with:
  ```sh
  $ npm install expo-cli --global
  ```
Create a new Expo project in the terminal:
  ```sh
  $ expo init chat-app
  ```
Run the project in the terminal:
  ```sh
  $ npm start
  ``` 
  or 
  ```sh
  $ expo start
  ```
### Necessary Libraries
```sh
$ npm install –save react-navigation
$ npm install @react-navigation/native
$ npm install @react-navigation/stack
$ expo install react-native-reanimated
$ expo install react-native-gesture-handler
$ expo install react-native-screens
$ expo install react-native-safe-area-context
$ expo install @react-native-community/masked-view
$ npm install react-native-gifted-chat –save
$ npm install prop-types
$ expo install @react-native-community/async-storage
$ npm install –save @react-native-community/netinfo
$ expo install expo-image-picker
$ expo install expo-permissions
$ expo install expo-location
$ expo install react-native-maps
```

### Database Configuration

Google Firebase is used in this app for database storage.  To set up a database, click this [Firebase](https://firebase.google.com/) link and follow these instructions:
* Click on 'Sign In' using own Google credentials
* Click on 'Go to console'
* Click on 'Create Project'
  * Give the project a name
  * Click on 'Create Project' (this will create the actual project)
* Under the 'Develop' section of the menu, click on 'Cloud Firestore'
* Click on 'Create database'
  * Select 'Start in test mode', click 'Next'
  * Select region closest to you in 'Multi-region' label, click 'Done'
* Create a collection

Once the set-up is complete, configure the database in the Chat.js file of the app.
* Go to the Firestore project and click on the gear icon (Project Settings)
* Under General tab, scroll to the section titled 'Your apps'
* Click on 'Firestore for the Web' button which could also be shown as a '</>' icon
* Add a name for the application then click 'Register'
* Copy everything from 'firebaseConfig' to 'measurementId:'

Go back to the Chat.js file of the app
* Import firebase above the class component
  `const firebase = require('firebase');`
  `require('firebase/firestore);`
* Paste the config file from firebase in the class component

### Development Environments

Download [Android_Studio](https://developer.android.com/studio) on your PC for emulator testing.
-or-
Download Expo directly on your smart phone for simulator testing from Apple Store or Google Play Store.

**Use [Kanban](https://ora.pm/project/256560/kanban) boards to keep up with your progress**