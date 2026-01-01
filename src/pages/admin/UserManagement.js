import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Card,
  Table,
  Badge,
  Button,
  Form,
  Row,
  Col,
  Pagination,
  Dropdown,
  Modal,
  Alert
} from 'react-bootstrap';
import {
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaDownload,
  FaPrint,
  FaEye,
  FaUserPlus
} from 'react-icons/fa';
import { authService } from '../../services/auth';
import { toast } from 'react-toastify';
import {
  formatDate,
  formatPhoneNumber
} from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    role: '',
    search: '',
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [userForStatus, setUserForStatus] = useState(null);
  const [newStatus, setNewStatus] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await authService.getAllUsers(filters);
      
      if (response.success) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleStatusChangeClick = (user, isActive) => {
    setUserForStatus(user);
    setNewStatus(isActive);
    setShowStatusModal(true);
  };

  const handleStatusChangeConfirm = async () => {
    if (!userForStatus) return;
    
    try {
      const response = await authService.updateUserStatus(userForStatus._id, newStatus);
      
      if (response.success) {
        toast.success(`User ${newStatus ? 'activated' : 'deactivated'} successfully`);
        fetchUsers();
      } else {
        toast.error(response.error || 'Failed to update user status');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error('Status change error:', error);
    } finally {
      setShowStatusModal(false);
      setUserForStatus(null);
      setNewStatus(null);
    }
  };

  const handleExport = (format) => {
    // Implement export functionality
    console.log(`Exporting as ${format}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const getRoleCount = (role) => {
    if (!users.length) return 0;
    return users.filter(user => user.role === role).length;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>User Management | IN Attendance System</title>
      </Helmet>

      <div className="page-header mb-4">
        <h1 className="h2 fw-bold">User Management</h1>
        <p className="text-muted">
          Manage system users and their permissions
        </p>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <h3 className="mb-1">{pagination.total}</h3>
              <p className="text-muted mb-0">Total Users</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <h3 className="mb-1">{getRoleCount('student')}</h3>
              <p className="text-muted mb-0">Students</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <h3 className="mb-1">{getRoleCount('lecturer')}</h3>
              <p className="text-muted mb-0">Lecturers</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <h3 className="mb-1">{getRoleCount('admin')}</h3>
              <p className="text-muted mb-0">Admins</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Role</Form.Label>
                <Form.Select
                  value={filters.role}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="lecturer">Lecturer</option>
                  <option value="student">Student</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search by name, email, or admission number"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </Form.Group>
            </Col>
            
            <Col md={4} className="d-flex align-items-end">
              <div className="d-flex gap-2 w-100">
                <Button
                  variant="outline-secondary"
                  onClick={() => setFilters({
                    role: '',
                    search: '',
                    page: 1,
                    limit: 10,
                    sortBy: 'createdAt',
                    sortOrder: 'desc'
                  })}
                  className="flex-fill"
                >
                  <FaFilter className="me-2" />
                  Reset Filters
                </Button>
                
                <Dropdown>
                  <Dropdown.Toggle variant="outline-primary">
                    <FaDownload className="me-2" />
                    Export
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleExport('csv')}>
                      Export as CSV
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleExport('pdf')}>
                      Export as PDF
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handlePrint}>
                      <FaPrint className="me-2" />
                      Print
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Users Table */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Users</h5>
          <Button variant="primary" size="sm">
            <FaUserPlus className="me-2" />
            Add User
          </Button>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Contact</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Member Since</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={index}>
                      <td>
                        <div>
                          <strong>{user.name}</strong>
                          <div className="small text-muted">{user.email}</div>
                          {user.admissionNumber && (
                            <div className="small text-muted">
                              {user.admissionNumber}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>{formatPhoneNumber(user.phone)}</div>
                          {user.course && (
                            <div className="small text-muted">{user.course}</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <Badge bg="primary" className="text-capitalize">
                          {user.role}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Badge bg={user.isActive ? 'success' : 'danger'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          {user.isVerified && (
                            <Badge bg="info" className="ms-2">
                              Verified
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td>
                        {formatDate(user.createdAt, 'MMM D, YYYY')}
                        <div className="small text-muted">
                          Last login: {user.lastLogin ? formatDate(user.lastLogin, 'MMM D') : 'Never'}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-primary"
                            size="sm"
                          >
                            <FaEye size={12} />
                          </Button>
                          <Button
                            variant="outline-warning"
                            size="sm"
                          >
                            <FaEdit size={12} />
                          </Button>
                          <Button
                            variant={user.isActive ? 'outline-danger' : 'outline-success'}
                            size="sm"
                            onClick={() => handleStatusChangeClick(user, !user.isActive)}
                          >
                            {user.isActive ? (
                              <FaTimesCircle size={12} />
                            ) : (
                              <FaCheckCircle size={12} />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <div className="text-muted">
                        <FaSearch size={48} className="mb-3" />
                        <h5>No users found</h5>
                        <p>Try adjusting your search filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
        
        {/* Pagination */}
        {pagination.pages > 1 && (
          <Card.Footer className="bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-muted">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} users
              </div>
              
              <Pagination className="mb-0">
                <Pagination.Prev
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                />
                
                {[...Array(pagination.pages)].map((_, i) => {
                  const pageNum = i + 1;
                  if (
                    pageNum === 1 ||
                    pageNum === pagination.pages ||
                    (pageNum >= pagination.page - 2 && pageNum <= pagination.page + 2)
                  ) {
                    return (
                      <Pagination.Item
                        key={pageNum}
                        active={pageNum === pagination.page}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Pagination.Item>
                    );
                  } else if (
                    pageNum === pagination.page - 3 ||
                    pageNum === pagination.page + 3
                  ) {
                    return <Pagination.Ellipsis key={pageNum} />;
                  }
                  return null;
                })}
                
                <Pagination.Next
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                />
              </Pagination>
            </div>
          </Card.Footer>
        )}
      </Card>

      {/* Status Change Modal */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {newStatus ? 'Activate User' : 'Deactivate User'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to {newStatus ? 'activate' : 'deactivate'} this user?
          </p>
          {userForStatus && (
            <div className="alert alert-warning">
              <strong>{userForStatus.name}</strong><br />
              Email: {userForStatus.email}<br />
              Role: {userForStatus.role}
            </div>
          )}
          <Alert variant="info">
            <strong>Note:</strong><br />
            {newStatus 
              ? 'Activated users can login and use the system normally.'
              : 'Deactivated users cannot login to the system until reactivated.'
            }
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            Cancel
          </Button>
          <Button 
            variant={newStatus ? 'success' : 'danger'} 
            onClick={handleStatusChangeConfirm}
          >
            {newStatus ? 'Activate User' : 'Deactivate User'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserManagement;
