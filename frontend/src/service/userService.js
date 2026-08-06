import axios from "./axiosInstance";

export const getCurrentUser = async () => {

    const response = await axios.get("/users/profile");

    return response.data;
};  