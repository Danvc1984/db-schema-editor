//Libraries
import React from "react";
//Components
import Backdrop from "../../UI/Backdrop/Backdrop";
//CSS and Assets
import classes from "./SideDrawer.module.css";

const sideDrawer = props => {
  let attachedClasses = [classes.SideDrawer, classes.Close];
  if (props.open) {
    attachedClasses = [classes.SideDrawer, classes.Open];
  }
  return (
    <>
      <Backdrop show={props.open} clicked={props.closed} />
      <div className={attachedClasses.join(" ")}>{props.children}</div>
    </>
  );
};

export default sideDrawer;
