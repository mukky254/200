import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaHome, FaLock, FaExclamationCircle } from 'react-icons/fa';
import './ErrorPages.css';

const Unauthorized = () => {
  return (
    <Container className="error-page">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col md={8} lg={6} xl={5}>
          <Card className="border-0 shadow-lg">
            <Card.Body className="p-5 text-center">
              <div className="error-icon mb-4">
                <FaLock size={80} className="text-danger" />
              </div>
              
              <h1 className="display-4 fw-bold mb-3">403</h1>
              <h2 className="h3 mb-4">Access Denied</h2>
              
              <p className="text-muted mb-4">
                You don't have permission to access this page. 
                Please contact the administrator if you believe this is an error.
              </p>
              
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mt-4">
                <Button
                  as={Link}
                  to="/"
                  variant="primary"
                  size="lg"
                  className="px-4"
                >
                  <FaHome className="me-2" />
                  Go Home
                </Button>
                
                <Button
                  as={Link}
                  to="/login"
                  variant="outline-primary"
                  size="lg"
                  className="px-4"
                >
                  <FaLock className="me-2" />
                  Login with Different Account
                </Button>
              </div>
              
              <div className="mt-5">
                <p className="text-muted small mb-0">
                  Please ensure you have the correct permissions to access this resource.
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Unauthorized;
