//Libraries
import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
//State
import { logout } from "../../../store/authSlice";

const Logout = () => {
  const sessionId = sessionStorage.getItem("SessionTimeoutId");
  const dispatch = useDispatch();

  useEffect(() => {
    clearTimeout(sessionId);
    dispatch(logout()); // eslint-disable-next-line
  }, []);
  return <Redirect to="/" />;
};

export default Logout;
