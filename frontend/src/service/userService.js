import axios from "./axiosInstance";

export const getCurrentUser = async () => {
  const response = await axios.get("/users/profile");
  return response.data;
};

// Update the current user's optional profile fields.
export const updateCurrentUserProfile = async (data) => {
  const response = await axios.put("/users/profile", data);
  return response.data;
};

// Backwards-compatible alias for existing imports.
export const updateMyProfile = updateCurrentUserProfile;

export const changeMyPassword = async (data) => {
  const response = await axios.put("/users/password", data);
  return response.data;
};

// Public profile endpoint: response must exclude email and other private fields.
export const getPublicUserProfile = async (userId) => {
  const response = await axios.get(`/users/${encodeURIComponent(userId)}/public-profile`);
  return response.data;
};
