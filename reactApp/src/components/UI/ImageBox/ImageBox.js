//Libraries
import React from "react";
//CSS and Assets
import classes from "./ImageBox.module.css";

const ImageBox = props => (
  <img
    className={classes.ImageBox}
    src={props.img}
    alt={props.alternative}
    style={props.style}
  />
);

export default ImageBox;
