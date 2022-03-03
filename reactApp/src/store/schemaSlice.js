import { createSlice } from "@reduxjs/toolkit";
import { generateUUID } from "../utils/generateUUID";

import { api } from "../utils/axios";
import fileDownload from "js-file-download";
import fileReader from "../utils/fileReader";
const schemaSlice = createSlice({
  name: "schemaConfig",

  initialState: {
    schema: {
      name: "",
      description: "",
      technology: "",
      databaseType: "",
      tables: [
        {
          id: "761e9fe2-41b6-1100-0000-20e0eca624c6",
          name: "Magicians",
          fields: [
            {
              id: "761e9fe2-41b6-0000-0000-20e0ecayy00",
              name: "Click_me",
              type: "Integer",
              required: true,
            },
            {
              id: "761e9fe2-41b6-0000-0000-20e0eca6yy01",
              name: "Hover_over_me",
              type: "DateTime",
              required: false,
            },
          ],
        },
      ],
    },
    currentItem: {
      class: "",
      tableId: "",
      fieldId: "",
      name: "",
      type: "",
      required: false,
    },
    selectedFieldType: "",
    statusCode: 0,
    message: null,
    loading: false,
    editing: false,
  },
  reducers: {
    clearTables(state) {
      state.schema.tables.length = 0;
    },
    addTable(state) {
      state.schema.tables.push({
        id: generateUUID(),
        name: "New_table",
        fields: [],
      });
    },
    deleteTable(state, action) {
      state.schema.tables = state.schema.tables.filter(
        (table) => table.id !== action.payload
      );
    },
    addField(state, action) {
      const index = state.schema.tables.findIndex(
        (table) => table.id === action.payload
      );
      state.schema.tables[index].fields.push({
        id: generateUUID(),
        name: "New_field",
        type: "String",
        required: false,
      });
    },
    deleteField(state, action) {
      const { fKey, tKey } = action.payload;

      const indexTable = state.schema.tables.findIndex(
        (table) => table.id === tKey
      );
      state.schema.tables[indexTable].fields = state.schema.tables[
        indexTable
      ].fields.filter((field) => field.id !== fKey);
    },
    clearFields(state, action) {
      const index = state.schema.tables.findIndex(
        (table) => table.id === action.payload
      );
      if (!index) {
        state.schema.tables[index].fields.length = 0;
      }
    },
    updateTable(state, action) {
      const { tKey, tableName } = action.payload;

      const index = state.schema.tables.findIndex((table) => table.id === tKey);
      state.schema.tables[index].name = tableName;
    },
    updateField(state, action) {
      const { tKey, fKey, fieldName, required, type } = action.payload;
      const table = state.schema.tables.findIndex((table) => table.id === tKey);
      const field = state.schema.tables[table].fields.findIndex(
        (field) => field.id === fKey
      );
      state.schema.tables[table].fields[field].name = fieldName;
      state.schema.tables[table].fields[field].required = required;
      state.schema.tables[table].fields[field].type = type;
    },
    clearCurrentItem(state) {
      state.currentItem.class = "";
      state.currentItem.tableId = "";
      state.currentItem.fieldId = "";
      state.currentItem.type = "";
      state.currentItem.name = "";
      state.currentItem.required = false;
      state.selectedFieldType = "";
    },
    newCurrentTable(state) {
      const [newestTable] = state.schema.tables.slice(-1);

      state.currentItem.class = "table";
      state.currentItem.tableId = newestTable.id;
      state.currentItem.name = "New_table";
    },
    newCurrentField(state, action) {
      const index = state.schema.tables.findIndex(
        (table) => table.id === action.payload
      );
      const [newestField] = state.schema.tables[index].fields.slice(-1);

      state.currentItem.class = "field";
      state.currentItem.tableId = action.payload;
      state.currentItem.fieldId = newestField.id;
      state.currentItem.name = "New_field";
    },
    changeCurrent(state, action) {
      const { itemClass, tableId, fieldId, type, name, required } =
        action.payload;

      state.currentItem.class = itemClass != null ? itemClass : "";
      state.currentItem.tableId = tableId != null ? tableId : null;
      state.currentItem.fieldId = fieldId != null ? fieldId : null;
      state.currentItem.type = type != null ? type : "";
      state.currentItem.name = name != null ? name : "";
      state.currentItem.required = required != null ? required : false;
      state.selectedFieldType = "";
    },
    schemaToAPI(state) {
      state.loading = true;
      state.message = null;
      state.statusCode = 0;
    },

    schemaSuccess(state, action) {
      const { message, status, load } = action.payload;
      state.message = message;
      state.statusCode = status;
      state.loading = load;
    },
    schemaError(state, action) {
      const { message, status } = action.payload;
      state.message = message;
      state.statusCode = status;
      state.loading = false;
    },
    setSchemaDetails(state, action) {
      const { name, description, techno, dbType } = action.payload;
      state.schema.name = name != null ? name : state.schema.name;
      state.schema.description =
        description != null ? description : state.schema.description;
      state.schema.technology =
        techno != null ? techno : state.schema.technology;
      state.schema.databaseType =
        dbType != null ? dbType : state.schema.databaseType;
    },
    setFieldType(state, action) {
      state.selectedFieldType = action.payload;
    },
    loadSchema(state, action) {
      state.schema = action.payload;
    },
    editingSchema(state) {
      state.editing = true;
    },
    clearSchema(state) {
      state.schema = {
        name: "",
        description: "",
        technology: "",
        databaseType: "",
        tables: [
          {
            id: "761e9fe2-41b6-1100-0000-20e0eca624c6",
            name: "Magicians",
            fields: [
              {
                id: "761e9fe2-41b6-0000-0000-20e0ecayy00",
                name: "Click_me",
                type: "Integer",
                required: true,
              },
              {
                id: "761e9fe2-41b6-0000-0000-20e0eca6yy01",
                name: "Hover_over_me",
                type: "DateTime",
                required: false,
              },
            ],
          },
        ],
      };
      state.currentItem = {
        class: "",
        tableId: "",
        fieldId: "",
        name: "",
        type: "",
        required: false,
      };
      state.selectedFieldType = "";
      state.statusCode = 0;
      state.message = null;
      state.loading = false;
      state.editing = false;
    },
  },
});

