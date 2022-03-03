import { createSlice } from "@reduxjs/toolkit";
import { auth, users } from "../utils/axios";
import { parseJwt } from "../utils/parseJwt";

const authSlice = createSlice({
  name: "auth",

  initialState: {
    token: null,
    userId: null,
    message: null,
    statusCode: 0,
    loading: false,
    authRedirectPath: "/",
    routesInitialized: false,
  },

  reducers: {
    authStart(state) {
      state.loading = true;
      state.message = null;
      state.statusCode = 0;
    },
    authSuccess(state, action) {
      const { token, userId, message } = action.payload;
      state.token = token;
      state.userId = userId;
      state.message = message;
      state.loading = false;
    },
    authFail(state, action) {
      const { message, status } = action.payload;

      state.message = message;
      state.statusCode = status;
      state.loading = false;
    },

    authLogout(state) {
      state.token = null;
      state.userId = null;
    },

    setRoutesInitialized(state) {
      state.routesInitialized = true;
    },
    setAuthRedirectPath(state, action) {
      state.authRedirectPath = action.payload;
    },
  },
});

export default authSlice.reducer;

export const {
  authStart,
  authSuccess,
  authFail,
  authLogout,
  setRoutesInitialized,
  setAuthRedirectPath,
} = authSlice.actions;

//*Async action functions

//Sets an async function for the given time
export const setAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    const logoutTimeId = setTimeout(() => {
      dispatch(logout());
    }, +expirationTime);
    sessionStorage.setItem("sessionTimeoutId", logoutTimeId);
  };
};

export const signUp = (username, email, password) => {
  return async (dispatch) => {
    dispatch(authStart());
    try {
      await users.put("", {
        username: username,
        email: email,
        password: password,
      });
      dispatch(signIn(email, password));
    } catch (err) {
      if (err.message === "Network Error")
        dispatch(authFail({ message: err.message, status: err.name }));
      else {
        dispatch(
          authFail({
            message: err.response.data.message,
            status: err.response.data.statusCode,
          })
        );
      }
    }
  };
};

export const signIn = (email, password) => {
  return async (dispatch) => {
    dispatch(authStart());
    try {
      const token = await auth
        .post("/login", {
          email: email,
          password: password,
        })
        .then((res) => res.data);
      const tokenData = parseJwt(token);
      const user =
        tokenData["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      const expirationDate = new Date((tokenData.exp + 5 * 60) * 1000);
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("expirationDate", expirationDate);
      sessionStorage.setItem("userId", user);
      dispatch(authSuccess({ token, userId: user, message: null }));
      dispatch(
        setAuthTimeout(expirationDate.getTime() - new Date().getTime() - 45000)
      );
    } catch (err) {
      if (err.message === "Network Error")
        dispatch(authFail({ message: err.message, status: err.name }));
      else {
        dispatch(
          authFail({
            message: err.response.data.message,
            status: err.response.data.statusCode,
          })
        );
      }
    }
  };
};

export const logout = () => {
  return async (dispatch) => {
    dispatch(authStart());
    try {
      const token = sessionStorage.getItem("token");
      const response = await auth.get("/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(
        authSuccess({
          token: null,
          userId: null,
          message: response.data.message,
        })
      );
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("expirationDate");
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("sessionTimeoutId");
    } catch (err) {
      if (err.message === "Network Error")
        dispatch(authFail({ message: err.message, status: err.name }));
      else {
        dispatch(
          authFail({
            message: err.response.data.message,
            status: err.response.data.statusCode,
          })
        );
      }
    }
  };
};

export const refreshToken = () => {
  return async (dispatch) => {
    dispatch(authStart());
    try {
      const token = sessionStorage.getItem("token");

      const renew = await auth
        .get("/renew", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((resi) => resi.data);
      console.log("response:" + renew);
      const rew = parseJwt(renew);
      const user =
        rew["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      const expirationDate = new Date((rew.exp + 5 * 60) * 1000);
      console.log("res: " + rew);
      console.log("user: " + user);
      sessionStorage.setItem("token", renew);
      sessionStorage.setItem("expirationDate", expirationDate);
      sessionStorage.setItem("userId", user);
      dispatch(authSuccess({ token: renew, userId: user, message: null }));
      dispatch(
        setAuthTimeout(expirationDate.getTime() - new Date().getTime() - 45000)
      );
    } catch (err) {
      if (err.message === "Network Error")
        dispatch(authFail({ message: err.message, status: err.name }));
      else {
        dispatch(
          authFail({
            message: err.response.data.message,
            status: err.response.data.statusCode,
          })
        );
      }
    }
  };
};

//check for autentication on page reloads
export const sessionCheck = () => {
  return (dispatch) => {
    const token = sessionStorage.getItem("token");

    const SESSION_NOT_STORED =
      "Token is either not valid or available on refresh";

    if (!token) {
      sessionStorage.clear();
      dispatch(authFail({ message: SESSION_NOT_STORED, status: 0 }));
    } else {
      const expirationDate = new Date(sessionStorage.getItem("expirationDate"));

      if (expirationDate <= new Date()) {
        sessionStorage.clear();
        dispatch(authFail({ message: SESSION_NOT_STORED, status: 0 }));
      } else {
        const userId = sessionStorage.getItem("userId");
        dispatch(authSuccess({ token, userId, message: null }));
        dispatch(
          setAuthTimeout(
            expirationDate.getTime() - new Date().getTime() - 45000
          )
        );
      }
    }
    dispatch(setRoutesInitialized());
  };
};
