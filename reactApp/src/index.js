//Libraries
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
//Components
import App from "./App";
//State
import auth from "./store/authSlice.js";
import schemaConfig from "./store/schemaSlice.js";
import userData from "./store/userDataSlice.js";
//CSS and Assets
import "./index.css";

const rootReducer = combineReducers({
  auth,
  schemaConfig,
  userData,
});

const store = configureStore({ reducer: rootReducer });

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
ReactDOM.render(app, document.getElementById("root"));
