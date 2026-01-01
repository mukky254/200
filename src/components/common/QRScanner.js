import React, { useState, useRef, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Button, Card, Alert, Spinner } from 'react-bootstrap';
import { FaCamera, FaCheckCircle, FaTimesCircle, FaQrcode } from 'react-icons/fa';
import './QRScanner.css';

const QRScanner = ({ onScan, onError, scanning = true }) => {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef(null);
  const html5QrcodeScannerRef = useRef(null);

  useEffect(() => {
    if (scanning && !html5QrcodeScannerRef.current) {
      startScanner();
    }

    return () => {
      if (html5QrcodeScannerRef.current) {
        html5QrcodeScannerRef.current.clear();
        html5QrcodeScannerRef.current = null;
      }
    };
  }, [scanning]);

  const startScanner = () => {
    try {
      if (!scannerRef.current) return;

      const scanner = new Html5QrcodeScanner(
        scannerRef.current.id,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true,
          supportedScanTypes: []
        },
        false
      );

      scanner.render(
        (decodedText, decodedResult) => {
          handleSuccess(decodedText, decodedResult);
        },
        (errorMessage) => {
          // Handle scan error
          if (errorMessage !== "NotFoundException: No MultiFormat Readers were able to detect the code.") {
            console.error('Scan error:', errorMessage);
          }
        }
      );

      html5QrcodeScannerRef.current = scanner;
    } catch (err) {
      console.error('Scanner initialization error:', err);
      setError('Failed to initialize scanner. Please check camera permissions.');
    }
  };

  const handleSuccess = (decodedText, decodedResult) => {
    if (html5QrcodeScannerRef.current) {
      html5QrcodeScannerRef.current.clear();
      html5QrcodeScannerRef.current = null;
    }

    setScanResult(decodedText);
    setLoading(true);

    try {
      const qrData = JSON.parse(decodedText);
      
      if (onScan) {
        onScan(qrData);
      }
    } catch (error) {
      console.error('QR parsing error:', error);
      setError('Invalid QR code format');
      if (onError) {
        onError('Invalid QR code format');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setError(null);
    setLoading(false);
    
    if (html5QrcodeScannerRef.current) {
      html5QrcodeScannerRef.current.clear();
      html5QrcodeScannerRef.current = null;
    }
    
    setTimeout(() => {
      startScanner();
    }, 500);
  };

  return (
    <div className="qr-scanner-component">
      {error && (
        <Alert variant="danger" className="mb-3">
          <FaTimesCircle className="me-2" />
          {error}
        </Alert>
      )}

      <Card className="scanner-card border-0 shadow-sm">
        <Card.Header className="bg-white">
          <h5 className="mb-0 fw-bold d-flex align-items-center">
            <FaCamera className="me-2" />
            QR Code Scanner
          </h5>
        </Card.Header>
        
        <Card.Body className="text-center">
          {loading ? (
            <div className="scanner-loading py-5">
              <Spinner animation="border" variant="primary" className="mb-3" />
              <p>Processing QR code...</p>
            </div>
          ) : scanResult ? (
            <div className="scan-success py-5">
              <FaCheckCircle size={64} className="text-success mb-3" />
              <h5>QR Code Scanned Successfully!</h5>
              <p className="text-muted mb-4">
                Code detected: {scanResult.substring(0, 50)}...
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
              <div className="scanner-wrapper mb-3">
                <div 
                  id="qr-reader" 
                  ref={scannerRef}
                  style={{ width: '100%', minHeight: '300px' }}
                />
              </div>
              
              <div className="scanner-instructions">
                <p className="text-muted mb-2">
                  <FaQrcode className="me-2" />
                  Point camera at QR code
                </p>
                <small className="text-muted">
                  Ensure good lighting and hold steady
                </small>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default QRScanner;
