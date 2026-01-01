import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// Common Components
import Layout from './components/common/Layout';
import PrivateRoute from './components/common/PrivateRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import QRScanner from './pages/student/QRScanner';
import AttendanceHistory from './pages/student/AttendanceHistory';
import StudentUnits from './pages/student/Units';

// Lecturer Pages
import LecturerDashboard from './pages/lecturer/Dashboard';
import GenerateQR from './pages/lecturer/GenerateQR';
import LectureHistory from './pages/lecturer/LectureHistory';
import LectureAttendance from './pages/lecturer/LectureAttendance';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import Reports from './pages/admin/Reports';
import SystemStats from './pages/admin/SystemStats';

// Error Pages
import NotFound from './pages/error/NotFound';
import Unauthorized from './pages/error/Unauthorized';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Protected Student Routes */}
              <Route path="/student" element={
                <PrivateRoute allowedRoles={['student']}>
                  <Layout role="student" />
                </PrivateRoute>
              }>
                <Route index element={<StudentDashboard />} />
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="profile" element={<StudentProfile />} />
                <Route path="scan" element={<QRScanner />} />
                <Route path="attendance" element={<AttendanceHistory />} />
                <Route path="units" element={<StudentUnits />} />
              </Route>
              
              {/* Protected Lecturer Routes */}
              <Route path="/lecturer" element={
                <PrivateRoute allowedRoles={['lecturer']}>
                  <Layout role="lecturer" />
                </PrivateRoute>
              }>
                <Route index element={<LecturerDashboard />} />
                <Route path="dashboard" element={<LecturerDashboard />} />
                <Route path="generate-qr" element={<GenerateQR />} />
                <Route path="history" element={<LectureHistory />} />
                <Route path="lecture/:id" element={<LectureAttendance />} />
              </Route>
              
              {/* Protected Admin Routes */}
              <Route path="/admin" element={
                <PrivateRoute allowedRoles={['admin']}>
                  <Layout role="admin" />
                </PrivateRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="reports" element={<Reports />} />
                <Route path="system" element={<SystemStats />} />
              </Route>
              
              {/* Default Route */}
              <Route path="/" element={<Navigate to="/login" />} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
