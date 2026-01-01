import React, { useState } from 'react';
import { Card, Button, Alert, Spinner } from 'react-bootstrap';
import { FaCamera, FaCheckCircle, FaTimesCircle, FaQrcode } from 'react-icons/fa';

const QRScanner = ({ onScan }) => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    
    // Simulate QR scanning - in real app, use a QR library
    setTimeout(() => {
      setLoading(false);
      const simulatedResult = {
        code: 'qr_' + Date.now(),
        lectureId: 'lecture_123',
        expiresAt: new Date(Date.now() + 3600000).toISOString()
      };
      
      setResult(simulatedResult);
      if (onScan) onScan(simulatedResult);
    }, 1500);
  };

  const startCameraScan = () => {
    setScanning(true);
    setError('Camera scanning is disabled in this demo. Please upload a QR code image.');
  };

  const resetScanner = () => {
    setScanning(false);
    setResult(null);
    setError(null);
    setLoading(false);
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-white">
        <h5 className="mb-0 fw-bold d-flex align-items-center">
          <FaCamera className="me-2" />
          QR Code Scanner
        </h5>
      </Card.Header>
      
      <Card.Body className="text-center">
        {loading ? (
          <div className="py-5">
            <Spinner animation="border" variant="primary" className="mb-3" />
            <p>Scanning QR code...</p>
          </div>
        ) : result ? (
          <div className="py-5">
            <FaCheckCircle size={64} className="text-success mb-3" />
            <h5>QR Code Scanned Successfully!</h5>
            <p className="text-muted mb-4">
              Code: {result.code.substring(0, 20)}...
            </p>
            <Button
              variant="primary"
              onClick={resetScanner}
            >
              Scan Another Code
            </Button>
          </div>
        ) : (
          <>
            <div className="scanner-placeholder mb-4 py-4 bg-light rounded">
              <FaQrcode size={100} className="text-muted mb-3" />
              <p className="text-muted">QR Code Scanner</p>
              <small className="text-muted">
                {scanning ? 'Camera active...' : 'Upload QR code image'}
              </small>
            </div>
            
            <div className="d-flex flex-column gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="d-none"
                id="qr-file-input"
              />
              <Button
                variant="primary"
                onClick={() => document.getElementById('qr-file-input').click()}
              >
                Upload QR Code Image
              </Button>
              
              <Button
                variant="outline-primary"
                onClick={startCameraScan}
                disabled={true}
              >
                Use Camera (Demo)
              </Button>
            </div>
          </>
        )}
        
        {error && (
          <Alert variant="danger" className="mt-3">
            <FaTimesCircle className="me-2" />
            {error}
          </Alert>
        )}
        
        <div className="mt-3 text-muted small">
          <p className="mb-1">Instructions:</p>
          <ol className="text-start ps-3">
            <li>Take a photo of the QR code</li>
            <li>Upload the image here</li>
            <li>Attendance will be marked automatically</li>
          </ol>
        </div>
      </Card.Body>
    </Card>
  );
};

export default QRScanner;
