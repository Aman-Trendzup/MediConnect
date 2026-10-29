import { create } from 'zustand';
import { getCurrentUser, loginUser, registerUser, logoutUser } from '@/services/authApi';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient';
  status?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  
  checkAuth: () => Promise<void>;
  login: (credentials: { email: string; password: string }) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  // Verify HttpOnly cookie session on app startup
  checkAuth: async () => {
    try {
      set({ loading: true });
      const res = await getCurrentUser();
      if (res?.success) {
        set({ user: res.user || res.data?.user || res.data, loading: false });
      } else {
        set({ user: null, loading: false });
      }
    } catch (error) {
      set({ user: null, loading: false });
    }
  },

  login: async (credentials) => {
    const res = await loginUser(credentials);
    if (res?.success) {
      const user = res.user || res.data?.user || res.data;
      set({ user });
    }
    return res;
  },

  register: async (userData) => {
    const res = await registerUser(userData);
    if (res?.success) {
      const user = res.user || res.data?.user || res.data;
      set({ user });
    }
    return res;
  },

  logout: async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      set({ user: null, loading: false });
    }
  },
}));