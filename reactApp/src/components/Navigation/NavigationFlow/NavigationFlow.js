//Libraries
import React from "react";
import { useSelector } from "react-redux";
//Containers
import NavigationItem from "./NavItem/NavItem";
//CSS and Assets
import classes from "./NavigationFlow.module.css";
const NavigationItems = () => {
  const { token } = useSelector((state) => state.auth);
  const isAuthenticated = token !== null;
  return (
    <ul className={classes.NavigationItems}>
      <NavigationItem link="/register" showLink={!isAuthenticated}>
        Sign Up
      </NavigationItem>
      <NavigationItem link="/craft" showLink={isAuthenticated}>
        Start crafting
      </NavigationItem>
      <NavigationItem link="/projects" showLink={isAuthenticated}>
        My projects
      </NavigationItem>
      {/* <NavigationItem link="/profile" showLink={isAuthenticated}>
        My profile
      </NavigationItem>
      <NavigationItem link="/documentation" showLink={true}>
        Documentation
      </NavigationItem> */}
      <NavigationItem link="/aboutus" showLink={true}>
        About Us
      </NavigationItem>
      <NavigationItem link="/login" showLink={!isAuthenticated}>
        Login
      </NavigationItem>
      <NavigationItem link="/logout" exact showLink={isAuthenticated}>
        Logout
      </NavigationItem>
    </ul>
  );
};
export default NavigationItems;
