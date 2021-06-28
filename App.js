import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import * as firebase from "firebase";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducers from "./redux/reducers";

import Loading from "./components/Loading";
import Main from "./components/Main";
import Add from "./components/main/Add";
import Save from "./components/main/Save";
import { Login, Landing, Register } from "./components/auth";

const store = createStore(rootReducers, applyMiddleware(thunk));

const Stack = createStackNavigator();

const firebaseConfig = {
  apiKey: "AIzaSyA3gP7lEGba9W32Vx_0oZ0mippcWvgYgKw",
  authDomain: "insta-clone-d676e.firebaseapp.com",
  projectId: "insta-clone-d676e",
  storageBucket: "insta-clone-d676e.appspot.com",
  messagingSenderId: "31657955599",
  appId: "1:31657955599:web:f94bb8b2cfdf3e689bee7a",
  measurementId: "G-RS6HK515C8",
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    // subscribe to the users current authentication state
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loaded: true,
          loggedIn: false,
        });
      } else {
        this.setState({
          loaded: true,
          loggedIn: true,
        });
      }
    });
  }

  render() {
    const { loaded, loggedIn } = this.state;
    if (!loaded) {
      return <Loading />;
    }

    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Landing"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Landing" component={Landing} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }

    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Main"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Main" component={Main} />
            <Stack.Screen name="Add" component={Add} />
            <Stack.Screen name="Save" component={Save} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}
