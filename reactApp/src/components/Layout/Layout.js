//Libraries
import React, { useState } from "react";
//Components
import Navbar from "../Navigation/Navbar/Navbar";
import SideNav from "../Navigation/SideNav/SideNav";
import Footer from "../Footer/Footer";
import SideDrawer from "./../UI/SideDrawer/SideDrawer";
//CSS and Assets
import classes from "./Layout.module.css";

const Layout = (props) => {
  const [sideDrawerVisible, setSideDrawerVisible] = useState(false);

  const sideDrawerClosedHandler = () => {
    setSideDrawerVisible(false);
  };

  const sideDrawerToggleHandler = () => {
    setSideDrawerVisible(!sideDrawerVisible);
  };

  return (
    <>
      <Navbar drawerToggleClicked={sideDrawerToggleHandler} />
      <SideDrawer open={sideDrawerVisible} closed={sideDrawerClosedHandler}>
        <SideNav />
      </SideDrawer>
      <main className={classes.Content}>{props.children}</main>
      <Footer />
    </>
  );
};

export default Layout;
