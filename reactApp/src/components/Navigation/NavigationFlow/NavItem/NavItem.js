//Libraries
import React from "react";
import { NavLink } from "react-router-dom";
//CSS and Assets
import classes from "./NavItem.module.css";

const navigationItem = (props) => {
  let authClasses = props.showLink
    ? classes.NavigationItem
    : [classes.NavigationItem, classes.nonAuth].join(" ");
  return (
    <li className={authClasses}>
      <NavLink
        activeClassName={classes.active}
        to={props.link}
        exact={props.exact}
      >
        {props.children}
      </NavLink>
    </li>
  );
};

export default navigationItem;
