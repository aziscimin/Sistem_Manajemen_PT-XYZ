import API from "../api/api";

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const getProjects = () => API.get("/projects/");
export const createProject = (data) => API.post("/projects/", data);
export const updateProject = (id, data) => API.put(`/projects/${id}`, data);
export const deleteProject = (id) => API.delete(`/projects/${id}`);
export const assignMembersApi = (id, data) => API.put(`/projects/${id}/assign`, data);

