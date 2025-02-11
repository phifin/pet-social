import axios from "axios";

const IP_URL = "http://192.168.0.101:5155";
const BASE_URL = `${IP_URL}/api/`;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Interceptor để log request
axiosInstance.interceptors.request.use((config) => {
  console.log(
    `[REQUEST] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
  );
  console.log("Headers:", config.headers);
  console.log("Data:", config.data);
  return config;
});

// // Interceptor để log response
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[RESPONSE] ${response.status} ${response.config.url}`);
    console.log("Response Data:", response.data);
    return response;
  },
  (error) => {
    console.log(
      `[ERROR] ${error.response?.status || "N/A"} ${error.config?.url}`
    );
    console.log("Error Details:", error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
