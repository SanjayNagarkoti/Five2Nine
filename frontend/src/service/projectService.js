import axios from "./axiosInstance";

export const getProjects = async () => {
  const response = await axios.get("/projects");
  return response.data;
};

export const createProject = async (data) => {
  const response = await axios.post("/projects", data);
  return response.data;
};

export const getMyProjects = async () => {
  const response = await axios.get("/projects/my");
  return response.data;
};