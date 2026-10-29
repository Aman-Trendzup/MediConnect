import { api } from '@/lib/axios'; 

export const adminApi = {
  getDashboardStats: async () => {
    const response = await api.get('/api/admin/dashboard-stats');
    return response.data;
  },

 
  getDoctorApplications: async (params = {}) => {
    const response = await api.get('/api/admin/doctor-applications', { params });
    return response.data;
  },

  getApplicationById: async (id) => {
    const response = await api.get(`/api/admin/applications/${id}`);
    return response.data;
  },

  reviewDoctorApplication: async (id, reviewData) => {
    const response = await api.patch(`/api/admin/applications/${id}/review`, reviewData);
    return response.data;
  },

 
  getUsers: async (params = {}) => {
    const response = await api.get('/api/admin/users', { params });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/api/admin/users/${id}`);
    return response.data;
  },

  updateUserStatus: async (id, statusData) => {
    const response = await api.patch(`/api/admin/users/${id}/status`, statusData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/api/admin/users/${id}`);
    return response.data;
  },


  getAppointments: async (params = {}) => {
    const response = await api.get('/api/admin/appointments', { params });
    return response.data;
  },

  
  getServiceCategories: async (params = {}) => {
    const response = await api.get('/api/admin/service-categories', { params });
    return response.data;
  },

  getServiceCategoryById: async (id) => {
    const response = await api.get(`/api/admin/serivce-category/${id}`);
    return response.data;
  },

  createServiceCategory: async (categoryData) => {
    const response = await api.post('/api/admin/service-category', categoryData);
    return response.data;
  },

  updateServiceCategory: async (id, categoryData) => {
    const response = await api.put(`/api/admin/service-category/${id}`, categoryData);
    return response.data;
  },

  deleteServiceCategory: async (id) => {
    const response = await api.delete(`/api/admin/service-category/${id}`);
    return response.data;
  },

  
  getAuditLogs: async (params = {}) => {
    const response = await api.get('/api/admin/audit-logs', { params });
    return response.data;
  },
};