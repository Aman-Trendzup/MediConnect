import {api} from "@/lib/axios.js"; 

export const authApi = {

  register: async (userData) => {
    const response = await api.post("/api/auth/register", userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post("/api/auth/login", credentials);
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/api/auth/logout");
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/api/auth/me");
    return response.data;
  },
};

export const registerUser = authApi.register;
export const loginUser = authApi.login;
export const logoutUser = authApi.logout;
export const getCurrentUser = authApi.getCurrentUser;

export default authApi;