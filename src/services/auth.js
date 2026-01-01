import api from './api';
import { handleApiError, handleApiSuccess } from './api';

export const authService = {
  // Login
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return handleApiSuccess(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Register
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return handleApiSuccess(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return handleApiSuccess(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      return handleApiSuccess(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      return handleApiSuccess(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get all users (admin only)
  getAllUsers: async (params = {}) => {
    try {
      const response = await api.get('/auth/users', { params });
      return handleApiSuccess(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update user status (admin only)
  updateUserStatus: async (userId, isActive) => {
    try {
      const response = await api.put(`/auth/users/${userId}/status`, { isActive });
      return handleApiSuccess(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return handleApiSuccess(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Reset password
  resetPassword: async (token, password) => {
    try {
      const response = await api.post('/auth/reset-password', { token, password });
      return handleApiSuccess(response);
    } catch (error) {
      return handleApiError(error);
    }
  }
};
