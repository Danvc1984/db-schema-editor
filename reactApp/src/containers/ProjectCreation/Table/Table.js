//Libraries
import React from "react";
//Components
import Button from "../../../components/UI/Button/Button";
//CSS and Assets
import classes from "./Table.module.css";
//Containers
import Field from "./Field/Field";
import { useDispatch } from "react-redux";
import {
  deleteTable,
  addField,
  clearCurrentItem,
  newCurrentField,
} from "../../../store/schemaSlice";

const Table = (props) => {
  const dispatch = useDispatch();

  const removeTableHandler = (tKey) => {
    dispatch(deleteTable(tKey));
    dispatch(clearCurrentItem());
  };
  const addFieldHandler = (id) => {
    dispatch(addField(id));
    dispatch(newCurrentField(id));
  };
  let fields = null;

  fields = props.fields.map((field) => (
    <Field
      key={field.id}
      id={field.id}
      table={props.id}
      name={field.name}
      type={field.type}
      required={field.required}
      selectedField={() => props.selectedField(props.id, field.id)}
    />
  ));

  return (
    <div className={classes.Table}>
      <div className={classes.Title}>
        <h3 onClick={props.selectedTable}>{props.name}</h3>
        <Button clicked={() => removeTableHandler(props.id)} btnType="Danger">
          x
        </Button>
      </div>
      <section>
        {fields}
        <div className={classes.btn} title="Add a new Field!">
          <Button clicked={() => addFieldHandler(props.id)} btnType="AddField">
            +
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Table;
