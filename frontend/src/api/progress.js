import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:5000/api/progress" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const getProgress = () => API.get("/");
export const addProgress = (data) => API.post("/", data);
export const updateProgressStatus = (id, data) => API.put(`/${id}/status`, data);
