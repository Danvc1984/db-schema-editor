//Libraries
import React from "react";
import { Link } from "react-router-dom";
//Components
import ImageBox from "../UI/ImageBox/ImageBox";
//CSS and Assets
import classes from "./Landing.module.css";
import Cauldron from "../../assets/images/Cauldron.jpg";
import GraphQl from "../../assets/images/GraphQL_Logo.png";

const Landing = (props) => (
  <div className={classes.Landing}>
    <div className={classes.splash}>
      <header>You craft 'em we build 'em</header>
      <Link className={classes.link} to="/login">
        Login to start crafting
      </Link>
    </div>
    <br />
    <div className={classes.Body}>
      <ImageBox img={Cauldron} alternative="" style={{ float: "right" }} />
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent rutrum
        molestie felis eu fringilla. Morbi massa odio, consectetur id hendrerit
        ac, mattis vitae metus. Aliquam vestibulum eleifend egestas. Interdum et
        malesuada fames ac ante ipsum primis in faucibus. Ut eu suscipit dui.
        Mauris rutrum porttitor aliquam. Curabitur rutrum auctor tellus. Sed
        quis eros tempus, faucibus mi eu, posuere metus. Vestibulum sodales
        tortor quis volutpat ornare. Donec sed tincidunt dolor. Quisque
        consequat nisl vitae egestas tempus. Nam venenatis venenatis enim, a
        semper dui tempor a. Vestibulum cursus sodales nunc.
      </p>
      <ImageBox img={GraphQl} alternative="" style={{ float: "left" }} />
      <p>
        Vestibulum in malesuada purus, sit amet sagittis sem. Nullam mattis
        sapien id est iaculis, a mollis sapien ultrices. Maecenas aliquam
        dapibus egestas. Ut faucibus elit ipsum, in eleifend nunc molestie eget.
        Nulla in purus non lacus consectetur feugiat. Aenean sit amet ligula vel
        diam ullamcorper dignissim. Proin at eros dignissim, tempus est a,
        ornare sapien. Proin ullamcorper libero eget condimentum tincidunt. Nam
        tellus lectus, blandit non hendrerit vitae, ullamcorper sit amet felis.
        Nunc egestas metus nisi, eget dapibus turpis accumsan aliquam. Maecenas
        suscipit, purus pulvinar tristique imperdiet, mauris erat condimentum
        sapien, at vehicula nulla orci quis diam. Nullam finibus efficitur eros
        eget tempus. Aenean vitae vehicula odio, id iaculis augue. Suspendisse
        potenti. Fusce egestas dignissim nunc, at mollis dui sagittis vel.
        Suspendisse ante tellus, ornare eget dui et, congue accumsan eros.
      </p>
    </div>
  </div>
);

export default Landing;
