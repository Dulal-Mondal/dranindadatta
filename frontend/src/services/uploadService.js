import api from './api';

export const uploadAvatar = (formData) =>
    api.post('/upload/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

export const uploadDoctorImages = (formData) =>
    api.post('/upload/doctor-images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

export const uploadDoctorVideos = (formData) =>
    api.post('/upload/doctor-videos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

export const deleteFile = (publicId, resourceType = 'image') =>
    api.delete('/upload/delete', { data: { publicId, resourceType } });

export const getUploadSignature = (folder) =>
    api.get('/upload/signature', { params: { folder } });
