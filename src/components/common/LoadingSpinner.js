import React from 'react';
import { Spinner } from 'react-bootstrap';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Loading...', size = 'lg' }) => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner-content">
        <Spinner 
          animation="border" 
          variant="primary" 
          size={size}
          className="mb-3"
        />
        {message && <p className="text-muted mb-0">{message}</p>}
      </div>
    </div>
  );
};

export const InlineSpinner = ({ size = 'sm' }) => {
  return (
    <Spinner 
      animation="border" 
      variant="primary" 
      size={size}
      className="me-2"
    />
  );
};

export default LoadingSpinner;
