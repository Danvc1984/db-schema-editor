import { lazy } from "react";

//Lazy component render util, helps to optimize heavy components
//TODO: Currently applying to all components, will update in a further iteration.

export const Register = lazy(() =>
  import("../containers/Auth/Register/Register")
);

export const Projects = lazy(() => import("../containers/Projects/Projects"));

export const ProjectCreation = lazy(() =>
  import("../containers/ProjectCreation/ProjectCreation")
);

export const Documentation = lazy(() =>
  import("../components/Documentation/Documentation")
);
//TODO: Rebuild User Information when it gains relevance
export const UserInfo = lazy(() =>
  //Placeholder
  import("../components/Documentation/Documentation")
);

export const AboutUs = lazy(() => import("../components/AboutUs/AboutUs"));

export const Login = lazy(() => import("../containers/Auth/Login/Login"));
