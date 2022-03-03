//Libraries
import React from "react";
//Components
import Button from "../../../components/UI/Button/Button";
import BoxPicker from "../../../components/UI/BoxPicker/BoxPicker";
//CSS and Assets
import classes from "./ConfigPanel.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTable,
  addField,
  deleteField,
  clearFields,
  updateTable,
  updateField,
  clearCurrentItem,
  newCurrentField,
  changeCurrent,
  setFieldType,
} from "../../../store/schemaSlice";
import { generateUUID } from "../../../utils/generateUUID";
const ConfigPanel = (props) => {
  const currentItem = useSelector((state) => {
    return state.schemaConfig.currentItem;
  });
  const fieldType = useSelector((state) => {
    return state.schemaConfig.selectedFieldType;
  });
  let tables = useSelector((state) => {
    return state.schemaConfig.schema.tables.map((table) => table.name);
  });
  //local state, variables and arrays

  const dispatch = useDispatch();
  let options = null;
  let combo = null;
  let display = null;

  const dbTypes = {
    radioName: "fieldType",
    label: "Select this field's type: ",
    options: [
      { value: "Integer", displayValue: "Int" },
      { value: "Floating", displayValue: "Float" },
      { value: "String", displayValue: "String" },
      { value: "DateTime", displayValue: "DateTime" },
      { value: "fk", displayValue: "Foreign Key" },
    ],
  };
  //handlers
  const updateTableHandler = (tKey) => {
    let tableName = document.getElementById("fieldName").value;
    tableName = tableName === "" ? currentItem.name : tableName;
    dispatch(updateTable({ tKey, tableName }));
    dispatch(
      changeCurrent({ itemClass: "table", tableId: tKey, name: tableName })
    );
  };

  const addNewFieldHandler = (id) => {
    dispatch(addField(id));
    dispatch(newCurrentField(id));
  };
  const clearAllFieldsHandler = (id) => {
    dispatch(clearFields(id));
  };
  const deleteTableHandler = (id) => {
    dispatch(deleteTable(id));
    dispatch(clearCurrentItem());
  };

  const updateFieldHandler = (tKey, fKey) => {
    let fieldName = document.getElementById("fieldName").value;
    const required = document.getElementById("requiredField").checked;
    let type = fieldType;
    console.log(fieldType);

    if (type === "fk") {
      type = document.getElementById("availableKeys").value;
    } else {
      type = type !== "" ? type : currentItem.type;
    }

    console.log(type);
    fieldName = fieldName === "" ? currentItem.name : fieldName;

    dispatch(updateField({ tKey, fKey, fieldName, required, type }));
    dispatch(
      changeCurrent({
        itemClass: "field",
        tableId: tKey,
        fieldId: fKey,
        name: fieldName,
        type: type,
        required: required,
      })
    );
  };
  const deleteFieldHandler = (tKey, fKey) => {
    dispatch(deleteField({ fKey, tKey }));
    dispatch(clearCurrentItem());
  };

  const handleOptionChange = (event) => {
    dispatch(setFieldType(event.target.value));
  };

  if (fieldType === "fk") {
    options = tables.map((table) => (
      <option key={table} selected={currentItem.type === table} value={table}>
        {table}
      </option>
    ));

    combo = <select id="availableKeys">{options}</select>;
  }

  let types = (
    <BoxPicker
      label={dbTypes.label}
      name={dbTypes.radioName}
      items={dbTypes.options}
      current={fieldType}
      changed={(event) => handleOptionChange(event)}
    />
  );

  switch (currentItem.class) {
    case "table":
      display = (
        <>
          <h4>If you wish to rename this table submit a new name</h4>
          <input
            id="fieldName"
            maxLength="120"
            defaultValue=""
            placeholder={currentItem.name}
          />
          <Button clicked={() => updateTableHandler(currentItem.tableId)}>
            Change Name
          </Button>
          <br />
          <Button clicked={() => addNewFieldHandler(currentItem.tableId)}>
            Add a new field
          </Button>

          <Button
            clicked={() => clearAllFieldsHandler(currentItem.tableId)}
            btnType="Danger"
          >
            Clear Fields
          </Button>
          <Button
            clicked={() => deleteTableHandler(currentItem.tableId)}
            btnType="Danger"
          >
            Delete Table
          </Button>
        </>
      );

      break;
    case "field":
      display = (
        <>
          <h4>
            If you wish to edit this field's properties submit only the desired
            changes
          </h4>
          <input
            id="fieldName"
            maxLength="120"
            placeholder={currentItem.name}
          />
          {types}
          {combo}
          <div className={classes.checkbox}>
            <label>
              <input
                key={generateUUID()}
                id="requiredField"
                type="checkbox"
                defaultChecked={currentItem.required}
              />
              Required field
            </label>
          </div>
          <Button
            clicked={() =>
              updateFieldHandler(currentItem.tableId, currentItem.fieldId)
            }
          >
            Update Field
          </Button>
          <br />
          <Button
            clicked={() =>
              deleteFieldHandler(currentItem.tableId, currentItem.fieldId)
            }
            btnType="Danger"
          >
            Delete this Field
          </Button>
        </>
      );
      break;
    default:
      display = (
        <label>Click on a table or directly on any field to configure!</label>
      );
  }
  return <div className={classes.Config}>{display}</div>;
};

export default ConfigPanel;
