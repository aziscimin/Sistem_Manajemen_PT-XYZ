import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api/users" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const getUsers = () => API.get("/");
export const createUser = (data) => API.post("/", data);
export const updateUser = (id, data) => API.put(`/${id}`, data);
export const deleteUserApi = (id) => API.delete(`/${id}`);
