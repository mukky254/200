import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaHome, FaSearch, FaExclamationTriangle } from 'react-icons/fa';
import './ErrorPages.css';

const NotFound = () => {
  return (
    <Container className="error-page">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col md={8} lg={6} xl={5}>
          <Card className="border-0 shadow-lg">
            <Card.Body className="p-5 text-center">
              <div className="error-icon mb-4">
                <FaExclamationTriangle size={80} className="text-warning" />
              </div>
              
              <h1 className="display-4 fw-bold mb-3">404</h1>
              <h2 className="h3 mb-4">Page Not Found</h2>
              
              <p className="text-muted mb-4">
                The page you are looking for might have been removed, 
                had its name changed, or is temporarily unavailable.
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
                  variant="outline-primary"
                  size="lg"
                  className="px-4"
                  onClick={() => window.history.back()}
                >
                  <FaSearch className="me-2" />
                  Go Back
                </Button>
              </div>
              
              <div className="mt-5">
                <p className="text-muted small mb-0">
                  If you believe this is an error, please contact the system administrator.
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
