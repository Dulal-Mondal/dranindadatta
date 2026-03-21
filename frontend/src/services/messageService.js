import api from './api';

export const getConversations = () => api.get('/messages/conversations');
export const getMessages = (userId, params) =>
    api.get(`/messages/${userId}`, { params });
export const sendMessage = (data) => api.post('/messages/send', data);
export const sendFileMessage = (formData) =>
    api.post('/messages/send-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
export const deleteMessage = (messageId) => api.delete(`/messages/${messageId}`);

export const editMessage = (messageId, text) =>
    api.put('/messages/' + messageId, { text });