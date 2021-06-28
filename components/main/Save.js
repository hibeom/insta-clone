import React from "react";
import { useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";

import firebase from "firebase";
import { TextInput } from "react-native-gesture-handler";
require("firebase/firestore");

export default function Save(props) {
  const [caption, setCaption] = useState("");

  const uploadImage = async () => {
    const uri = props.route.params.image;
    const childPath = `post/${
      firebase.auth().currentUser.uid
    }/${Math.random().toString(36)}`;

    const response = await fetch(uri);
    const blob = await response.blob();

    const uploadTask = firebase.storage().ref().child(childPath).put(blob);

    uploadTask.on(
      "state_changed",
      function (snapshot) {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log("Upload is running");
            break;
        }
      },
      function (error) {
        // Handle unsuccessful uploads
        console.log(error);
      },
      function () {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          console.log("File available at", downloadURL);
          savePostData(downloadURL);
        });
      }
    );
  };

  const savePostData = (downloadURL) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(firebase.auth().currentUser.uid)
      .collection("userPosts")
      .add({
        downloadURL: downloadURL,
        caption: caption,
        creation: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => props.navigation.popToTop());
  };

  return (
    <View style={{ flex: 1 }}>
      <Button title="Save" onPress={() => uploadImage()} />
      <TextInput
        placeholder="Enter Caption"
        onChangeText={(text) => setCaption(text)}
      />
    </View>
  );
}
