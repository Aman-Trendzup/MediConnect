import { api } from '@/lib/axios'; 

export const publicApi = {
  getDoctors: async (params = {}) => {
    const response = await api.get('/api/doctors', { params });
    return response.data;
  },

  getServices: async (params = {}) => {
    const response = await api.get('/api/services', { params });
    return response.data;
  },

  getDoctorProfile: async (doctorId) => {
    const response = await api.get(`/api/doctors/${doctorId}`);
    return response.data;
  },
};