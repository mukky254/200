import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import LoadingSpinner from './LoadingSpinner';
import { APP_NAME } from '../../utils/constants';
import './Layout.css';

const Layout = ({ role }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Close sidebar on mobile when route changes
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const pageTitle = getPageTitle(location.pathname, role);

  return (
    <>
      <Helmet>
        <title>{pageTitle} | {APP_NAME}</title>
      </Helmet>
      
      <div className={`layout-wrapper ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Sidebar 
          role={role} 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
        />
        
        <div className="main-content">
          <Navbar 
            user={user}
            onToggleSidebar={toggleSidebar}
            onLogout={handleLogout}
          />
          
          <main className="container-fluid py-4">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="fade-in">
                <Outlet />
              </div>
            )}
          </main>
          
          <footer className="footer mt-auto py-3 bg-light border-top">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <span className="text-muted">
                    © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
                  </span>
                </div>
                <div className="col-md-6 text-md-end">
                  <span className="text-muted">
                    Version {process.env.REACT_APP_VERSION}
                  </span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

const getPageTitle = (pathname, role) => {
  const path = pathname.split('/').pop() || 'dashboard';
  
  const titles = {
    dashboard: 'Dashboard',
    profile: 'Profile',
    scan: 'Scan QR Code',
    attendance: 'Attendance History',
    units: 'My Units',
    'generate-qr': 'Generate QR Code',
    history: 'Lecture History',
    lecture: 'Lecture Attendance',
    users: 'User Management',
    reports: 'Reports',
    system: 'System Statistics'
  };

  return titles[path] || capitalizeFirst(path);
};

const capitalizeFirst = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default Layout;
