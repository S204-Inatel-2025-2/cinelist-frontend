import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// cria instância do axios
const api = axios.create({
  baseURL: API_URL,
});

// interceptor para enviar token no header (se existir)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;