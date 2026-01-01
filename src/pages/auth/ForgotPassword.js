import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { FaKey, FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import { APP_NAME } from '../../utils/constants';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would call your API here
      // const response = await api.post('/auth/forgot-password', { email });
      
      setSuccess(true);
      toast.success('Password reset instructions sent to your email!');
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Forgot password error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password | {APP_NAME}</title>
      </Helmet>
      
      <div className="auth-page">
        <Container>
          <Row className="justify-content-center align-items-center min-vh-100">
            <Col xs={12} sm={10} md={8} lg={6} xl={5}>
              <div className="auth-container">
                <div className="text-center mb-4">
                  <h1 className="auth-title">
                    <FaKey className="me-2" />
                    Reset Password
                  </h1>
                  <p className="text-muted">
                    {success 
                      ? 'Check your email for reset instructions'
                      : 'Enter your email to reset your password'
                    }
                  </p>
                </div>
                
                <Card className="auth-card shadow-lg">
                  <Card.Body className="p-4">
                    {success ? (
                      <div className="text-center py-4">
                        <FaCheckCircle size={64} className="text-success mb-3" />
                        <h4 className="mb-3">Check Your Email</h4>
                        <p className="text-muted mb-4">
                          We've sent password reset instructions to <strong>{email}</strong>. 
                          Please check your email and follow the link to reset your password.
                        </p>
                        <Button
                          variant="primary"
                          onClick={() => navigate('/login')}
                          className="w-100"
                        >
                          Back to Login
                        </Button>
                      </div>
                    ) : (
                      <>
                        {error && (
                          <Alert variant="danger" className="mb-3">
                            {error}
                          </Alert>
                        )}
                        
                        <Form onSubmit={handleSubmit}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <div className="input-group">
                              <span className="input-group-text">
                                <FaEnvelope />
                              </span>
                              <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                              />
                            </div>
                            <Form.Text className="text-muted">
                              Enter the email associated with your account
                            </Form.Text>
                          </Form.Group>
                          
                          <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-100 mb-3"
                            disabled={loading}
                          >
                            {loading ? 'Sending...' : 'Send Reset Instructions'}
                          </Button>
                          
                          <div className="text-center">
                            <Link to="/login" className="text-decoration-none">
                              Back to Login
                            </Link>
                          </div>
                        </Form>
                      </>
                    )}
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

export default ForgotPassword;
