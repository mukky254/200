import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Navbar as BootstrapNavbar,
  Nav,
  Container,
  Dropdown,
  Badge
} from 'react-bootstrap';
import { 
  FaBell, 
  FaUserCircle, 
  FaSignOutAlt,
  FaBars,
  FaCog,
  FaHome
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { getUserInitials } from '../../utils/helpers';
import './Navbar.css';

const Navbar = ({ user, onToggleSidebar, onLogout }) => {
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <BootstrapNavbar bg="white" expand="lg" className="navbar-shadow">
      <Container fluid>
        <div className="d-flex align-items-center">
          <button 
            className="btn btn-link text-dark d-lg-none me-2"
            onClick={onToggleSidebar}
          >
            <FaBars size={20} />
          </button>
          <Link to={`/${user?.role}`} className="navbar-brand d-none d-lg-block">
            <FaHome className="me-2" />
            <span className="fw-bold">IN Attendance</span>
          </Link>
        </div>

        <div className="d-flex align-items-center">
          {/* Notifications */}
          <Dropdown className="me-3">
            <Dropdown.Toggle
              variant="link"
              className="text-dark position-relative"
            >
              <FaBell size={20} />
              <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                3
              </Badge>
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              <Dropdown.Header>Notifications</Dropdown.Header>
              <Dropdown.Item>
                <div className="d-flex">
                  <div className="flex-shrink-0">
                    <div className="notification-icon bg-primary rounded-circle d-flex align-items-center justify-content-center">
                      <FaBell size={12} className="text-white" />
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <p className="mb-0 small">New lecture scheduled</p>
                    <small className="text-muted">2 hours ago</small>
                  </div>
                </div>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item className="text-center text-primary">
                View All Notifications
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {/* User Profile */}
          <Dropdown>
            <Dropdown.Toggle
              variant="link"
              className="text-dark d-flex align-items-center text-decoration-none"
            >
              <div className="user-avatar me-2">
                {user?.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt={user.name}
                    className="rounded-circle"
                    width="40"
                    height="40"
                  />
                ) : (
                  <div className="avatar-initials bg-primary text-white rounded-circle d-flex align-items-center justify-content-center">
                    {getUserInitials(user?.name)}
                  </div>
                )}
              </div>
              <div className="d-none d-md-block">
                <div className="small fw-bold">{user?.name}</div>
                <div className="x-small text-muted text-capitalize">{user?.role}</div>
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              <Dropdown.Header>
                <div className="fw-bold">{user?.name}</div>
                <div className="small text-muted">{user?.email}</div>
              </Dropdown.Header>
              <Dropdown.Divider />
              <Dropdown.Item as={Link} to={`/${user?.role}/profile`}>
                <FaUserCircle className="me-2" />
                My Profile
              </Dropdown.Item>
              <Dropdown.Item as={Link} to={`/${user?.role}/settings`}>
                <FaCog className="me-2" />
                Settings
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={onLogout}>
                <FaSignOutAlt className="me-2" />
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
