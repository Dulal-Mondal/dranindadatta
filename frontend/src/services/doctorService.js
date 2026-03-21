import api from './api';

export const getAllDoctors = (params) => api.get('/doctors', { params });
export const getDoctorById = (id) => api.get(`/doctors/${id}`);
export const getMyDoctorProfile = () => api.get('/doctors/profile/me');
export const updateDoctorProfile = (data) => api.put('/doctors/profile/update', data);
export const uploadDoctorImages = (formData) =>
    api.post('/doctors/upload-images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
export const uploadDoctorVideos = (formData) =>
    api.post('/doctors/upload-videos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
export const deleteDoctorImage = (imageUrl) =>
    api.delete('/doctors/delete-image', { data: { imageUrl } });
export const deleteDoctorVideo = (videoUrl) =>
    api.delete('/doctors/delete-video', { data: { videoUrl } });
export const getDoctorStats = () => api.get('/doctors/dashboard/stats');
export const blockPatient = (patientId) =>
    api.put(`/doctors/block-patient/${patientId}`);