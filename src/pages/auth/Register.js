import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { 
  FaUserPlus, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaIdCard,
  FaLock,
  FaBook,
  FaGraduationCap,
  FaBuilding
} from 'react-icons/fa';
import { APP_NAME, COURSES, DEPARTMENTS, YEARS_OF_STUDY } from '../../utils/constants';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    admissionNumber: '',
    role: 'student',
    course: '',
    yearOfStudy: '',
    department: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    if (stepNumber === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      }
      
      if (!formData.admissionNumber.trim()) {
        newErrors.admissionNumber = 'Admission number is required';
      }
    }
    
    if (stepNumber === 2) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    if (stepNumber === 3 && formData.role === 'student') {
      if (!formData.course) {
        newErrors.course = 'Course is required';
      }
      
      if (!formData.yearOfStudy) {
        newErrors.yearOfStudy = 'Year of study is required';
      }
      
      if (!formData.department) {
        newErrors.department = 'Department is required';
      }
    }
    
    return newErrors;
  };

  const handleNext = () => {
    const stepErrors = validateStep(step);
    
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    
    setStep(step + 1);
    setErrors({});
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const stepErrors = validateStep(step);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      // Remove confirmPassword from submission
      const { confirmPassword, ...submitData } = formData;
      
      const result = await register(submitData);
      
      if (result.success) {
        toast.success('Registration successful!');
        navigate(`/${formData.role}`);
      } else {
        toast.error(result.error || 'Registration failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <div className="input-group">
                <span className="input-group-text">
                  <FaUser />
                </span>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  isInvalid={!!errors.name}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </div>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <div className="input-group">
                <span className="input-group-text">
                  <FaEnvelope />
                </span>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </div>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <div className="input-group">
                <span className="input-group-text">
                  <FaPhone />
                </span>
                <Form.Control
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  isInvalid={!!errors.phone}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phone}
                </Form.Control.Feedback>
              </div>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Admission Number</Form.Label>
              <div className="input-group">
                <span className="input-group-text">
                  <FaIdCard />
                </span>
                <Form.Control
                  type="text"
                  name="admissionNumber"
                  placeholder="Enter your admission number"
                  value={formData.admissionNumber}
                  onChange={handleChange}
                  isInvalid={!!errors.admissionNumber}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.admissionNumber}
                </Form.Control.Feedback>
              </div>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <div className="input-group">
                <span className="input-group-text">
                  <FaUser />
                </span>
                <Form.Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="student">Student</option>
                  <option value="lecturer">Lecturer</option>
                </Form.Select>
              </div>
            </Form.Group>
          </>
        );
        
      case 2:
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <div className="input-group">
                <span className="input-group-text">
                  <FaLock />
                </span>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </div>
              <Form.Text className="text-muted">
                Password must be at least 6 characters long
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <div className="input-group">
                <span className="input-group-text">
                  <FaLock />
                </span>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  isInvalid={!!errors.confirmPassword}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </div>
            </Form.Group>
          </>
        );
        
      case 3:
        if (formData.role === 'student') {
          return (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Course</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaBook />
                  </span>
                  <Form.Select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    isInvalid={!!errors.course}
                  >
                    <option value="">Select course</option>
                    {COURSES.map(course => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.course}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Year of Study</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaGraduationCap />
                  </span>
                  <Form.Select
                    name="yearOfStudy"
                    value={formData.yearOfStudy}
                    onChange={handleChange}
                    isInvalid={!!errors.yearOfStudy}
                  >
                    <option value="">Select year</option>
                    {YEARS_OF_STUDY.map(year => (
                      <option key={year} value={year}>
                        Year {year}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.yearOfStudy}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Department</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaBuilding />
                  </span>
                  <Form.Select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    isInvalid={!!errors.department}
                  >
                    <option value="">Select department</option>
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.department}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>
            </>
          );
        }
        return null;
        
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Register | {APP_NAME}</title>
      </Helmet>
      
      <div className="auth-page">
        <Container>
          <Row className="justify-content-center align-items-center min-vh-100">
            <Col xs={12} sm={10} md={8} lg={6} xl={5}>
              <div className="auth-container">
                <div className="text-center mb-4">
                  <h1 className="auth-title">
                    <FaUserPlus className="me-2" />
                    Create Account
                  </h1>
                  <p className="text-muted">Step {step} of 3</p>
                  
                  {/* Progress bar */}
                  <div className="progress mb-4" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar" 
                      style={{ width: `${(step / 3) * 100}%` }}
                    />
                  </div>
                </div>
                
                <Card className="auth-card shadow-lg">
                  <Card.Body className="p-4">
                    <Form onSubmit={handleSubmit}>
                      {renderStep()}
                      
                      <div className="d-flex justify-content-between mt-4">
                        {step > 1 ? (
                          <Button
                            variant="outline-secondary"
                            onClick={handleBack}
                            disabled={loading}
                          >
                            Back
                          </Button>
                        ) : (
                          <div />
                        )}
                        
                        {step < 3 ? (
                          <Button
                            variant="primary"
                            onClick={handleNext}
                            disabled={loading}
                          >
                            Next
                          </Button>
                        ) : (
                          <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                          >
                            {loading ? 'Creating Account...' : 'Create Account'}
                          </Button>
                        )}
                      </div>
                    </Form>
                    
                    <div className="text-center mt-4">
                      <span className="text-muted">Already have an account? </span>
                      <Link to="/login" className="text-decoration-none">
                        Sign in
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
                
                <div className="text-center mt-4">
                  <p className="text-muted small">
                    © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Register;
