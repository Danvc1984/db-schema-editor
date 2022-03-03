//Libraries
import React, { useState, useEffect } from "react";
//CSS and Assets
import classes from "./ProjectCreation.module.css";
//Utils
import { updateObject } from "../../utils/updateObject";
import { checkInput } from "../../utils/checkInput";
//Components
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import BoxPicker from "../../components/UI/BoxPicker/BoxPicker";
import Spinner from "../../components/UI/Spinner/Spinner";
//Containers
import Table from "./Table/Table";
import ConfigPanel from "./ConfigPanel/ConfigPanel";
import { useSelector, useDispatch } from "react-redux";
import {
  addTable,
  clearTables,
  clearCurrentItem,
  newCurrentTable,
  changeCurrent,
  setSchemaDetails,
  saveSchema,
  updateSchema,
  editingSchema,
} from "../../store/schemaSlice";
import { refreshToken, sessionCheck } from "../../store/authSlice";
const CreateProject = () => {
  const dispatch = useDispatch();

  const onExit = (interval) => {
    dispatch(sessionCheck());
    clearInterval(interval);
    dispatch(clearCurrentItem());
  };

  useEffect(() => {
    const interval = setInterval(() => {
      clearTimeout(sessionStorage.getItem("sessionTimeoutId"));
      console.log(
        "cleared session:" + sessionStorage.getItem("sessionTimeoutId")
      );
      dispatch(refreshToken());
    }, 720000);
    return () => {
      onExit(interval);
    }; // eslint-disable-next-line
  }, []);
  const schema = useSelector((state) => {
    return state.schemaConfig.schema;
  });
  const { loading, message, statusCode, editing } = useSelector(
    (state) => state.schemaConfig
  );

  //TODO: Flag if state is coming from API or Store and adjust details accordingly
  const [projectDetails, setprojectDetails] = useState({
    name: {
      elementType: "input",
      elementConfig: {
        type: "text",
      },
      value: editing ? schema.name : "Enter a name for your project",
      validation: {
        required: true,
        minLength: 5,
        validationMessage:
          "You must provide 5 characters at least for your scheme's name",
      },
      valid: editing ? true : false,
      touched: editing ? true : false,
    },
    description: {
      elementType: "textarea",
      elementConfig: {
        maxLength: 255,
        rows: 3,
        placeholder: editing
          ? schema.description
          : "Enter a whimsy description for your schema (optional)",
      },
      value: schema.description,
      validation: {},
      valid: true,
      touched: editing ? true : false,
    },
  });

  const [eventTriggered, setEventTriggered] = useState(false);
  const [selectedDb, setSelectedDb] = useState("");

  const [codeLanguage, setCodeLanguage] = useState("");
  const languages = {
    radioName: "codeLanguage",
    label: "Select framework to export to: ",
    options: [
      { value: "ASP.NET", displayValue: "ASP" },
      { value: "Django", displayValue: "Django" },
    ],
  };

  const dbTypes = {
    radioName: "dbTypes",
    label: "Choose a database type: ",
    options: [
      { value: "MySQL", displayValue: "MySQL" },
      { value: "PostgreSQL", displayValue: "PostgreSQL" },
      { value: "MicrosoftSQL", displayValue: "Microsoft SQL" },
      { value: "MicrosoftSQLTrusted", displayValue: "MicrosoftSQLTrusted" },
      { value: "Sqlite", displayValue: "SQLite" },
    ],
  };

  //Handlers
  const handleLanguageChange = (event) => {
    setCodeLanguage(event.target.value);
  };
  const handleOptionChange = (event) => {
    setSelectedDb(event.target.value);
  };

  //TODO: DRY - this logic probably goes in to a custom hook
  const inputChangedHandler = (event, inputIdentifier) => {
    const updatedFormElement = updateObject(projectDetails[inputIdentifier], {
      value: event.target.value,
      valid: checkInput(
        event.target.value,
        projectDetails[inputIdentifier].validation
      ),
      touched: true,
    });
    const updatedprojectDetails = updateObject(projectDetails, {
      [inputIdentifier]: updatedFormElement,
    });

    let isValid = true;
    for (let inputIdentifier in updatedprojectDetails) {
      isValid = updatedprojectDetails[inputIdentifier].valid && isValid;
    }
    setprojectDetails(updatedprojectDetails);
  };

  const clickedFieldHandler = (id, key) => {
    const found = schema.tables.find((table) => table.id === id);
    const result = found.fields.find((field) => field.id === key);
    dispatch(
      changeCurrent({
        itemClass: "field",
        tableId: id,
        fieldId: key,
        name: result.name,
        type: result.type,
        required: result.required,
      })
    );
    if (document.getElementById("fieldName"))
      document.getElementById("fieldName").value = "";
  };
  const clickedTableHandler = (key) => {
    const found = schema.tables.find((table) => table.id === key);
    dispatch(
      changeCurrent({ itemClass: "table", tableId: key, name: found.name })
    );
    if (document.getElementById("fieldName"))
      document.getElementById("fieldName").value = "";
  };

  const addTableHandler = () => {
    dispatch(addTable());
    dispatch(newCurrentTable());
  };
  const clearTablesHandler = () => {
    dispatch(clearTables());
    dispatch(clearCurrentItem());
  };

  const saveSchemaHandler = (schemaName) => {
    const isReady = false;
    dispatch(
      setSchemaDetails({
        name: projectDetails.name.value,
        description: projectDetails.description.value,
        techno: editing ? schema.technology : codeLanguage,
        dbType: editing ? schema.databaseType : selectedDb,
      })
    );
    if (!editing) dispatch(saveSchema(isReady));
    else dispatch(updateSchema(isReady, schemaName));
    setEventTriggered(true);
    dispatch(editingSchema());
  };
  const saveAndGenerateHandler = (schemaName) => {
    const isReady = true;
    dispatch(
      setSchemaDetails({
        name: projectDetails.name.value,
        description: projectDetails.description.value,
        techno: editing ? schema.technology : codeLanguage,
        dbType: editing ? schema.databaseType : selectedDb,
      })
    );
    if (!editing) dispatch(saveSchema(isReady));
    else dispatch(updateSchema(isReady, schemaName));

    setEventTriggered(true);
    dispatch(editingSchema());
  };

  const formElementsArray = [];
  for (let key in projectDetails) {
    formElementsArray.push({
      id: key,
      config: projectDetails[key],
    });
  }
  let codeLanguageSelector = (
    <BoxPicker
      label={languages.label}
      name={languages.radioName}
      items={languages.options}
      current={codeLanguage}
      changed={(event) => handleLanguageChange(event)}
    />
  );
  let databaseType = (
    <BoxPicker
      label={dbTypes.label}
      name={dbTypes.radioName}
      items={dbTypes.options}
      current={selectedDb}
      changed={(event) => handleOptionChange(event)}
    />
  );

  let form = formElementsArray.map((formElement) => (
    <Input
      key={formElement.id}
      elementType={formElement.config.elementType}
      elementConfig={formElement.config.elementConfig}
      value={formElement.config.value}
      invalid={!formElement.config.valid}
      shouldValidate={formElement.config.validation}
      touched={formElement.config.touched}
      changed={(event) => inputChangedHandler(event, formElement.id)}
    />
  ));

  let tables = null;
  tables = schema.tables.map((table) => (
    <Table
      key={table.id}
      id={table.id}
      name={table.name}
      fields={table.fields}
      selectedTable={() => clickedTableHandler(table.id)}
      selectedField={clickedFieldHandler}
    />
  ));

  let apiResponse = null;

  if (loading) {
    apiResponse = <Spinner />;
  }

  if (message && eventTriggered) {
    apiResponse = (
      <div
        className={classes.responseDisplay}
        style={{
          color: statusCode === 0 ? "#6700ac" : "#971515e0",
        }}
      >
        {message}
      </div>
    );
  }

  let disable = false;
  if (!editing && (!selectedDb || !codeLanguage)) {
    disable = true;
  }

  return (
    <>
      <div className={classes.detailsContainer}>
        <h1>Schema Creation</h1>
        {form}
        {codeLanguageSelector}
        {databaseType}
        {apiResponse}
        <div className={classes.buttonContainer}>
          <div title="Make sure to enter your project details prior to submitting">
            <Button
              clicked={() => {
                saveSchemaHandler(schema.name);
              }}
              disabled={disable}
            >
              {!editing ? "Save current schema" : "Update current schema"}
            </Button>
          </div>
          <div title="Make sure to enter your project details prior to submitting">
            <Button
              clicked={() => {
                saveAndGenerateHandler(schema.name);
              }}
              disabled={disable}
            >
              {!editing
                ? "Save and generate project"
                : "Update and generate project"}
            </Button>
          </div>
        </div>
      </div>
      <div className={classes.craftContainer + " " + classes.row}>
        <div className={classes.tablesCol}>
          <h2>Tables</h2>
          <div className={classes.buttonContainer}>
            <Button clicked={clearTablesHandler} btnType="Danger">
              Clear Tables
            </Button>
            <Button clicked={addTableHandler} btnType="Information">
              Add a table
            </Button>
          </div>
          <section className={classes.tableRows}>{tables}</section>
        </div>
        <div className={classes.optionsCol}>
          <h2>Options</h2>
          <ConfigPanel />
        </div>
      </div>
    </>
  );
};

export default CreateProject;
