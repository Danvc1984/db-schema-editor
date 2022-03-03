//Libraries
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Link } from "react-router-dom";
//State
import { signUp } from "../../../store/authSlice";
//Components
import Input from "../../../components/UI/Input/Input";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Button from "../../../components/UI/Button/Button";
//CSS and Assets
import classes from "./Register.module.css";
//Utils
import { checkInput } from "./../../../utils/checkInput";
import { updateObject } from "./../../../utils/updateObject";

const Register = () => {
  //State setup

  const { loading, message, token, authRedirectPath } = useSelector(
    (state) => state.auth
  );
  const isAuthenticated = token !== null;
  const dispatch = useDispatch();

  const [registerForm, setRegisterForm] = useState({
    email: {
      elementType: "input",
      elementConfig: {
        type: "email",
        placeholder: "Email Address (e.g. dev@enterprise.io)",
      },
      value: "",
      validation: {
        required: true,
        isEmail: true,
        validationMessage: "A valid email is required to continue",
      },
      valid: false,
      touched: false,
    },
    userName: {
      elementType: "input",
      elementConfig: {
        type: "input",
        placeholder: "Enter your wizard name!",
      },
      value: "",
      validation: {
        required: true,
        minLength: 4,
        maxLength: 32,
        validationMessage:
          "Get original with your name, but just not too much! (no unnamed magicians allowed)",
      },
      valid: false,
      touched: false,
    },
    password: {
      elementType: "input",
      elementConfig: {
        type: "password",
        placeholder: "Password",
      },
      value: "",
      validation: {
        required: true,
        minLength: 8,
        maxLength: 25,
        validationMessage:
          "Please set a password, it must be between 8 and 25 characters",
      },
      valid: false,
      touched: false,
    },
  });
  const [formIsValid, setFormIsValid] = useState(false);
  const [eventTriggered, setEventTriggered] = useState(false);

  const inputChangedHandler = (event, controlName) => {
    const updatedControls = updateObject(registerForm, {
      [controlName]: updateObject(registerForm[controlName], {
        value: event.target.value,
        valid: checkInput(
          event.target.value,
          registerForm[controlName].validation
        ),
        touched: true,
      }),
    });
    let formIsValid = true;
    for (let controlName in updatedControls) {
      formIsValid = updatedControls[controlName].valid && formIsValid;
    }
    setRegisterForm(updatedControls);
    setFormIsValid(formIsValid);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setEventTriggered(true);
    dispatch(
      signUp(
        registerForm.userName.value,
        registerForm.email.value,
        registerForm.password.value
      )
    );
  };

  const formElementsArray = [];
  for (let key in registerForm) {
    formElementsArray.push({
      id: key,
      config: registerForm[key],
    });
  }

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

  if (loading) {
    form = <Spinner />;
  }

  let errorBox = null;

  if (message && eventTriggered) {
    errorBox = <span>{message}</span>;
  }
  let authRedirect = null;
  if (isAuthenticated) {
    authRedirect = <Redirect to={authRedirectPath} />;
  }
  return (
    <div className={classes.Register}>
      {authRedirect}
      <form onSubmit={submitHandler}>
        <h1>Start crafting!</h1>
        <h4>
          We only need a way to identify you for now. <br />
          Name of the game: <em>You brew 'em, we cook 'em</em>
        </h4>
        {errorBox}
        {form}
        <Button btnType="Submit" disabled={!formIsValid}>
          Register
        </Button>

        <Link to="/login">Already registered?</Link>
      </form>
    </div>
  );
};

export default Register;
