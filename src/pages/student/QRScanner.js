import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Card, 
  Button, 
  Alert, 
  Row, 
  Col,
  Badge,
  Modal,
  Spinner
} from 'react-bootstrap';
import { 
  FaQrcode, 
  FaCamera, 
  FaCheckCircle, 
  FaTimesCircle,
  FaPrint,
  FaClock,
  FaCalendarAlt,
  FaUserTie,
  FaMapMarkerAlt
} from 'react-icons/fa';
import QrScanner from 'react-qr-scanner';
import { studentService } from '../../services/student';
import { formatDateTime } from '../../utils/helpers';
import { ATTENDANCE_STATUS_COLORS } from '../../utils/constants';
import './QRScanner.css';

const QRScanner = () => {
  const [scanning, setScanning] = useState(true);
  const [scanResult, setScanResult] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleScan = async (result) => {
    if (result && scanning) {
      setScanning(false);
      setLoading(true);
      setError('');
      
      try {
        const qrData = JSON.parse(result.text);
        
        const response = await studentService.scanQRCode(
          qrData.code,
          qrData.lectureId
        );
        
        if (response.success) {
          setAttendanceData(response.data);
          setSuccess(true);
          setScanResult(result);
          setShowModal(true);
          
          // Reset scanner after 3 seconds
          setTimeout(() => {
            setScanning(true);
            setScanResult(null);
            setSuccess(false);
          }, 3000);
        } else {
          setError(response.error || 'Failed to mark attendance');
          setSuccess(false);
          
          // Reset scanner after 2 seconds
          setTimeout(() => {
            setScanning(true);
            setScanResult(null);
          }, 2000);
        }
      } catch (error) {
        console.error('Scan error:', error);
        setError('Invalid QR code. Please try again.');
        setSuccess(false);
        
        // Reset scanner after 2 seconds
        setTimeout(() => {
          setScanning(true);
          setScanResult(null);
        }, 2000);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleError = (err) => {
    console.error('Scanner error:', err);
    setError('Camera error. Please check permissions and try again.');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>Scan QR Code | IN Attendance System</title>
      </Helmet>

      <div className="page-header mb-4">
        <h1 className="h2 fw-bold">Scan QR Code</h1>
        <p className="text-muted">
          Scan the QR code provided by your lecturer to mark attendance
        </p>
      </div>

      <Row>
        <Col lg={6} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0 fw-bold d-flex align-items-center">
                <FaCamera className="me-2" />
                QR Code Scanner
              </h5>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert variant="danger" className="mb-3">
                  <FaTimesCircle className="me-2" />
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert variant="success" className="mb-3">
                  <FaCheckCircle className="me-2" />
                  Attendance marked successfully!
                </Alert>
              )}

              <div className="scanner-wrapper">
                {scanning ? (
                  <>
                    <QrScanner
                      delay={300}
                      onError={handleError}
                      onScan={handleScan}
                      constraints={{
                        audio: false,
                        video: {
                          facingMode: 'environment',
                          width: { ideal: 1280 },
                          height: { ideal: 720 }
                        }
                      }}
                      style={{
                        width: '100%',
                        height: '300px',
                        borderRadius: '10px',
                        overflow: 'hidden'
                      }}
                    />
                    <div className="scanner-overlay">
                      <div className="scan-line" />
                      <div className="text-center mt-5">
                        <FaQrcode size={48} className="text-white mb-3" />
                        <p className="text-white mb-0">
                          Point camera at QR code
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="processing text-center py-5">
                    {loading ? (
                      <>
                        <Spinner animation="border" variant="primary" className="mb-3" />
                        <p className="mb-0">Processing attendance...</p>
                      </>
                    ) : (
                      <div className="text-center">
                        <FaCheckCircle 
                          size={48} 
                          className={`mb-3 ${success ? 'text-success' : 'text-danger'}`}
                        />
                        <p className="mb-0">
                          {success ? 'Attendance marked!' : 'Scan failed. Try again.'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-4">
                <h6 className="mb-3">Instructions:</h6>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <Badge bg="primary" className="me-2">1</Badge>
                    Point camera at the QR code
                  </li>
                  <li className="mb-2">
                    <Badge bg="primary" className="me-2">2</Badge>
                    Ensure good lighting
                  </li>
                  <li className="mb-2">
                    <Badge bg="primary" className="me-2">3</Badge>
                    Hold steady for 2-3 seconds
                  </li>
                  <li>
                    <Badge bg="primary" className="me-2">4</Badge>
                    Only scan during lecture time
                  </li>
                </ul>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0 fw-bold">Attendance Information</h5>
            </Card.Header>
            <Card.Body>
              {attendanceData ? (
                <div className="attendance-info">
                  <div className="info-card p-4 rounded-lg bg-light mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4 className="mb-0">{attendanceData.unitName}</h4>
                      <Badge 
                        bg={ATTENDANCE_STATUS_COLORS[attendanceData.status]}
                        className="text-capitalize"
                      >
                        {attendanceData.status}
                      </Badge>
                    </div>
                    
                    <div className="row mb-3">
                      <div className="col-6">
                        <div className="info-item mb-2">
                          <small className="text-muted">Unit Code</small>
                          <div className="fw-medium">{attendanceData.unitCode}</div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="info-item mb-2">
                          <small className="text-muted">Lecturer</small>
                          <div className="fw-medium">{attendanceData.lecturerName}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="row mb-3">
                      <div className="col-6">
                        <div className="info-item mb-2">
                          <FaCalendarAlt className="me-2 text-muted" />
                          <small className="text-muted">Date</small>
                          <div className="fw-medium">
                            {formatDateTime(attendanceData.scanTime, 'MMM D, YYYY')}
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="info-item mb-2">
                          <FaClock className="me-2 text-muted" />
                          <small className="text-muted">Time</small>
                          <div className="fw-medium">
                            {formatDateTime(attendanceData.scanTime, 'hh:mm A')}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="info-item mb-2">
                      <FaMapMarkerAlt className="me-2 text-muted" />
                      <small className="text-muted">Venue</small>
                      <div className="fw-medium">{attendanceData.venue}</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Button 
                      variant="outline-primary"
                      onClick={handlePrint}
                      className="me-2"
                    >
                      <FaPrint className="me-2" />
                      Print Receipt
                    </Button>
                    <Button 
                      variant="primary"
                      onClick={() => setShowModal(true)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="no-data text-center py-5">
                  <FaQrcode size={64} className="text-muted mb-3" />
                  <h5 className="text-muted">No Attendance Data</h5>
                  <p className="text-muted">
                    Scan a QR code to mark attendance and view details here
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Attendance Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Attendance Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {attendanceData && (
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="card border-0 bg-light">
                  <div className="card-body">
                    <h6 className="text-muted mb-3">Lecture Information</h6>
                    <div className="mb-2">
                      <small className="text-muted">Unit</small>
                      <div className="fw-bold">{attendanceData.unitName}</div>
                      <div className="text-muted small">{attendanceData.unitCode}</div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Lecturer</small>
                      <div className="fw-bold">{attendanceData.lecturerName}</div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Venue</small>
                      <div className="fw-bold">{attendanceData.venue}</div>
                    </div>
                    <div>
                      <small className="text-muted">Schedule</small>
                      <div className="fw-bold">
                        {attendanceData.startTime} - {attendanceData.endTime}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="card border-0 bg-light">
                  <div className="card-body">
                    <h6 className="text-muted mb-3">Attendance Details</h6>
                    <div className="mb-2">
                      <small className="text-muted">Scan Time</small>
                      <div className="fw-bold">
                        {formatDateTime(attendanceData.scanTime, 'MMM D, YYYY hh:mm A')}
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Status</small>
                      <div>
                        <Badge 
                          bg={ATTENDANCE_STATUS_COLORS[attendanceData.status]}
                          className="text-capitalize"
                        >
                          {attendanceData.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Date</small>
                      <div className="fw-bold">
                        {formatDateTime(attendanceData.date, 'MMM D, YYYY')}
                      </div>
                    </div>
                    <div>
                      <small className="text-muted">Attendance ID</small>
                      <div className="fw-bold small">{attendanceData.attendanceId}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePrint}>
            <FaPrint className="me-2" />
            Print Receipt
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default QRScanner;
