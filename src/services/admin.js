import api from './api';
import { handleApiError, handleApiSuccess } from './api';

export const adminService = {
  // Get admin dashboard data
  getDashboard: async () => {
    try {
      const response = await api.get('/admin/dashboard');
      return handleApiSuccess(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get attendance reports
  getAttendanceReports: async (params = {}) => {
    try {
      const response = await api.get('/admin/reports/attendance', { params });
      return handleApiSuccess(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Export reports
  exportReports: async (params = {}) => {
    try {
      const response = await api.get('/admin/reports/export', {
        params,
        responseType: 'blob'
      });
      return {
        success: true,
        data: response.data,
        filename: response.headers['content-disposition']?.split('filename=')[1] || 'report.csv'
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get system statistics
  getSystemStats: async () => {
    try {
      const response = await api.get('/admin/system/stats');
      return handleApiSuccess(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Create system backup
  createBackup: async () => {
    try {
      const response = await api.post('/admin/system/backup');
      return handleApiSuccess(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get system logs
  getSystemLogs: async (params = {}) => {
    try {
      const response = await api.get('/admin/system/logs', { params });
      return handleApiSuccess(response);
    } catch (error) {
      return handleApiError(error);
    }
  }
};
