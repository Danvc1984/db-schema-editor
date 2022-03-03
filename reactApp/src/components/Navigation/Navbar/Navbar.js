//Libraries
import React from "react";
//Components
import Logo from "../../UI/Logo/Logo";
import DrawerToggle from "../../UI/SideDrawer/DrawerToggle/DrawerToggle";
//Containers
import NavigationItems from "../NavigationFlow/NavigationFlow";
//CSS and Assets
import classes from "./Navbar.module.css";

const Navbar = (props) => (
  <header className={classes.Navbar}>
    <DrawerToggle clicked={props.drawerToggleClicked} />
    <div className={classes.Logo}>
      <Logo />
    </div>
    <nav className={classes.DesktopOnly}>
      <NavigationItems />
    </nav>
  </header>
);

export default Navbar;
