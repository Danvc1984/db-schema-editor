//Libraries
import React from "react";
//CSS and Assets
import classes from "./AboutUs.module.css";
import Cross from "../../assets/images/Close.svg";

//TODO: Implement this component as a modal or a full section
const AboutUs = (props) => {
  return (
    <>
      <div className={classes.About}>
        <div>
          <h2>
            About Us
            <img src={Cross} onClick={null} alt="Exit"></img>
          </h2>
        </div>
        <p>Hello There...</p>
        <p>
          We would like to welcome you to our first draft for this project, as
          you probably can tell we are still getting our heads around react,
          routing, redux, and a huge etcetera.. but please, stay in touch!
        </p>
        <p style={{ textAlign: "right" }}>
          --The Site Cauldron team - April, 2020
        </p>
      </div>
    </>
  );
};

export default AboutUs;
