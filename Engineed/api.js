import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ACCESS_TOKEN } from "./constants/constants";

const isDevelopment = process.env.NODE_ENV === "development";
const myBaseUrl = isDevelopment
  ? process.env.EXPO_PUBLIC_API_URL_LOCAL
  : process.env.EXPO_PUBLIC_API_URL_DEPLOY;

const api = axios.create({
  baseURL: myBaseUrl,
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(ACCESS_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;