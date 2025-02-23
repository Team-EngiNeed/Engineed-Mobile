import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants/constants";

const api = axios.create({
  baseURL: "http://192.168.50.7:8080", // Update as needed
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
      "http://192.168.50.7:8080/api/token/refresh/",
      {
        refresh,
      }
    );

    const newAccessToken = response.data.access;
    await AsyncStorage.setItem(ACCESS_TOKEN, newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return null;
  }
};

// Add request interceptor
api.interceptors.request.use(
  async (config) => {
    let token = await AsyncStorage.getItem(ACCESS_TOKEN);
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
    if (error.response?.status === 401) {
      console.log("Access token expired. Trying to refresh...");
      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return api.request(error.config);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
