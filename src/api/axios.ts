import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/quiz", // your backend base URL
});

export default api;
