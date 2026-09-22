import axios from "./axiosInstance";

export const getServices = async (params = {}) => {
  const response = await axios.get("/services", {
    params,
  });

  return response.data;
};

export const createService = async (data) => {
  const response = await axios.post("/services", data);
  return response.data;
};

export const getMyServices = async () => {
  const response = await axios.get("/services/my");
  return response.data;
};