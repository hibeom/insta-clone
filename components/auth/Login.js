import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import firebase from "firebase";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
    // this.onSignIn = this.onSignIn.bind(this);
  }

  onSignIn() {
    const { email, password } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TextInput
          placeholder="Enter e-mail"
          onChangeText={(text) => this.setState({ email: text })}
        />
        <TextInput
          placeholder="Enter password"
          onChangeText={(text) => this.setState({ password: text })}
        />
        <Button title="Sign In" onPress={() => this.onSignIn()} />
      </View>
    );
  }
}
