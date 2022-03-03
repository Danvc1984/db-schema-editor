import { createSlice } from "@reduxjs/toolkit";

import { api } from "../utils/axios";
import fileDownload from "js-file-download";
import fileReader from "../utils/fileReader";
import { loadSchema } from "./schemaSlice";

const userDataSlice = createSlice({
  name: "userData",
  initialState: {
    projects: [],
    selectedProject: {},
    message: null,
    statusCode: 0,
    loading: false,
  },
  reducers: {
    setProjects(state, action) {
      state.projects = action.payload;
    },

    removeProject(state, action) {
      state.projects = state.projects.filter(
        (project) => project !== action.payload
      );
    },

    currentProject(state, action) {
      state.selectedProject = action.payload;
    },

    apiSuccess(state, action) {
      const { message, status, load } = action.payload;
      state.message = message;
      state.statusCode = status;
      state.loading = load;
    },
    apiError(state, action) {
      const { message, status } = action.payload;
      state.message = message;
      state.statusCode = status;
      state.loading = false;
    },
    setLoading(state) {
      state.loading = true;
      state.message = null;
      state.statusCode = 0;
    },
  },
});

export default userDataSlice.reducer;

export const {
  removeProject,
  currentProject,
  apiSuccess,
  apiError,
  setLoading,
  setProjects,
} = userDataSlice.actions;

//*Async action functions

export const loadProjects = () => {
  return async (dispatch) => {
    dispatch(setLoading());
    try {
      const token = sessionStorage.getItem("token");
      await api
        .get("/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          dispatch(setProjects(res.data));
          dispatch(
            apiSuccess({
              message: null,
              status: 0,
              load: false,
            })
          );
        });
    } catch (err) {
      dispatch(apiError({ message: err.message, status: err.name }));
    }
  };
};
export const loadProjectSchema = (projectName) => {
  return async (dispatch, getState) => {
    dispatch(setLoading());
    try {
      const token = sessionStorage.getItem("token");
      await api
        .get(`/projects/${projectName}/schema`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          dispatch(currentProject(res.data));
          dispatch(
            apiSuccess({
              message: null,
              status: 0,
              load: false,
            })
          );
          dispatch(loadSchema(getState().userData.selectedProject));
        });
    } catch (err) {
      dispatch(apiError({ message: err.message, status: err.name }));
    }
  };
};

export const deleteProject = (projectName) => {
  return async (dispatch) => {
    const token = sessionStorage.getItem("token");
    api
      .delete(`/projects/${projectName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        dispatch(removeProject(projectName));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const generateProjectZip = (projectName) => {
  return async (dispatch) => {
    let downURL = "/projects/" + projectName;

    const token = sessionStorage.getItem("token");
    try {
      const response = await api
        .get(downURL, {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => res.data);

      fileDownload(response, `${projectName}.zip`);
      dispatch(
        apiSuccess({
          message: "Download is ready!",
          status: 0,
          load: false,
        })
      );
    } catch (err) {
      if (err.response) {
        try {
          const { data } = err.response;
          const file = await fileReader(data);
          const { message, statusCode } = JSON.parse(file);
          dispatch(apiError({ message: message, status: statusCode }));
        } catch (readError) {
          dispatch(
            apiError({
              message: "Something went wrong on zip download or generation",
              status: 7,
            })
          );
        }
      } else {
        dispatch(
          apiError({
            message: "Something went wrong on zip download",
            status: 7,
          })
        );
      }
    }
  };
};
