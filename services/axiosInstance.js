import axios from "axios";

// Lấy baseURL từ biến môi trường hoặc dùng IP server backend
const IP_URL = "http://192.168.1.100:5155";
const BASE_URL = `${IP_URL}/api`;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 giây timeout
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Nếu backend cần gửi cookie/session
});

export default axiosInstance;
