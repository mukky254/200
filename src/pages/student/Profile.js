import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Tab,
  Nav,
  Badge
} from 'react-bootstrap';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaBook,
  FaGraduationCap,
  FaBuilding,
  FaSave,
  FaKey,
  FaHistory,
  FaChartLine
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/student';
import {
  formatPhoneNumber,
  formatDate
} from '../../utils/helpers';
import {
  COURSES,
  DEPARTMENTS,
  YEARS_OF_STUDY
} from '../../utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './Profile.css';

const StudentProfile = () => {
  const { user, updateProfile, changePassword, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    course: '',
    yearOfStudy: '',
    department: ''
  });
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Stats state
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        course: user.course || '',
        yearOfStudy: user.yearOfStudy || '',
        department: user.department || ''
      });
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await studentService.getDashboard();
      
      if (response.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const validateProfile = () => {
    const errors = [];
    
    if (!profileForm.name.trim()) {
      errors.push('Name is required');
    }
    
    if (!profileForm.phone.trim()) {
      errors.push('Phone number is required');
    }
    
    if (!profileForm.course && user?.role === 'student') {
      errors.push('Course is required');
    }
    
    if (!profileForm.yearOfStudy && user?.role === 'student') {
      errors.push('Year of study is required');
    }
    
    if (!profileForm.department && user?.role === 'student') {
      errors.push('Department is required');
    }
    
    return errors;
  };

  const validatePassword = () => {
    const errors = [];
    
    if (!passwordForm.currentPassword) {
      errors.push('Current password is required');
    }
    
    if (!passwordForm.newPassword) {
      errors.push('New password is required');
    } else if (passwordForm.newPassword.length < 6) {
      errors.push('New password must be at least 6 characters');
    }
    
    if (!passwordForm.confirmPassword) {
      errors.push('Please confirm your password');
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.push('Passwords do not match');
    }
    
    return errors;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateProfile();
    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }
    
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await updateProfile(profileForm);
      
      if (result.success) {
        setSuccess('Profile updated successfully!');
        await refreshUser();
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Profile update error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validatePassword();
    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }
    
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      
      if (result.success) {
        setSuccess('Password changed successfully!');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setError(result.error || 'Failed to change password');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Password change error:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>Profile | IN Attendance System</title>
      </Helmet>

      <div className="page-header mb-4">
        <h1 className="h2 fw-bold">My Profile</h1>
        <p className="text-muted">
          Manage your profile and account settings
        </p>
      </div>

      <Row>
        {/* Sidebar */}
        <Col lg={4} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="profile-avatar mb-3">
                <div className="avatar-initials bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto">
                  {user.name
                    .split(' ')
                    .map(word => word[0])
                    .join('')
                    .toUpperCase()
                    .substring(0, 2)}
                </div>
              </div>
              
              <h4 className="mb-1">{user.name}</h4>
              <p className="text-muted mb-2">{user.email}</p>
              
              <Badge bg="primary" className="text-capitalize mb-3">
                {user.role}
              </Badge>
              
              <div className="profile-info mt-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Admission No:</span>
                  <span className="fw-medium">{user.admissionNumber}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Phone:</span>
                  <span className="fw-medium">{formatPhoneNumber(user.phone)}</span>
                </div>
                {user.course && (
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Course:</span>
                    <span className="fw-medium">{user.course}</span>
                  </div>
                )}
                {user.yearOfStudy && (
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Year:</span>
                    <span className="fw-medium">Year {user.yearOfStudy}</span>
                  </div>
                )}
                {user.department && (
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Department:</span>
                    <span className="fw-medium">{user.department}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Member Since:</span>
                  <span className="fw-medium">
                    {formatDate(user.createdAt, 'MMM YYYY')}
                  </span>
                </div>
              </div>
              
              {stats && (
                <div className="profile-stats mt-4 pt-4 border-top">
                  <h6 className="mb-3">Attendance Stats</h6>
                  <Row>
                    <Col xs={6} className="mb-2">
                      <div className="text-center">
                        <div className="fw-bold h5 mb-1">{stats.attendancePercentage}%</div>
                        <small className="text-muted">Rate</small>
                      </div>
                    </Col>
                    <Col xs={6} className="mb-2">
                      <div className="text-center">
                        <div className="fw-bold h5 mb-1">{stats.attendedLectures}</div>
                        <small className="text-muted">Attended</small>
                      </div>
                    </Col>
                  </Row>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Main Content */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <Nav
                variant="tabs"
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="border-0"
              >
                <Nav.Item>
                  <Nav.Link eventKey="profile">
                    <FaUser className="me-2" />
                    Profile
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="password">
                    <FaKey className="me-2" />
                    Password
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            
            <Card.Body>
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert variant="success" className="mb-3">
                  {success}
                </Alert>
              )}

              <Tab.Content>
                {/* Profile Tab */}
                <Tab.Pane eventKey="profile" active={activeTab === 'profile'}>
                  <Form onSubmit={handleProfileSubmit}>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>
                            <FaUser className="me-2" />
                            Full Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={profileForm.name}
                            onChange={handleProfileChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>
                            <FaPhone className="me-2" />
                            Phone Number
                          </Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={profileForm.phone}
                            onChange={handleProfileChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      
                      {user.role === 'student' && (
                        <>
                          <Col md={6} className="mb-3">
                            <Form.Group>
                              <Form.Label>
                                <FaBook className="me-2" />
                                Course
                              </Form.Label>
                              <Form.Select
                                name="course"
                                value={profileForm.course}
                                onChange={handleProfileChange}
                                required
                              >
                                <option value="">Select course</option>
                                {COURSES.map(course => (
                                  <option key={course} value={course}>
                                    {course}
                                  </option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          
                          <Col md={6} className="mb-3">
                            <Form.Group>
                              <Form.Label>
                                <FaGraduationCap className="me-2" />
                                Year of Study
                              </Form.Label>
                              <Form.Select
                                name="yearOfStudy"
                                value={profileForm.yearOfStudy}
                                onChange={handleProfileChange}
                                required
                              >
                                <option value="">Select year</option>
                                {YEARS_OF_STUDY.map(year => (
                                  <option key={year} value={year}>
                                    Year {year}
                                  </option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          
                          <Col md={6} className="mb-3">
                            <Form.Group>
                              <Form.Label>
                                <FaBuilding className="me-2" />
                                Department
                              </Form.Label>
                              <Form.Select
                                name="department"
                                value={profileForm.department}
                                onChange={handleProfileChange}
                                required
                              >
                                <option value="">Select department</option>
                                {DEPARTMENTS.map(dept => (
                                  <option key={dept} value={dept}>
                                    {dept}
                                  </option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        </>
                      )}
                      
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>
                            <FaEnvelope className="me-2" />
                            Email Address
                          </Form.Label>
                          <Form.Control
                            type="email"
                            value={user.email}
                            readOnly
                            disabled
                          />
                          <Form.Text className="text-muted">
                            Email cannot be changed
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>
                            <FaIdCard className="me-2" />
                            Admission Number
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={user.admissionNumber}
                            readOnly
                            disabled
                          />
                          <Form.Text className="text-muted">
                            Admission number cannot be changed
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <div className="text-end mt-4">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={saving}
                      >
                        <FaSave className="me-2" />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </Form>
                </Tab.Pane>

                {/* Password Tab */}
                <Tab.Pane eventKey="password" active={activeTab === 'password'}>
                  <Form onSubmit={handlePasswordSubmit}>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Current Password</Form.Label>
                          <Form.Control
                            type="password"
                            name="currentPassword"
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>New Password</Form.Label>
                          <Form.Control
                            type="password"
                            name="newPassword"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            required
                          />
                          <Form.Text className="text-muted">
                            Password must be at least 6 characters long
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Confirm New Password</Form.Label>
                          <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <div className="text-end mt-4">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={saving}
                      >
                        <FaSave className="me-2" />
                        {saving ? 'Changing...' : 'Change Password'}
                      </Button>
                    </div>
                  </Form>
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default StudentProfile;
