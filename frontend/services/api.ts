import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Auth
export const authAPI = {
    register: (data: { name: string; email: string; password: string }) =>
        api.post('/auth/register', data),
    login: (data: { email: string; password: string }) =>
        api.post('/auth/login', data),
    githubAuth: (code: string) =>
        api.post('/auth/github', { code }),
    getProfile: () =>
        api.get('/auth/me'),
};

// Reviews
export const reviewAPI = {
    create: (data: { code: string; language: string; title?: string }) =>
        api.post('/reviews', data),
    getAll: () =>
        api.get('/reviews'),
    getById: (id: string) =>
        api.get(`/reviews/${id}`),
    delete: (id: string) =>
        api.delete(`/reviews/${id}`),
};

// Analytics
export const analyticsAPI = {
    getOverview: () =>
        api.get('/analytics/overview'),
    getTrends: () =>
        api.get('/analytics/trends'),
};

export default api;
