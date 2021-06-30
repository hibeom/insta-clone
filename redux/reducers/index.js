import { user } from "./user";
import { users } from "./uesrs";
import { combineReducers } from "redux";

const Reducers = combineReducers({
  userState: user,
  usersState: users,
});

export default Reducers;
