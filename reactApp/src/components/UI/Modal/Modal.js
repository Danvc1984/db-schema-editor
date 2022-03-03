//Libraries
import React from "react";
//Components
import Backdrop from "../Backdrop/Backdrop";
//CSS and Assets
import classes from "./Modal.module.css";
const Modal = (props) => {
  return (
    <>
      <Backdrop show={props.show} clicked={props.modalClosed} />
      <div
        className={classes.Modal}
        style={{
          transform: props.show ? "translateY(0)" : "translateY(-100vh)",
          opacity: props.show ? "1" : "0",
        }}
      >
        <section>
          <div className={classes.modalTitle}>{props.title}</div>
          <div className={classes.closeButton} onClick={props.modalClosed}>
            X
          </div>
        </section>
        <div className={classes.child}>{props.children}</div>
      </div>
    </>
  );
};
export default Modal;
