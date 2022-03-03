import React from "react";
import classes from "./BoxPicker.module.css";
const BoxPicker = (props) => {
  return (
    <div className={classes.boxpicker}>
      <p>{props.label}</p>
      <ul key={props.selected}>
        {props.items.map((item) => (
          <li key={item.value}>
            <input
              defaultChecked={item.value === props.selected}
              key={item.value}
              type="radio"
              name={props.name}
              value={item.value}
              id={item.value}
              onChange={props.changed}
            />
            <label htmlFor={item.value}>{item.displayValue}</label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BoxPicker;
