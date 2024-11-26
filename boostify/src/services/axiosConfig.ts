import axios from 'axios';

const api = axios.create({
  baseURL: 'https://boostify-back-end.up.railway.app',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';
    config.headers['Accept'] = 'application/json';
    return config;
  },
  (error) => {
    
    return Promise.reject(error);
  }
);

export default api;