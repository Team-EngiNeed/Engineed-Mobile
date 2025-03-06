import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants/constants";

const api = axios.create({
  baseURL: "https://engineedbackend.onrender.com",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to refresh token
const refreshToken = async () => {
  try {
    const refresh = await AsyncStorage.getItem(REFRESH_TOKEN);
    if (!refresh) throw new Error("No refresh token found");

    const response = await axios.post(
      `${api.defaults.baseURL}/api/token/refresh/`,
      {
        refresh,
      }
    );

    const newAccessToken = response.data.access;
    await AsyncStorage.setItem(ACCESS_TOKEN, newAccessToken);

    console.log("Token refreshed successfully!");
    return newAccessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    await AsyncStorage.removeItem(ACCESS_TOKEN);
    await AsyncStorage.removeItem(REFRESH_TOKEN);
    return null;
  }
};

// Add request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for handling 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("Access token expired. Attempting refresh...");
      originalRequest._retry = true;

      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api.request(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
