import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ACCESS_TOKEN } from "./constants/constants";

const api = axios.create({
  //baseURL: "http://192.168.50.11:8000", //URL ni nico
  baseURL: "http://192.168.0.14:8080", //URL ng valenzuela3
  //baseURL: "http://192.168.137.141:8080", //URL ng paspas
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
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
