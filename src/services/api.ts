import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // ✅ CHỈ để /api
});

export default api;