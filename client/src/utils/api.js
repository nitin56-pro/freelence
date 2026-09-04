import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api',  // proxy will forward to backend
});

// Add token to every request automatically
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
