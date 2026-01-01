import api from './api';
import { handleApiError, handleApiSuccess } from './api';

export const studentService = {
  // Get student dashboard data
  getDashboard: async () => {
    try {
      const response = await api.get('/student/dashboard');
      return handleApiSuccess(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Scan QR code
  scanQRCode: async (code, lectureId) => {
    try {
      const response = await api.post('/student/scan', { code, lectureId });
      return handleApiSuccess(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get attendance history
  getAttendanceHistory: async (params = {}) => {
    try {
      const response = await api.get('/student/attendance', { params });
      return handleApiSuccess(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get student units
  getUnits: async () => {
    try {
      const response = await api.get('/student/units');
      return handleApiSuccess(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get single attendance record
  getAttendanceRecord: async (attendanceId) => {
    try {
      const response = await api.get(`/student/attendance/${attendanceId}`);
      return handleApiSuccess(response);
    } catch (error) {
      return handleApiError(error);
    }
  }
};
