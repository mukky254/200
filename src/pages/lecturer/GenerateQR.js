import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Modal
} from 'react-bootstrap';
import QRCode from 'qrcode.react';
import {
  FaQrcode,
  FaPrint,
  FaCopy,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaSave
} from 'react-icons/fa';
import { lecturerService } from '../../services/lecturer';
import { toast } from 'react-toastify';
import './GenerateQR.css';

const GenerateQR = () => {
  const [formData, setFormData] = useState({
    unitName: '',
    unitCode: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    venue: '',
    totalStudents: '',
    description: '',
    duration: 60
  });
  
  const [qrCodeData, setQrCodeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

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
    
    if (!formData.unitName.trim()) {
      newErrors.unitName = 'Unit name is required';
    }
    
    if (!formData.unitCode.trim()) {
      newErrors.unitCode = 'Unit code is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'Date cannot be in the past';
      }
    }
    
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }
    
    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    } else if (formData.startTime && formData.endTime <= formData.startTime) {
      newErrors.endTime = 'End time must be after start time';
    }
    
    if (!formData.venue.trim()) {
      newErrors.venue = 'Venue is required';
    }
    
    if (!formData.duration || formData.duration < 5 || formData.duration > 240) {
      newErrors.duration = 'Duration must be between 5 and 240 minutes';
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
      const response = await lecturerService.generateQRCode(formData);
      
      if (response.success) {
        setQrCodeData(response.data);
        toast.success('QR code generated successfully!');
        setShowModal(true);
      } else {
        toast.error(response.error || 'Failed to generate QR code');
      }
    } catch (error) {
      console.error('Generate QR error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('qr-print-content');
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - ${formData.unitCode}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 20px; 
              max-width: 800px;
              margin: 0 auto;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #333;
            }
            .qr-container { 
              text-align: center; 
              margin: 30px 0;
            }
            .details { 
              margin-top: 30px;
            }
            .details h4 {
              color: #333;
              margin-bottom: 15px;
            }
            .details p { 
              margin: 8px 0;
              font-size: 14px;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 15px;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>IN Attendance System</h2>
            <h3>${formData.unitName} (${formData.unitCode})</h3>
          </div>
          
          <div class="qr-container">
            <img src="${qrCodeData.qrCodeImage}" width="400" height="400" />
            <p><strong>Scan this QR code to mark attendance</strong></p>
          </div>
          
          <div class="details">
            <h4>Lecture Details</h4>
            <p><strong>Date:</strong> ${new Date(formData.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${formData.startTime} - ${formData.endTime}</p>
            <p><strong>Venue:</strong> ${formData.venue}</p>
            <p><strong>Valid for:</strong> ${formData.duration} minutes</p>
            <p><strong>Expires:</strong> ${new Date(qrCodeData.expiresAt).toLocaleString()}</p>
            ${formData.description ? `<p><strong>Description:</strong> ${formData.description}</p>` : ''}
          </div>
          
          <div class="footer">
            <p>Generated by IN Attendance System • ${new Date().toLocaleString()}</p>
            <p>Scan during lecture time only • Do not share this QR code</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(qrCodeData))
      .then(() => toast.success('QR code data copied to clipboard'))
      .catch(() => toast.error('Failed to copy to clipboard'));
  };

  return (
    <>
      <Helmet>
        <title>Generate QR Code | IN Attendance System</title>
      </Helmet>

      <div className="page-header mb-4">
        <h1 className="h2 fw-bold">Generate QR Code</h1>
        <p className="text-muted">
          Create QR codes for your lectures
        </p>
      </div>

      <Row>
        <Col lg={6} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0 fw-bold">Lecture Details</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Unit Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="unitName"
                        placeholder="e.g., Data Structures"
                        value={formData.unitName}
                        onChange={handleChange}
                        isInvalid={!!errors.unitName}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.unitName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Unit Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="unitCode"
                        placeholder="e.g., CS201"
                        value={formData.unitCode}
                        onChange={handleChange}
                        isInvalid={!!errors.unitCode}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.unitCode}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        <FaCalendarAlt className="me-2" />
                        Date
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        isInvalid={!!errors.date}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.date}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={3} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        <FaClock className="me-2" />
                        Start Time
                      </Form.Label>
                      <Form.Control
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        isInvalid={!!errors.startTime}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.startTime}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={3} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        <FaClock className="me-2" />
                        End Time
                      </Form.Label>
                      <Form.Control
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        isInvalid={!!errors.endTime}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.endTime}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        <FaMapMarkerAlt className="me-2" />
                        Venue
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="venue"
                        placeholder="e.g., Room 101"
                        value={formData.venue}
                        onChange={handleChange}
                        isInvalid={!!errors.venue}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.venue}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Expected Students</Form.Label>
                      <Form.Control
                        type="number"
                        name="totalStudents"
                        placeholder="e.g., 50"
                        value={formData.totalStudents}
                        onChange={handleChange}
                        min="1"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Description (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    placeholder="Additional lecture details..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>QR Code Validity (minutes)</Form.Label>
                  <Form.Control
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    isInvalid={!!errors.duration}
                    min="5"
                    max="240"
                    required
                  />
                  <Form.Text className="text-muted">
                    QR code will expire after this duration. Recommended: 60-120 minutes.
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.duration}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-100"
                  disabled={loading}
                >
                  <FaQrcode className="me-2" />
                  {loading ? 'Generating...' : 'Generate QR Code'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0 fw-bold">QR Code Preview</h5>
            </Card.Header>
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
              {qrCodeData ? (
                <>
                  <div id="qr-print-content" className="text-center">
                    <div className="qr-display mb-4">
                      <QRCode
                        value={JSON.stringify({
                          code: qrCodeData.uniqueCode,
                          lectureId: qrCodeData.lectureId
                        })}
                        size={256}
                        level="H"
                        includeMargin
                      />
                    </div>
                    
                    <div className="qr-details">
                      <h5 className="mb-2">{formData.unitName}</h5>
                      <p className="text-muted mb-2">{formData.unitCode}</p>
                      <p className="small text-muted mb-1">
                        Expires: {new Date(qrCodeData.expiresAt).toLocaleString()}
                      </p>
                      <p className="small text-muted">
                        Duration: {formData.duration} minutes
                      </p>
                    </div>
                  </div>
                  
                  <div className="action-buttons mt-4">
                    <Button
                      variant="success"
                      className="me-2"
                      onClick={handlePrint}
                    >
                      <FaPrint className="me-2" />
                      Print
                    </Button>
                    <Button
                      variant="outline-primary"
                      onClick={handleCopy}
                    >
                      <FaCopy className="me-2" />
                      Copy Data
                    </Button>
                  </div>
                </>
              ) : (
                <div className="no-qr text-center py-5">
                  <FaQrcode size={64} className="text-muted mb-3" />
                  <h5 className="text-muted">No QR Code Generated</h5>
                  <p className="text-muted">
                    Fill in the lecture details and generate a QR code to preview it here
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Success Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>QR Code Generated Successfully!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <FaQrcode size={64} className="text-success mb-3" />
            <h4 className="mb-3">{formData.unitName}</h4>
            <p className="text-muted mb-4">
              QR code has been generated and is now active for {formData.duration} minutes.
              Share this QR code with your students to mark attendance.
            </p>
            
            <div className="alert alert-info">
              <strong>Important:</strong> This QR code will expire at{' '}
              {new Date(qrCodeData?.expiresAt).toLocaleTimeString()} on{' '}
              {new Date(qrCodeData?.expiresAt).toLocaleDateString()}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePrint}>
            <FaPrint className="me-2" />
            Print QR Code
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default GenerateQR;
