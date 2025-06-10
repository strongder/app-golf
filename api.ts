import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const IP = "192.168.143.231";
export const URL_IMAGE = `http://${IP}:8080/uploads/`;
export const API_URL = `http://${IP}:8080/api/v1`;

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach interceptor ONCE at import time
axiosInstance.interceptors.request.use(
  async (config) => {
    const noAuthRequiredUrls = ["/public", "/auth"];
    const isNoAuthRequired = noAuthRequiredUrls.some((url) =>
      config.url?.includes(url)
    );

    if (!isNoAuthRequired) {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      } else {
    
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
