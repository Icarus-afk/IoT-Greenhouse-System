import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000', // Change this to your Django backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
