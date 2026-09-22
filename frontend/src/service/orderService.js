import axios from "./axiosInstance";

export const getMyOrders = async () => {
  const response = await axios.get("/orders/my");
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await axios.get(`/orders/${orderId}`);
  return response.data;
};