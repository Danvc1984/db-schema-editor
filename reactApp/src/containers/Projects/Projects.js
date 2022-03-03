//Libraries
import React, { useEffect } from "react";
//CSS and Assets
import classes from "./Projects.module.css";
//Utils
//Components
import Spinner from "../../components/UI/Spinner/Spinner";
//Containers
import Project from "./Project/Project";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loadProjects } from "./../../store/userDataSlice";
import { clearSchema } from "./../../store/schemaSlice";
const Projects = () => {
  const dispatch = useDispatch();
  const projectList = useSelector((state) => {
    return state.userData.projects;
  });
  const { loading, message } = useSelector((state) => state.userData);
  useEffect(() => {
    dispatch(loadProjects());
  }, [dispatch]);
  let projects = null;
  projects = projectList.map((project) => (
    <Project key={project} name={project} />
  ));

  let apiResponse = null;

  if (loading) {
    apiResponse = <Spinner />;
  }

  if (message != null) {
    apiResponse = <h2>{message}</h2>;
  }
  return (
    <div className={classes.projects}>
      <div className={classes.head}>My Projects</div>
      <span className={classes.info}>Hover over projects for more options</span>
      {apiResponse}
      <div className={classes.container}>{projects}</div>

      <Link
        className={classes.anew}
        onClick={() => {
          dispatch(clearSchema());
        }}
        to="/craft"
      >
        Start a new project
      </Link>
    </div>
  );
};

export default Projects;
