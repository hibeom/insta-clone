import React, { Component } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import firebase from "firebase";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { fetchUser, fetchUserPosts } from "../redux/actions";

import Feed from "./main/Feed";
import Profile from "./main/Profile";
import Add from "./main/Add";

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
  return null;
};

export class Main extends Component {
  onSignOut() {
    firebase
      .auth()
      .signOut()
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentDidMount() {
    this.props.fetchUser();
    this.props.fetchUserPosts();
  }

  render() {
    const { currentUser } = this.props;

    return (
      <Tab.Navigator labeled={false} initialRouteName="Feed">
        <Tab.Screen
          name="Feed"
          component={Feed}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" size={26} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="AddContainer"
          component={EmptyScreen}
          listeners={({ navigation }) => ({
            tabPress: (event) => {
              event.preventDefault();
              navigation.navigate("Add");
            },
          })}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="plus-box" size={26} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account-circle"
                size={26}
                color={color}
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ fetchUser, fetchUserPosts }, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(Main);
