import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import firebase from "firebase";

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      name: "",
    };
    this.onSignUp = this.onSignUp.bind(this);
  }

  onSignUp() {
    const { email, password, name } = this.state;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .set({
            name: name,
            email: email,
          });
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
          style={styles.textInput}
          placeholder="Enter e-mail"
          onChangeText={(text) => this.setState({ email: text })}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Enter password"
          onChangeText={(text) => this.setState({ password: text })}
          secureTextEntry
        />
        <TextInput
          style={styles.textInput}
          placeholder="Enter name"
          onChangeText={(text) => this.setState({ name: text })}
        />
        <Button title="Sign Up" onPress={() => this.onSignUp()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    height: 20,
    marginVertical: 10,
  },
});
