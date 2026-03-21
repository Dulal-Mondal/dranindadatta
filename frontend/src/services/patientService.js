import api from './api';

export const getMyPatientProfile = () => api.get('/patients/profile/me');
export const updatePatientProfile = (data) => api.put('/patients/profile/update', data);
export const getPatientStats = () => api.get('/patients/dashboard/stats');
export const getFullHistory = () => api.get('/patients/full-history');
export const addMedicalHistory = (data) => api.post('/patients/medical-history', data);
export const deleteMedicalHistory = (id) =>
    api.delete(`/patients/medical-history/${id}`);
export const updateAvatar = (formData) =>
    api.put('/patients/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });