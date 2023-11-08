import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userReducer";
import articleReducer from "./articleReducer";

const rootReducer = combineReducers({
    userState: userReducer,
    articleState: articleReducer,
});

export default rootReducer;