import API from "../api/api";

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const getProgress = () => API.get("/progress");
export const addProgress = (data) => API.post("/progress", data);
export const updateProgressStatus = (id, data) => API.put(`/progress/${id}/status`, data);
