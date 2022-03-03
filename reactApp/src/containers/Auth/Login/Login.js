//Libraries
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Link } from "react-router-dom";
//State
import { signIn } from "../../../store/authSlice";
//Components
import Input from "../../../components/UI/Input/Input";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Button from "../../../components/UI/Button/Button";
//CSS and Assets
import classes from "./Login.module.css";
import Cauldron from "./../../../assets/images/Cauldron.jpg";
//Utils
import { checkInput } from "./../../../utils/checkInput";
import { updateObject } from "./../../../utils/updateObject";

const Login = () => {
  //State Setup
  const { loading, message, token, authRedirectPath } = useSelector(
    (state) => state.auth
  );

  const isAuthenticated = token !== null;
  const dispatch = useDispatch();

  const [signinForm, setSigninForm] = useState({
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
        validationMessage:
          "Please provide your password, remember, it has at least eight characters",
      },
      valid: false,
      touched: false,
    },
  });
  const [formIsValid, setFormIsValid] = useState(false);
  const [eventTriggered, setEventTriggered] = useState(false);

  const inputChangedHandler = (event, controlName) => {
    const updatedControls = updateObject(signinForm, {
      [controlName]: updateObject(signinForm[controlName], {
        value: event.target.value,
        valid: checkInput(
          event.target.value,
          signinForm[controlName].validation
        ),
        touched: true,
      }),
    });
    let formIsValid = true;
    for (let controlName in updatedControls) {
      formIsValid = updatedControls[controlName].valid && formIsValid;
    }
    setSigninForm(updatedControls);
    setFormIsValid(formIsValid);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setEventTriggered(true);
    dispatch(signIn(signinForm.email.value, signinForm.password.value));
  };

  const formElementsArray = [];
  for (let key in signinForm) {
    formElementsArray.push({
      id: key,
      config: signinForm[key],
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
    <div className={classes.Login}>
      {authRedirect}
      <form onSubmit={submitHandler}>
        <h1>Welcome again</h1>

        <img src={Cauldron} alt="Cauldron" />
        {errorBox}
        {form}
        <Button btnType="Submit" disabled={!formIsValid}>
          Login
        </Button>

        <Link to="/aboutus">Forgot password?</Link>
        <Link to="/register">Are you new?</Link>
      </form>
    </div>
  );
};

export default Login;
