import React from "react";
import { useState, useEffect } from "react";
import firebase from "firebase";
import { View, Text, Image, StyleSheet, FlatList, Button } from "react-native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { fetchUserFollowing } from "../../redux/actions";

function Profile(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const { currentUser, posts } = props;
    const { uid } = props.route.params;
    if (uid === firebase.auth().currentUser.uid) {
      setUser(currentUser);
      setUserPosts(posts);
    } else {
      firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data());
          } else {
            console.log("does not exist");
          }
        });

      firebase
        .firestore()
        .collection("posts")
        .doc(uid)
        .collection("userPosts")
        .orderBy("creation", "asc")
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          setUserPosts(posts);
        });
    }

    if (props.following.indexOf(props.route.params.uid) > -1) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
  }, [props.route.params.uid, props.following]);

  const onSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("signed out");
      })
      .catch((error) => {
        console.log("failed sign out");
      });
  };

  const onUnFollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .delete();

    // props.fetchUserFollowing();
  };

  const onFollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .set({});

    // props.fetchUserFollowing();
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerSub}>
        <Text>{user?.name}</Text>
        <Text>{user?.email}</Text>
        {props.route.params.uid !== firebase.auth().currentUser.uid ? (
          <View>
            {following ? (
              <Button title="Following" onPress={() => onUnFollow()} />
            ) : (
              <Button title="Follow" onPress={() => onFollow()} />
            )}
          </View>
        ) : (
          <Button onPress={() => onSignOut()} title="Sign Out" />
        )}
      </View>
      <View style={styles.containerSub}>
        <FlatList
          numColumns={3}
          data={userPosts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <Image source={{ uri: item.downloadURL }} style={styles.image} />
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
  containerInfo: {
    marginTop: 20,
  },
  containerImage: {
    flex: 1 / 3,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ fetchUserFollowing }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
