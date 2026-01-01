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
  FaCalendarCheck, 
  FaChartLine, 
  FaClock,
  FaBook,
  FaCalendarAlt,
  FaArrowRight
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { studentService } from '../../services/student';
import { formatDate, formatTime, calculatePercentage } from '../../utils/helpers';
import { ATTENDANCE_STATUS_COLORS, ATTENDANCE_STATUS_LABELS } from '../../utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './Student.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await studentService.getDashboard();
      
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !dashboardData) {
    return <LoadingSpinner />;
  }

  const { stats, recentAttendance, upcomingLectures } = dashboardData;

  // Chart data for attendance trend
  const lineChartData = {
    labels: stats.monthlyTrend.map(item => 
      `${item._id.month}/${item._id.year}`
    ),
    datasets: [
      {
        label: 'Attendance',
        data: stats.monthlyTrend.map(item => item.count),
        borderColor: '#4361ee',
        backgroundColor: 'rgba(67, 97, 238, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  // Doughnut chart data for attendance status
  const doughnutChartData = {
    labels: stats.attendanceStats.map(item => 
      ATTENDANCE_STATUS_LABELS[item._id] || item._id
    ),
    datasets: [
      {
        data: stats.attendanceStats.map(item => item.count),
        backgroundColor: [
          '#4cc9f0',
          '#ff9e00',
          '#f72585',
          '#4895ef'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Student Dashboard | IN Attendance System</title>
      </Helmet>

      <div className="page-header mb-4">
        <h1 className="h2 fw-bold">Student Dashboard</h1>
        <p className="text-muted">
          Welcome back! Here's your attendance overview.
        </p>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
          <Card className="stats-card border-0 shadow-sm h-100">
            <Card.Body>
              <div className="stats-card-icon primary">
                <FaBook />
              </div>
              <h3 className="mb-1">{stats.totalLectures}</h3>
              <p className="text-muted mb-0">Total Classes</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
          <Card className="stats-card border-0 shadow-sm h-100">
            <Card.Body>
              <div className="stats-card-icon success">
                <FaCalendarCheck />
              </div>
              <h3 className="mb-1">{stats.attendedLectures}</h3>
              <p className="text-muted mb-0">Classes Attended</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
          <Card className="stats-card border-0 shadow-sm h-100">
            <Card.Body>
              <div className="stats-card-icon warning">
                <FaClock />
              </div>
              <h3 className="mb-1">{stats.attendancePercentage}%</h3>
              <p className="text-muted mb-0">Attendance Rate</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
          <Card className="stats-card border-0 shadow-sm h-100">
            <Card.Body>
              <div className="stats-card-icon danger">
                <FaChartLine />
              </div>
              <h3 className="mb-1">{stats.attendanceStats.reduce((sum, item) => sum + item.count, 0)}</h3>
              <p className="text-muted mb-0">Total Records</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        {/* Attendance Progress */}
        <Col lg={4} md={6} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0 fw-bold">Attendance Progress</h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-4">
                <div className="position-relative d-inline-block">
                  <Doughnut 
                    data={doughnutChartData} 
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'bottom'
                        }
                      },
                      cutout: '70%'
                    }} 
                  />
                  <div className="position-absolute top-50 start-50 translate-middle">
                    <h3 className="mb-0">{stats.attendancePercentage}%</h3>
                    <small className="text-muted">Rate</small>
                  </div>
                </div>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Attendance Goal</span>
                <span>75%</span>
              </div>
              <ProgressBar 
                now={parseFloat(stats.attendancePercentage)} 
                variant={parseFloat(stats.attendancePercentage) >= 75 ? 'success' : 'warning'}
                className="mb-4"
              />
              
              <div className="text-center">
                <Button 
                  as={Link} 
                  to="/student/scan"
                  variant="primary"
                  className="w-100"
                >
                  <FaQrcode className="me-2" />
                  Scan QR Code
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Monthly Trend */}
        <Col lg={8} md={6} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0 fw-bold">Monthly Attendance Trend</h5>
            </Card.Header>
            <Card.Body>
              <Line data={lineChartData} options={lineChartOptions} height={100} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Recent Attendance */}
        <Col lg={6} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">Recent Attendance</h5>
              <Button 
                as={Link} 
                to="/student/attendance"
                variant="link" 
                size="sm"
                className="text-decoration-none"
              >
                View All <FaArrowRight className="ms-1" />
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Unit</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAttendance.map((attendance, index) => (
                      <tr key={index}>
                        <td>
                          <div>
                            <strong>{attendance.lectureId.unitName}</strong>
                            <div className="small text-muted">{attendance.lectureId.unitCode}</div>
                          </div>
                        </td>
                        <td>{formatDate(attendance.scanTime, 'MMM D, YYYY')}</td>
                        <td>{formatTime(attendance.scanTime, 'hh:mm A')}</td>
                        <td>
                          <Badge 
                            bg={ATTENDANCE_STATUS_COLORS[attendance.status] || 'secondary'}
                            className="text-capitalize"
                          >
                            {attendance.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Upcoming Lectures */}
        <Col lg={6} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">Upcoming Lectures</h5>
              <FaCalendarAlt />
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Unit</th>
                      <th>Date & Time</th>
                      <th>Venue</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingLectures.map((lecture, index) => (
                      <tr key={index}>
                        <td>
                          <div>
                            <strong>{lecture.unitName}</strong>
                            <div className="small text-muted">{lecture.unitCode}</div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div>{formatDate(lecture.date, 'MMM D')}</div>
                            <div className="small text-muted">
                              {lecture.startTime} - {lecture.endTime}
                            </div>
                          </div>
                        </td>
                        <td>{lecture.venue}</td>
                        <td>
                          {lecture.canAttend ? (
                            <Badge bg="success">Can Attend</Badge>
                          ) : (
                            <Badge bg="secondary">Already Attended</Badge>
                          )}
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
    </>
  );
};

export default StudentDashboard;
