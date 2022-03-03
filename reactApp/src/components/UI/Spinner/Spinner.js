import React from "react";

import classes from "./Spinner.module.css";

const spinner = () => (
  <div className={classes.spinner}>
    <div className={classes.cube1}></div>
    <div className={classes.cube2}></div>
    <div className={classes.cube3}></div>
  </div>
);

export default spinner;
