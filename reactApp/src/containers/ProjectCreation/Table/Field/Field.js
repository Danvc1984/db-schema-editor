//Libraries
import React from "react";
//Components
import Button from "../../../../components/UI/Button/Button";
//CSS and Assets
import classes from "./Field.module.css";
import { useDispatch } from "react-redux";
import { deleteField, clearCurrentItem } from "../../../../store/schemaSlice";

const Field = (props) => {
  const dispatch = useDispatch();
  const req = props.required ? (
    <div className={classes.required}>R</div>
  ) : (
    <div
      className={classes.required}
      style={{
        visibility: "hidden",
      }}
    >
      R
    </div>
  );

  const removeFieldHandler = (fKey, tKey) => {
    dispatch(deleteField({ fKey, tKey }));
    dispatch(clearCurrentItem());
  };
  return (
    <div className={classes.Field}>
      <section onClick={props.selectedField}>
        {req}
        <div className={classes.desc}>{props.name}</div>
        <div className={classes.type}>{props.type}</div>
      </section>
      <Button
        clicked={() => removeFieldHandler(props.id, props.table)}
        btnType="RemoveField"
      >
        x
      </Button>
    </div>
  );
};

export default Field;
