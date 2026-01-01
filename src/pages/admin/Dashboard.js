import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Row,
  Col,
  Card,
  Table,
  Badge,
  ProgressBar
} from 'react-bootstrap';
import {
  FaUsers,
  FaCalendarCheck,
  FaQrcode,
  FaChartLine,
  FaUserCheck,
  FaUserTimes,
  FaClock,
  FaServer
} from 'react-icons/fa';
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
import { adminService } from '../../services/admin';
import { formatDate, formatFileSize } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';

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

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDashboard();
      
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

  const { 
    userStats,
    lectureStats,
    attendanceStats,
    qrStats,
    recentActivities,
    systemHealth,
    topUnits 
  } = dashboardData;

  // User distribution chart
  const userChartData = {
    labels: userStats.map(stat => stat._id.charAt(0).toUpperCase() + stat._id.slice(1)),
    datasets: [
      {
        data: userStats.map(stat => stat.count),
        backgroundColor: [
          '#4361ee',
          '#4cc9f0',
          '#ff9e00'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  // Attendance trend chart
  const attendanceChartData = {
    labels: ['Today', 'This Week', 'This Month'],
    datasets: [
      {
        label: 'Attendance',
        data: [
          attendanceStats.today,
          attendanceStats.thisWeek,
          attendanceStats.thisMonth
        ],
        borderColor: '#4361ee',
        backgroundColor: 'rgba(67, 97, 238, 0.1)',
        tension: 0.4,
        fill: true
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

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | IN Attendance System</title>
      </Helmet>

      <div className="page-header mb-4">
        <h1 className="h2 fw-bold">Admin Dashboard</h1>
        <p className="text-muted">
          System overview and analytics
        </p>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
          <Card className="stats-card border-0 shadow-sm h-100">
            <Card.Body>
              <div className="stats-card-icon primary">
                <FaUsers />
              </div>
              <h3 className="mb-1">{userStats.reduce((sum, stat) => sum + stat.count, 0)}</h3>
              <p className="text-muted mb-0">Total Users</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
          <Card className="stats-card border-0 shadow-sm h-100">
            <Card.Body>
              <div className="stats-card-icon success">
                <FaCalendarCheck />
              </div>
              <h3 className="mb-1">{attendanceStats.total}</h3>
              <p className="text-muted mb-0">Total Attendance</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
          <Card className="stats-card border-0 shadow-sm h-100">
            <Card.Body>
              <div className="stats-card-icon warning">
                <FaQrcode />
              </div>
              <h3 className="mb-1">{qrStats.total}</h3>
              <p className="text-muted mb-0">QR Codes</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
          <Card className="stats-card border-0 shadow-sm h-100">
            <Card.Body>
              <div className="stats-card-icon danger">
                <FaChartLine />
              </div>
              <h3 className="mb-1">{lectureStats.reduce((sum, stat) => sum + stat.count, 0)}</h3>
              <p className="text-muted mb-0">Total Lectures</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        {/* User Distribution */}
        <Col lg={4} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0 fw-bold">User Distribution</h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center">
                <Doughnut 
                  data={userChartData} 
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    },
                    cutout: '60%'
                  }} 
                />
              </div>
              
              <div className="mt-4">
                {userStats.map((stat, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center">
                      <div 
                        className="me-2" 
                        style={{
                          width: '12px',
                          height: '12px',
                          backgroundColor: userChartData.datasets[0].backgroundColor[index],
                          borderRadius: '50%'
                        }}
                      />
                      <span className="text-capitalize">{stat._id}</span>
                    </div>
                    <div>
                      <span className="fw-bold">{stat.count}</span>
                      <span className="text-muted ms-2">
                        ({stat.active}/{stat.count} active)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Attendance Trend */}
        <Col lg={5} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0 fw-bold">Attendance Trend</h5>
            </Card.Header>
            <Card.Body>
              <Line 
                data={attendanceChartData} 
                options={attendanceChartOptions}
                height={100}
              />
              
              <div className="row mt-4">
                <div className="col-4 text-center">
                  <div className="fw-bold h4 mb-1">{attendanceStats.today}</div>
                  <small className="text-muted">Today</small>
                </div>
                <div className="col-4 text-center">
                  <div className="fw-bold h4 mb-1">{attendanceStats.thisWeek}</div>
                  <small className="text-muted">This Week</small>
                </div>
                <div className="col-4 text-center">
                  <div className="fw-bold h4 mb-1">{attendanceStats.thisMonth}</div>
                  <small className="text-muted">This Month</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* System Health */}
        <Col lg={3} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0 fw-bold d-flex align-items-center">
                <FaServer className="me-2" />
                System Health
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">Database</span>
                  <Badge bg="success">Connected</Badge>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">Uptime</span>
                  <span className="fw-bold">
                    {Math.floor(systemHealth.uptime / 3600)}h
                  </span>
                </div>
                <ProgressBar 
                  now={100} 
                  variant="success"
                  style={{ height: '6px' }}
                />
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">Memory Usage</span>
                  <span className="fw-bold">
                    {formatFileSize(systemHealth.memoryUsage.used)}
                  </span>
                </div>
                <ProgressBar 
                  now={(systemHealth.memoryUsage.used / systemHealth.memoryUsage.total) * 100}
                  variant="info"
                  style={{ height: '6px' }}
                />
              </div>
              
              <div className="mt-4">
                <div className="text-muted small">Last Updated</div>
                <div className="fw-bold">
                  {formatDate(systemHealth.timestamp, 'hh:mm A')}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Recent Activities */}
        <Col lg={6} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0 fw-bold">Recent Activities</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Unit</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivities.map((activity, index) => (
                      <tr key={index}>
                        <td>
                          <div>
                            <strong>{activity.studentId?.name}</strong>
                            <div className="small text-muted">
                              {activity.studentId?.admissionNumber}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div>{activity.lectureId?.unitCode}</div>
                            <div className="small text-muted">
                              {activity.lectureId?.unitName}
                            </div>
                          </div>
                        </td>
                        <td>
                          {formatDate(activity.scanTime, 'hh:mm A')}
                          <div className="small text-muted">
                            {formatDate(activity.scanTime, 'MMM D')}
                          </div>
                        </td>
                        <td>
                          <Badge bg={activity.status === 'present' ? 'success' : 'warning'}>
                            {activity.status}
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

        {/* Top Performing Units */}
        <Col lg={6} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0 fw-bold">Top Performing Units</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Unit</th>
                      <th>Lecturer</th>
                      <th>Classes</th>
                      <th>Attendance</th>
                      <th>Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topUnits.map((unit, index) => (
                      <tr key={index}>
                        <td>
                          <div>
                            <strong>{unit.unitName}</strong>
                            <div className="small text-muted">{unit.unitCode}</div>
                          </div>
                        </td>
                        <td>{unit.lecturerName}</td>
                        <td>{unit.totalClasses}</td>
                        <td>
                          <div className="text-center">
                            <div className="fw-bold">{unit.presentCount}</div>
                            <small className="text-muted">
                              of {unit.totalAttendance}
                            </small>
                          </div>
                        </td>
                        <td>
                          <Badge bg={unit.attendanceRate >= 80 ? 'success' : 'warning'}>
                            {unit.attendanceRate.toFixed(1)}%
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
      </Row>
    </>
  );
};

export default AdminDashboard;
