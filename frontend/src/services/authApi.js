import {api} from "@/lib/axios.js"; // Adjust path if your axios instance is in a different directory (e.g., "@/services/axios")

export const authApi = {
  /**
   * Register a new user
   * @param {Object} userData - User registration details (name, email, password, role, etc.)
   */
  register: async (userData) => {
    const response = await api.post("/api/auth/register", userData);
    return response.data;
  },

  /**
   * Login user and establish HttpOnly cookie session
   * @param {Object} credentials - { email, password }
   */
  login: async (credentials) => {
    const response = await api.post("/api/auth/login", credentials);
    return response.data;
  },

  /**
   * Logout user and clear session cookies
   */
  logout: async () => {
    const response = await api.post("/api/auth/logout");
    return response.data;
  },

  /**
   * Fetch currently authenticated user profile
   */
  getCurrentUser: async () => {
    const response = await api.get("/api/auth/me");
    return response.data;
  },
};

// Direct export helper functions matching your Zustand store imports
export const registerUser = authApi.register;
export const loginUser = authApi.login;
export const logoutUser = authApi.logout;
export const getCurrentUser = authApi.getCurrentUser;

export default authApi;