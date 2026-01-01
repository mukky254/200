import api from './api';
import { handleApiError, handleApiSuccess } from './api';

export const lecturerService = {
  // Get lecturer dashboard data
  getDashboard: async () => {
    try {
      const response = await api.get('/lecturer/dashboard');
      return handleApiSuccess(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Generate QR code
  generateQRCode: async (lectureData) => {
    try {
      const response = await api.post('/lecturer/generate-qr', lectureData);
      return handleApiSuccess(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get lecturer's lectures
  getLectures: async (params = {}) => {
    try {
      const response = await api.get('/lecturer/lectures', { params });
      return handleApiSuccess(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get attendance for a specific lecture
  getLectureAttendance: async (lectureId) => {
    try {
      const response = await api.get(`/lecturer/attendance/${lectureId}`);
      return handleApiSuccess(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update lecture details
  updateLecture: async (lectureId, updateData) => {
    try {
      const response = await api.put(`/lecturer/lectures/${lectureId}`, updateData);
      return handleApiSuccess(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Delete (deactivate) lecture
  deleteLecture: async (lectureId) => {
    try {
      const response = await api.delete(`/lecturer/lectures/${lectureId}`);
      return handleApiSuccess(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update attendance status
  updateAttendanceStatus: async (attendanceId, status, notes) => {
    try {
      const response = await api.put(`/lecturer/attendance/${attendanceId}/status`, {
        status,
        notes
      });
      return handleApiSuccess(response);
    } catch (error) {
      return handleApiError(error);
    }
  }
};
