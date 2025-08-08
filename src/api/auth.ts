import api from "./axios";

// signup function
export const signup = async (data: { name: string; email: string; password: string }) => {
  return await api.post("/auth/signup", data);
};

// login function
export const login = async (data: { email: string; password: string }) => {
  return await api.post("/auth/login", data);
};
