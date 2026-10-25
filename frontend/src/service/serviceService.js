import axios from "./axiosInstance";

export const getServices = async (params = {}) => {
  const response = await axios.get("/services", { params });
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

export const getServiceById = async (serviceId) => {
  const response = await axios.get(`/services/${serviceId}`);
  return response.data;
};

export const updateService = async (serviceId, data) => {
  const response = await axios.put(`/services/${serviceId}`, data);
  return response.data;
};

export const deleteService = async (serviceId) => {
  const response = await axios.delete(`/services/${serviceId}`);
  return response.data;
};
