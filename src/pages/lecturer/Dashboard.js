import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  ProgressBar
} from 'react-bootstrap';
import {
  FaQrcode,
  FaUsers,
  FaChartLine,
  FaCalendarAlt,
  FaClipboardList,
  FaArrowRight,
  FaPrint,
  FaEye
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { lecturerService } from '../../services/lecturer';
import { formatDate, formatTime } from '../../utils/helpers';
import { LECTURE_STATUS_COLORS, LECTURE_STATUS_LABELS } from '../../utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const LecturerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await lecturerService.getDashboard();
      
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintQR = (qrCodeId) => {
    // Implement QR code printing
    console.log('Print QR code:', qrCodeId);
  };

  if (loading || !dashboardData) {
    return <LoadingSpinner />;
  }

  const { 
    todayLectures,
    activeLectures,
    recentLectures,
    qrStats,
    attendanceStats,
    unitStats 
  } = dashboardData;

  // Attendance trend chart
  const attendanceChartData = {
    labels: unitStats.map(unit => unit.unitCode),
    datasets: [
      {
        label: 'Attendance Rate',
        data: unitStats.map(unit => unit.attendanceRate),
        backgroundColor: 'rgba(67, 97, 238, 0.2)',
        borderColor: '#4361ee',
        borderWidth: 2,
        tension: 0.4
      }
    ]
  };

  const attendanceChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Lecturer Dashboard | IN Attendance System</title>
      </Helmet>

      <div className="page-header mb-4">
        <h1 className="h2 fw-bold">Lecturer Dashboard</h1>
        <p className="text-muted">
          Manage lectures, generate QR codes, and track attendance
        </p>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
          <Card className="stats-card border-0 shadow-sm h-100">
            <Card.Body>
              <div className="stats-card-icon primary">
                <FaQrcode />
              </div>
              <h3 className="mb-1">{qrStats.activeQRCodes}</h3>
              <p className="text-muted mb-0">Active QR Codes</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
          <Card className="stats-card border-0 shadow-sm h-100">
            <Card.Body>
              <div className="stats-card-icon success">
                <FaUsers />
              </div>
              <h3 className="mb-1">{attendanceStats.totalAttendance}</h3>
              <p className="text-muted mb-0">Total Attendance</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
          <Card className="stats-card border-0 shadow-sm h-100">
            <Card.Body>
              <div className="stats-card-icon warning">
                <FaChartLine />
              </div>
              <h3 className="mb-1">{(attendanceStats.avgAttendanceRate * 100).toFixed(1)}%</h3>
              <p className="text-muted mb-0">Avg. Attendance Rate</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
          <Card className="stats-card border-0 shadow-sm h-100">
            <Card.Body>
              <div className="stats-card-icon danger">
                <FaClipboardList />
              </div>
              <h3 className="mb-1">{recentLectures.length}</h3>
              <p className="text-muted mb-0">Recent Lectures</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        {/* Active QR Codes */}
        <Col lg={6} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">Active QR Codes</h5>
              <Button 
                as={Link} 
                to="/lecturer/generate-qr"
                variant="primary" 
                size="sm"
              >
                <FaQrcode className="me-2" />
                Generate New
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Unit</th>
                      <th>Expires</th>
                      <th>Scans</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeLectures.map((lecture, index) => (
                      <tr key={index}>
                        <td>
                          <div>
                            <strong>{lecture.unitName}</strong>
                            <div className="small text-muted">{lecture.unitCode}</div>
                          </div>
                        </td>
                        <td>
                          {formatTime(lecture.qrCodeId?.expiresAt, 'hh:mm A')}
                        </td>
                        <td>
                          <div className="text-center">
                            <div className="fw-bold">{lecture.qrCodeId?.scanCount || 0}</div>
                            <small className="text-muted">scans</small>
                          </div>
                        </td>
                        <td>
                          <Badge 
                            bg={lecture.qrCodeId?.isActive ? 'success' : 'secondary'}
                          >
                            {lecture.qrCodeId?.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              as={Link}
                              to={`/lecturer/lecture/${lecture._id}`}
                              variant="outline-primary"
                              size="sm"
                            >
                              <FaEye size={12} />
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => handlePrintQR(lecture.qrCodeId?._id)}
                            >
                              <FaPrint size={12} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Today's Lectures */}
        <Col lg={6} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">Today's Lectures</h5>
              <FaCalendarAlt />
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Unit</th>
                      <th>Time</th>
                      <th>Venue</th>
                      <th>Status</th>
                      <th>Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayLectures.map((lecture, index) => (
                      <tr key={index}>
                        <td>
                          <div>
                            <strong>{lecture.unitName}</strong>
                            <div className="small text-muted">{lecture.unitCode}</div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div>{lecture.startTime} - {lecture.endTime}</div>
                            <small className="text-muted">
                              {formatDate(lecture.date, 'MMM D')}
                            </small>
                          </div>
                        </td>
                        <td>{lecture.venue}</td>
                        <td>
                          <Badge 
                            bg={LECTURE_STATUS_COLORS[lecture.status]}
                            className="text-capitalize"
                          >
                            {LECTURE_STATUS_LABELS[lecture.status]}
                          </Badge>
                        </td>
                        <td>
                          <div className="text-center">
                            <div className="fw-bold">{lecture.attendanceCount}</div>
                            <small className="text-muted">students</small>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Unit Performance */}
        <Col lg={8} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0 fw-bold">Unit Performance</h5>
            </Card.Header>
            <Card.Body>
              <Bar 
                data={attendanceChartData} 
                options={attendanceChartOptions}
                height={100}
              />
            </Card.Body>
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col lg={4} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0 fw-bold">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button
                  as={Link}
                  to="/lecturer/generate-qr"
                  variant="primary"
                  size="lg"
                  className="mb-2"
                >
                  <FaQrcode className="me-2" />
                  Generate QR Code
                </Button>
                
                <Button
                  as={Link}
                  to="/lecturer/history"
                  variant="outline-primary"
                  size="lg"
                  className="mb-2"
                >
                  <FaClipboardList className="me-2" />
                  View History
                </Button>
                
                <div className="mt-4">
                  <h6 className="mb-3">Attendance Summary</h6>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Present:</span>
                    <span className="fw-bold">{attendanceStats.presentCount}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Late:</span>
                    <span className="fw-bold">{attendanceStats.lateCount}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Total:</span>
                    <span className="fw-bold">{attendanceStats.totalAttendance}</span>
                  </div>
                  <ProgressBar 
                    now={(attendanceStats.avgAttendanceRate * 100)} 
                    variant="primary"
                    className="mt-2"
                  />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default LecturerDashboard;
