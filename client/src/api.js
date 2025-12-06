import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

// Add tenant header and auth token to all requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    const selectedStore = localStorage.getItem('selectedStore');
    if (selectedStore) {
        config.headers['x-shop-domain'] = selectedStore;
    }

    return config;
});

export default api;
