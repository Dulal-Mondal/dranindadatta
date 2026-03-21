import api from './api';

export const createPrescription = (data) => api.post('/prescriptions/create', data);
export const getMyPrescriptions = () => api.get('/prescriptions/my');
export const getDoctorPrescriptions = () => api.get('/prescriptions/doctor');
export const getPrescriptionById = (id) => api.get(`/prescriptions/${id}`);
export const updatePrescription = (id, data) => api.put(`/prescriptions/${id}`, data);
export const downloadPrescription = (id) => api.get(`/prescriptions/${id}/download`);