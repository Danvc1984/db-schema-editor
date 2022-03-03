//Libraries
import React, { Suspense, useEffect } from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
//Components
import Landing from "./components/Landing/Landing";
import Layout from "./components/Layout/Layout";
import Spinner from "./components/UI/Spinner/Spinner";
//State
import { sessionCheck } from "./store/authSlice";
//Containers
import Logout from "./containers/Auth/Logout/Logout";
//Utils
import * as lazy from "./utils/lazyLoad";

const App = (props) => {
  const dispatch = useDispatch();
  const { token, routesInitialized } = useSelector((state) => state.auth);
  const isAuthenticated = token !== null;
  useEffect(() => {
    clearTimeout(sessionStorage.getItem("sessionTimeoutId"));
    dispatch(sessionCheck()); // eslint-disable-next-line
  }, []);

  let routes = (
    // Routes available for unauthenticated users
    <Switch>
      <Route path="/aboutus" render={(props) => <lazy.AboutUs {...props} />} />
      {/* <Route
        path="/documentation"
        render={(props) => <lazy.Documentation {...props} />}
      /> */}
      <Route path="/login" render={(props) => <lazy.Login {...props} />} />
      <Route
        path="/register"
        render={(props) => <lazy.Register {...props} />}
      />
      <Route
        path="/craft"
        render={(props) => <lazy.ProjectCreation {...props} />}
      />
      <Route path="/" exact component={Landing} />
      <Redirect to="/" />
    </Switch>
  );

  if (isAuthenticated) {
    // Routes for authenticated users
    routes = (
      <Switch>
        <Route
          path="/aboutus"
          render={(props) => <lazy.AboutUs {...props} />}
        />
        {/* <Route
          path="/documentation"
          render={(props) => <lazy.Documentation {...props} />}
        />
        <Route
          path="/profile"
          render={(props) => <lazy.UserInfo {...props} />}
        /> */}

        <Route
          path="/craft"
          render={(props) => <lazy.ProjectCreation {...props} />}
        />
        <Route
          path="/projects"
          render={(props) => <lazy.Projects {...props} />}
        />
        <Route path="/logout" component={Logout} />
        <Route path="/" exact component={Landing} />
        <Redirect to="/" />
      </Switch>
    );
  }
  if (routesInitialized) {
    return (
      <>
        <Layout>
          <Suspense fallback={<Spinner />}>{routes}</Suspense>
        </Layout>
      </>
    );
  } else return <Spinner />;
};

export default withRouter(App);
