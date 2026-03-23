import axios from 'axios';

// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
//     timeout: 10000,
// });



const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://api.dranindadatta.com/api', // ✅ /api যোগ করুন
    timeout: 10000,
    withCredentials: true
});
// request interceptor — token auto attach
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// response interceptor — error handle
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || 'Something went wrong';

        // 401 — token expired or invalid
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        // 403 — forbidden
        if (error.response?.status === 403) {
            console.error('Access denied:', message);
        }

        // 500 — server error
        if (error.response?.status === 500) {
            console.error('Server error:', message);
        }

        return Promise.reject(error);
    }
);

export default api;