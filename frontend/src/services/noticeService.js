import api from './api';

// Public — active notices fetch (Navbar er jonno)
export const getPublicNotices = () => api.get('/notices/public');

// Admin — sob notices
export const getAllNotices = () => api.get('/notices');

// Admin — create
export const createNotice = (data) => api.post('/notices', data);

// Admin — update (text, color, bgColor, isActive, order)
export const updateNotice = (id, data) => api.put(`/notices/${id}`, data);

// Admin — delete
export const deleteNotice = (id) => api.delete(`/notices/${id}`);