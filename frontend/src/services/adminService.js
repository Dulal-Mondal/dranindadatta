import api from './api';

// stats
export const getAdminStats = () => api.get('/admin/stats');

// doctor management
export const getAllDoctorsAdmin = (params) => api.get('/admin/doctors', { params });
export const approveDoctor = (id) => api.put(`/admin/doctors/${id}/approve`);
export const rejectDoctor = (id) => api.put(`/admin/doctors/${id}/reject`);

// user management
export const getAllUsers = (params) => api.get('/admin/users', { params });
export const blockUser = (id) => api.put(`/admin/users/${id}/block`);
export const unblockUser = (id) => api.put(`/admin/users/${id}/unblock`);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

// slider management
export const getSliders = () => api.get('/admin/sliders');
export const createSlider = (formData) =>
    api.post('/admin/sliders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
export const updateSlider = (id, formData) =>
    api.put(`/admin/sliders/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
export const deleteSlider = (id) => api.delete(`/admin/sliders/${id}`);

// payment management
export const getAllPayments = () => api.get('/admin/payments');