export default schemaSlice.reducer;

export const {
  clearTables,
  addTable,
  deleteTable,
  addField,
  deleteField,
  clearFields,
  updateTable,
  updateField,
  clearCurrentItem,
  newCurrentTable,
  newCurrentField,
  changeCurrent,
  schemaToAPI,
  schemaSuccess,
  schemaError,
  setSchemaDetails,
  setFieldType,
  loadSchema,
  editingSchema,
  clearSchema,
} = schemaSlice.actions;

//*Async action functions

export const saveSchema = (isReady) => {
  return async (dispatch, getState) => {
    dispatch(schemaToAPI());
    let url = isReady ? "/projects?ready=true" : "/projects?ready=false";
    try {
      const token = sessionStorage.getItem("token");
      const response = await api
        .put(url, getState().schemaConfig.schema, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => res.data);
      if (isReady) {
        dispatch(generateProjectZip(getState().schemaConfig.schema.name));
      } else {
        dispatch(
          schemaSuccess({
            message: response.message,
            status: response.statusCode,
            load: false,
          })
        );
      }
    } catch (err) {
      if (err.message === "Network Error")
        dispatch(schemaError({ message: err.message, status: err.name }));
      else {
        dispatch(
          schemaError({
            message: err.response.data.message,
            status: err.response.data.statusCode,
          })
        );
      }
    }
  };
};

export const updateSchema = (isReady, schemaName) => {
  return async (dispatch, getState) => {
    dispatch(schemaToAPI());
    let ready = isReady ? "?ready=true" : "?ready=false";
    const url = `/projects/${schemaName}${ready}`;
    try {
      const token = sessionStorage.getItem("token");
      const response = await api
        .patch(url, getState().schemaConfig.schema, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => res.data);
      if (isReady) {
        dispatch(generateProjectZip(getState().schemaConfig.schema.name));
      } else {
        dispatch(
          schemaSuccess({
            message: response.message,
            status: response.statusCode,
            load: false,
          })
        );
      }
    } catch (err) {
      if (err.message === "Network Error")
        dispatch(schemaError({ message: err.message, status: err.name }));
      else {
        dispatch(
          schemaError({
            message: err.response.data.message,
            status: err.response.data.statusCode,
          })
        );
      }
    }
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
        schemaSuccess({
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
          dispatch(schemaError({ message: message, status: statusCode }));
        } catch (readError) {
          dispatch(
            schemaError({
              message: "Something went wrong on zip download or generation",
              status: 7,
            })
          );
        }
      } else {
        dispatch(
          schemaError({
            message: "Something went wrong on zip download",
            status: 7,
          })
        );
      }
    }
  };
};
