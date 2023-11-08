// import { configureStore } from '@reduxjs/toolkit';
// import thunk from 'redux-thunk'; // Import 'redux-thunk' here
// import rootReducer from '../reducers';

// const store = configureStore({
//   reducer: rootReducer,
//   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
//   // You can also specify other options here if needed
// });

// export default store;
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import rootReducer from "../reducers";

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

export default store;
