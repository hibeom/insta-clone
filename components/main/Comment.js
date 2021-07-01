import React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  Button,
} from "react-native";
import firebase from "firebase";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { fetchUsersData } from "../../redux/actions";

function Comment(props) {
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    function matchUserToComment(comments) {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].hasOwnProperty("user")) continue;
        const user = props.users.find(
          (user) => user.uid === comments[i].creator
        );
        if (user == undefined) {
          props.fetchUsersData(comments[i].creator, false);
        } else {
          comments[i].user = user;
        }
      }
      setComments(comments);
    }

    if (postId !== props.route.params.postId) {
      firebase
        .firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .doc(props.route.params.postId)
        .collection("comments")
        .get()
        .then((snapshot) => {
          let comments = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          matchUserToComment(comments);
          setPostId(props.route.params.postId);
        });
      setPostId(props.route.params.postId);
    } else {
      matchUserToComment(comments);
    }
  }, [props.route.params.postId, props.users]);

  const onCommandSend = () => {
    firebase
      .firestore()
      .collection("posts")
      .doc(props.route.params.uid)
      .collection("userPosts")
      .doc(postId)
      .collection("comments")
      .add({
        creator: firebase.auth().currentUser.uid,
        text: text,
      });
  };

  return (
    <View style={{ marginTop: 40 }}>
      <FlatList
        numColumns={1}
        data={comments}
        renderItem={({ item, index }) => {
          return (
            <View>
              <Text>{item.text}</Text>
            </View>
          );
        }}
      />
      <View>
        <TextInput
          placeholder="Leave a comment"
          onChangeText={(text) => setText(text)}
        />
        <Button title="Send" onPress={() => onCommandSend()} />
      </View>
    </View>
  );
}

const mapStateToProps = (store) => ({
  users: store.usersState.users,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
