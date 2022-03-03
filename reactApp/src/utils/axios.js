import axios from "axios";

//Exports axios instances with unique configurations

//for general use
export const api = axios.create({
  baseURL: "http://localhost:5000/",
});

export const auth = axios.create({
  baseURL: "http://localhost:5000/auth/",
});

export const users = axios.create({
  baseURL: "http://localhost:5000/users/",
});
