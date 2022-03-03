//Libraries
import React from "react";
import { NavLink } from "react-router-dom";
//CSS and Assets
import cauldronLogo from "../../../assets/images/SiteCauldronLogoRe(1).svg";
import classes from "./Logo.module.css";

const logo = (props) => (
  //height value is intented to be defined from parent component
  <div className={classes.Logo} style={{ height: props.height }}>
    <NavLink to="/" exact>
      <img src={cauldronLogo} alt="Site Cauldron" />
    </NavLink>
  </div>
);

export default logo;
