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
import QRScanner from '../../components/common/QRScanner';
import { studentService } from '../../services/student';
import { formatDateTime } from '../../utils/helpers';
import { ATTENDANCE_STATUS_COLORS } from '../../utils/constants';
import './QRScanner.css';

const QRScannerPage = () => {
  const [scanning, setScanning] = useState(true);
  const [attendanceData, setAttendanceData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleScan = async (qrData) => {
    setScanning(false);
    setLoading(true);
    setError('');
    
    try {
      const response = await studentService.scanQRCode(
        qrData.code,
        qrData.lectureId
      );
      
      if (response.success) {
        setAttendanceData(response.data);
        setSuccess(true);
        setShowModal(true);
        
        // Reset scanner after 3 seconds
        setTimeout(() => {
          setScanning(true);
          setSuccess(false);
        }, 3000);
      } else {
        setError(response.error || 'Failed to mark attendance');
        setSuccess(false);
        
        // Reset scanner after 2 seconds
        setTimeout(() => {
          setScanning(true);
        }, 2000);
      }
    } catch (error) {
      console.error('Scan error:', error);
      setError('Invalid QR code. Please try again.');
      setSuccess(false);
      
      // Reset scanner after 2 seconds
      setTimeout(() => {
        setScanning(true);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error) => {
    console.error('Scanner error:', error);
    setError('Scanner error: ' + error);
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
          <QRScanner
            onScan={handleScan}
            onError={handleError}
            scanning={scanning}
          />
          
          {error && (
            <Alert variant="danger" className="mt-3">
              <FaTimesCircle className="me-2" />
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success" className="mt-3">
              <FaCheckCircle className="me-2" />
              Attendance marked successfully!
            </Alert>
          )}
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

export default QRScannerPage;
