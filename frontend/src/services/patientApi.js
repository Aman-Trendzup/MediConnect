import { api } from "@/lib/axios.js";

export const patientApi = {
  getAllAppointments: async (status) => {
    const params = status && status !== "all" ? { status } : {};
    const response = await api.get("/api/patient/appointments", { params });
    return response.data;
  },

  bookAppointment: async (doctorId, appointmentData) => {
    const response = await api.post(`/api/patient/appointments/${doctorId}`, appointmentData);
    return response.data;
  },

  cancelAppointment: async (appointmentId) => {
    const response = await api.patch(`/api/patient/appointments/${appointmentId}/cancel`);
    return response.data;
  },

  checkDoctorAvailability: async (doctorId, params) => {
    const response = await api.get(`/api/patient/doctors/${doctorId}/availability`, { params });
    return response.data;
  },

  getPatientProfile: async () => {
    const response = await api.get("/api/patient/profile");
    return response.data;
  },

  updatePatientProfile: async (profileData) => {
    const response = await api.patch("/api/patient/profile", profileData);
    return response.data;
  },

  createReview: async (appointmentId, reviewData) => {
    const response = await api.post(`/api/patient/appointments/${appointmentId}/review`, reviewData);
    return response.data;
  },
};