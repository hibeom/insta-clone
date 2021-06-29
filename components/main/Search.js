import React from "react";
import { useState } from "react";
import firebase from "firebase";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function Search({ navigation }) {
  const [users, setUsers] = useState(null);

  const fetchUsers = (search) => {
    firebase
      .firestore()
      .collection("users")
      .where("name", ">=", search)
      .get()
      .then((snapshot) => {
        let users = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setUsers(users);
      });
  };

  return (
    <View style={{ flex: 1, paddingTop: 40 }}>
      <TextInput
        placeholder="Type here..."
        onChangeText={(text) => fetchUsers(text)}
      />
      <FlatList
        numColumns={1}
        data={users}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile", { uid: item.id })}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
