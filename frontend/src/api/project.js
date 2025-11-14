import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api/projects" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const getProjects = () => API.get("/");
export const createProject = (data) => API.post("/", data);
export const updateProject = (id, data) => API.put(`/${id}`, data);
export const deleteProject = (id) => API.delete(`/${id}`);
export const assignMembersApi = (id, data) => API.put(`/${id}/assign`, data);

