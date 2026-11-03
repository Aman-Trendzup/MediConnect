import {api} from '@/lib/axios'; 

export const submitDoctorApplication = async (formData) => {
  const response = await api.post('/api/doctor/application', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const checkApplicationStatus = async () => {
  const response = await api.get('/api/doctor/application-status');
  return response.data;
};

export const getDoctorDashboardStats = async () => {
  const response = await api.get('/api/doctor/dashboard');
  return response.data;
};

export const getDoctorProfile = async () => {
  const response = await api.get('/api/doctor/profile');
  return response.data;
};

export const updateDoctorProfile = async (profileData) => {
  const response = await api.post('/api/doctor/profile', profileData);
  return response.data;
};

export const setAvailability = async (scheduleData) => {
  const response = await api.post('/api/doctor/schedule', scheduleData);
  return response.data;
};

export const getAvailability = async (date) => {
  const response = await api.get('/api/doctor/schedule', {
    params: { date }
  });
  return response.data;
};

export const getAllAppointments = async (filters) => {
  const response = await api.get('/api/doctor/appointments', {
    params: filters 
  });
  return response.data;
};

export const getAppointmentRequests = async () => {
  const response = await api.get('/api/doctor/pending-appointments');
  return response.data;
};

export const updateAppointmentStatus = async (id, statusData) => {
  const response = await api.patch(`/api/doctor/appointments/${id}/status`, statusData);
  return response.data;
};


export const getAppointmentById = async (id) => {
  const response = await api.get(`/api/doctor/appointments/${id}`);
  return response.data;
};


export const createBlockedSlot = async (slotData) => {
  const response = await api.post('/api/doctor/blocked-slot', slotData);
  return response.data;
};

export const getBlockedSlots = async (params) => {
  const response = await api.get('/api/doctor/blocked-slots', { params });
  return response.data;
};

export const deleteBlockedSlot = async (id) => {
  const response = await api.delete(`/api/doctor/blocked-slot/${id}`);
  return response.data;
};