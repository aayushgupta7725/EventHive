import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
if (baseURL.endsWith('/')) baseURL = baseURL.slice(0, -1);
if (!baseURL.endsWith('/api')) baseURL += '/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — always attach the latest token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('eh_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('eh_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
