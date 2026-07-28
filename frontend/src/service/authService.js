import axios from "axios";

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