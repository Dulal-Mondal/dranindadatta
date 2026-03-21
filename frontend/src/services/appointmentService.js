import api from './api';

export const bookAppointment = (data) => api.post('/appointments/book', data);
export const getMyAppointments = () => api.get('/appointments/my');
export const cancelAppointment = (id) => api.put(`/appointments/${id}/cancel`);
export const getDoctorAppointments = () => api.get('/appointments/doctor');
export const approveAppointment = (id) => api.put(`/appointments/${id}/approve`);
export const rejectAppointment = (id) => api.put(`/appointments/${id}/reject`);
export const completeAppointment = (id) => api.put(`/appointments/${id}/complete`);
export const getAllAppointments = () => api.get('/appointments/all');