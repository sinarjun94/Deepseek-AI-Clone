import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4002/api/v1",
  withCredentials: true,
});
console.log(import.meta.env.VITE_API_URL);

export default axiosInstance;
