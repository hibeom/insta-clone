import {
  USER_STATE_CHANGE,
  USER_POSTS_STATE_CHANGE,
  USER_FOLLOWING_STATE_CHANGE,
  USERS_DATA_STATE_CHANGE,
  USERS_POSTS_STATE_CHANGE,
  USERS_LIKES_STATE_CHANGE,
  CLEAR_DATA,
} from "../constants/index";
import firebase from "firebase";

export function clearData() {
  return (dispatch) => {
    dispatch({ type: CLEAR_DATA });
  };
}

export function fetchUser() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() });
        } else {
          console.log("Data does not exist");
        }
      });
  };
}

export function fetchUserPosts() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(firebase.auth().currentUser.uid)
      .collection("userPosts")
      .orderBy("creation", "asc")
      .get()
      .then((snapshot) => {
        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        dispatch({ type: USER_POSTS_STATE_CHANGE, posts });
      });
  };
}

export function fetchUserFollowing() {
  return (dispatch) => {
    // firebase
    //   .firestore()
    //   .collection("following")
    //   .doc(firebase.auth().currentUser.uid)
    //   .collection("userFollowing")
    //   .get()
    //   .then((snapshot) => {
    //     let following = snapshot.docs.map((doc) => {
    //       return doc.id;
    //     });
    //     dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following });
    //   });

    // 위처럼 get().then()... 방식은 fetchUserFollowing 호출 시에만 가져오게된다.
    // 위 방식을 이용하려면, Profile 에서 onFollow, onUnFollow 할 시에 mapDispatchToProps 를 이용해
    // 매번 fetchUserFollowing 을 호출해야한다.

    // 그러나 아래 방식처럼 onSnapshot 을 이용하면
    // collection 혹은 doc 콘텐츠가 변경될 때마다 콜백 호출되어 수신 대기 상태가 된다.
    // 알아서 리스너를 생성해준다.

    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .onSnapshot((snapshot) => {
        let following = snapshot.docs.map((doc) => {
          return doc.id;
        });
        dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following });
        for (let i = 0; i < following.length; i++) {
          dispatch(fetchUsersData(following[i], true));
        }
      });
  };
}

export function fetchUsersData(uid, getPosts) {
  return (dispatch, getState) => {
    const found = getState().usersState.users.some((el) => el.uid === uid);
    if (!found) {
      firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            let user = snapshot.data();
            user.uid = snapshot.id;
            dispatch({ type: USERS_DATA_STATE_CHANGE, user });
          } else {
            console.log("does not exist");
          }
        });
      if (getPosts) {
        dispatch(fetchUsersFollowingPosts(uid));
      }
    } else {
    }
  };
}

export function fetchUsersFollowingPosts(uid) {
  return (dispatch, getState) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(uid)
      .collection("userPosts")
      .orderBy("creation", "asc")
      .get()
      .then((snapshot) => {
        // fetchUserFollowingPosts 를 여러 uid 에 대해 반복 호출 시에,
        // firebase aysnc 동작으로 uid 가 일치하지 않는 문제가 있다.
        // 그래서 위의 파라미터 uid 를 이용하는 것이 아닌,
        // snapshot 안에서 가지고 있는 uid 를 이용한다.
        console.log(snapshot.query);
        const uid = snapshot.query._.C_.path.segments[1];
        console.log({ snapshot, uid });

        const user = getState().usersState.users.find((el) => el.uid === uid);

        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data, user };
        });
        console.log(posts);
        dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid });
        console.log(getState());
      });
  };
}
