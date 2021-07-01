import React from "react";
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

function Feed(props) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let posts = [];
    if (props.following.length == props.userFollowingLoaded) {
      posts = props.users.reduce(
        (concat, user) => [...concat, ...user.posts],
        []
      );
    }
    posts.sort((x, y) => {
      return x.creation - y.creation;
    });
    setPosts(posts);
  }, [props.userFollowingLoaded]);

  return (
    <View style={styles.container}>
      <View style={styles.containerSub}>
        <FlatList
          numColumns={1}
          data={posts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <Text style={styles.container}>{item.user.name}</Text>
              <Image source={{ uri: item.downloadURL }} style={styles.image} />
              <Text
                onPress={() => {
                  props.navigation.navigate("Comment", {
                    postId: item.id,
                    uid: item.user.uid,
                  });
                }}
              >
                View Comments.
              </Text>
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
  following: store.userState.following,
  users: store.usersState.users,
  userFollowingLoaded: store.usersState.userFollowingLoaded,
});

export default connect(mapStateToProps, null)(Feed);
