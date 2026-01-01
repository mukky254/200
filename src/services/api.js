import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response) {
      // Handle specific error codes
      switch (response.status) {
        case 401:
          // Unauthorized - token expired or invalid
          if (window.location.pathname !== '/login') {
            toast.error('Session expired. Please login again.');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
          break;
          
        case 403:
          // Forbidden - insufficient permissions
          toast.error('You do not have permission to access this resource.');
          window.location.href = '/unauthorized';
          break;
          
        case 404:
          // Not Found
          toast.error('Resource not found.');
          break;
          
        case 429:
          // Too Many Requests
          toast.error('Too many requests. Please try again later.');
          break;
          
        case 500:
          // Internal Server Error
          toast.error('Server error. Please try again later.');
          break;
          
        default:
          // Other errors
          if (response.data?.error) {
            toast.error(response.data.error);
          }
      }
    } else {
      // Network error
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

// API helper functions
export const handleApiError = (error) => {
  console.error('API Error:', error);
  return {
    success: false,
    error: error.response?.data?.error || 'An error occurred',
    status: error.response?.status,
  };
};

export const handleApiSuccess = (response) => {
  return {
    success: true,
    data: response.data.data,
    message: response.data.message,
  };
};

export default api;
