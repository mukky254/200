import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaUser, 
  FaQrcode, 
  FaHistory,
  FaBook,
  FaClipboardList,
  FaUsers,
  FaChartBar,
  FaCogs,
  FaTimes,
  FaSignOutAlt
} from 'react-icons/fa';
import { ROLES } from '../../utils/constants';
import './Sidebar.css';

const Sidebar = ({ role, isOpen, onClose, onLogout }) => {
  const navigate = useNavigate();

  const studentMenu = [
    { path: '/student/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/student/scan', label: 'Scan QR Code', icon: <FaQrcode /> },
    { path: '/student/attendance', label: 'Attendance History', icon: <FaHistory /> },
    { path: '/student/units', label: 'My Units', icon: <FaBook /> },
    { path: '/student/profile', label: 'Profile', icon: <FaUser /> },
  ];

  const lecturerMenu = [
    { path: '/lecturer/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/lecturer/generate-qr', label: 'Generate QR Code', icon: <FaQrcode /> },
    { path: '/lecturer/history', label: 'Lecture History', icon: <FaClipboardList /> },
    { path: '/lecturer/profile', label: 'Profile', icon: <FaUser /> },
  ];

  const adminMenu = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/admin/users', label: 'User Management', icon: <FaUsers /> },
    { path: '/admin/reports', label: 'Reports', icon: <FaChartBar /> },
    { path: '/admin/system', label: 'System Stats', icon: <FaCogs /> },
    { path: '/admin/profile', label: 'Profile', icon: <FaUser /> },
  ];

  const getMenuItems = () => {
    switch (role) {
      case ROLES.STUDENT:
        return studentMenu;
      case ROLES.LECTURER:
        return lecturerMenu;
      case ROLES.ADMIN:
        return adminMenu;
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3 className="sidebar-logo">IN Attendance</h3>
          <button className="sidebar-close d-lg-none" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="sidebar-content">
          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `sidebar-nav-link ${isActive ? 'active' : ''}`
                }
                onClick={onClose}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                <span className="sidebar-nav-label">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        
        <div className="sidebar-footer">
          <button 
            className="sidebar-logout-btn"
            onClick={onLogout}
          >
            <FaSignOutAlt className="me-2" />
            Logout
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div className="sidebar-backdrop d-lg-none" onClick={onClose} />
      )}
    </>
  );
};

export default Sidebar;
