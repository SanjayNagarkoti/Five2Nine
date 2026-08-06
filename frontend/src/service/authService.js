import axios from "./axiosInstance";

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/signup`, userData, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};
export const authenticateUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, userData, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const testApi = async () => {
    const response = await axios.get("/test");

    return response.data;
};