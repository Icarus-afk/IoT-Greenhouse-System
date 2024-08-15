import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

// Create axios instance for non-authenticated requests
export const apiClientNoAuth = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance for authenticated requests
export const apiClientAuth = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to refresh token
const refreshToken = async () => {
  const refresh = localStorage.getItem('refresh');
  if (!refresh) return null;

  try {
    const response = await apiClientNoAuth.post('/user/refresh/', { refresh });
    const { access } = response.data;
    localStorage.setItem('jwt', access);
    return access;
  } catch (error) {
    console.error('Failed to refresh token', error);
    return null;
  }
};

// Add request interceptor
apiClientAuth.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
apiClientAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response } = error;
    if (response && response.status === 401) {
      // Token is invalid or expired
      const newToken = await refreshToken();
      if (newToken) {
        // Retry the original request with the new token
        const originalRequest = error.config;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return apiClientAuth(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: '/user/login/',
  SIGNUP: '/user/signup/',
  GET_USER_INFO: '/user/info/',
  UPDATE_USER_INFO: '/user/update/',
  LOGOUT: '/user/logout/',
  REFRESH_TOKEN: '/user/refresh/',
  GET_DEVICE_DATA: '/device/data/', 
  DEVICE_DETAILS: '/device/device/',
  NOTIFICATIONS: '/notification/get/',
  PASSWORD_RESET_REQUEST: '/user/password-reset/',
  PASSWORD_RESET_CONFIRM: '/user/password-reset-confirm/',
};