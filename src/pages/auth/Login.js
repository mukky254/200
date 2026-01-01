
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { FaSignInAlt, FaEnvelope, FaLock } from 'react-icons/fa';
import { APP_NAME } from '../../utils/constants';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast.success('Login successful!');
        navigate(from, { replace: true });
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    let email, password;
    
    switch (role) {
      case 'admin':
        email = 'admin@in.com';
        password = 'Admin@123';
        break;
      case 'lecturer':
        email = 'lecturer@in.com';
        password = 'Lecturer@123';
        break;
      case 'student':
        email = 'student@in.com';
        password = 'Student@123';
        break;
      default:
        return;
    }
    
    setFormData({ email, password });
  };

  return (
    <>
      <Helmet>
        <title>Login | {APP_NAME}</title>
      </Helmet>
      
      <div className="auth-page">
        <Container>
          <Row className="justify-content-center align-items-center min-vh-100">
            <Col xs={12} sm={10} md={8} lg={6} xl={5}>
              <div className="auth-container">
                <div className="text-center mb-4">
                  <h1 className="auth-title">
                    <FaSignInAlt className="me-2" />
                    Welcome Back
                  </h1>
                  <p className="text-muted">Sign in to your account</p>
                </div>
                
                <Card className="auth-card shadow-lg">
                  <Card.Body className="p-4">
                    <Form onSubmit={handleSubmit}>
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
                      
                      <Form.Group className="mb-4">
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
                        <div className="text-end mt-2">
                          <Link to="/forgot-password" className="text-decoration-none small">
                            Forgot password?
                          </Link>
                        </div>
                      </Form.Group>
                      
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-100 mb-3"
                        disabled={loading}
                      >
                        {loading ? 'Signing in...' : 'Sign In'}
                      </Button>
                      
                      <div className="text-center mb-3">
                        <span className="text-muted">Don't have an account? </span>
                        <Link to="/register" className="text-decoration-none">
                          Sign up
                        </Link>
                      </div>
                    </Form>
                    
                    <div className="demo-logins mt-4">
                      <p className="text-center text-muted mb-3">Demo Accounts:</p>
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="flex-fill"
                          onClick={() => handleDemoLogin('admin')}
                        >
                          Admin
                        </Button>
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="flex-fill"
                          onClick={() => handleDemoLogin('lecturer')}
                        >
                          Lecturer
                        </Button>
                        <Button
                          variant="outline-info"
                          size="sm"
                          className="flex-fill"
                          onClick={() => handleDemoLogin('student')}
                        >
                          Student
                        </Button>
                      </div>
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

export default Login;
