import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Card,
  Table,
  Badge,
  ProgressBar,
  Row,
  Col,
  Dropdown
} from 'react-bootstrap';
import {
  FaBook,
  FaChartLine,
  FaCalendarAlt,
  FaCheckCircle,
  FaDownload,
  FaPrint
} from 'react-icons/fa';
import { studentService } from '../../services/student';
import {
  formatDate,
  calculatePercentage
} from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './Units.css';

const StudentUnits = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUnits: 0,
    totalClasses: 0,
    attendedClasses: 0,
    overallPercentage: 0
  });

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      setLoading(true);
      const response = await studentService.getUnits();
      
      if (response.success) {
        setUnits(response.data);
        calculateStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching units:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (unitsData) => {
    const totalUnits = unitsData.length;
    const totalClasses = unitsData.reduce((sum, unit) => sum + unit.totalClasses, 0);
    const attendedClasses = unitsData.reduce((sum, unit) => sum + unit.attendedClasses, 0);
    const overallPercentage = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;
    
    setStats({
      totalUnits,
      totalClasses,
      attendedClasses,
      overallPercentage: overallPercentage.toFixed(2)
    });
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'danger';
  };

  const getPerformanceLabel = (percentage) => {
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Good';
    if (percentage >= 40) return 'Fair';
    return 'Poor';
  };

  const handleExport = (format) => {
    // Implement export functionality
    console.log(`Exporting units as ${format}`);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>My Units | IN Attendance System</title>
      </Helmet>

      <div className="page-header mb-4">
        <h1 className="h2 fw-bold">My Units</h1>
        <p className="text-muted">
          View attendance statistics for your enrolled units
        </p>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="stats-card-icon primary">
                <FaBook />
              </div>
              <h3 className="mb-1">{stats.totalUnits}</h3>
              <p className="text-muted mb-0">Total Units</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="stats-card-icon success">
                <FaCheckCircle />
              </div>
              <h3 className="mb-1">{stats.attendedClasses}</h3>
              <p className="text-muted mb-0">Classes Attended</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="stats-card-icon warning">
                <FaCalendarAlt />
              </div>
              <h3 className="mb-1">{stats.totalClasses}</h3>
              <p className="text-muted mb-0">Total Classes</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="stats-card-icon danger">
                <FaChartLine />
              </div>
              <h3 className="mb-1">{stats.overallPercentage}%</h3>
              <p className="text-muted mb-0">Overall Rate</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Units Table */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Unit Performance</h5>
          
          <Dropdown>
            <Dropdown.Toggle variant="outline-primary" size="sm">
              <FaDownload className="me-2" />
              Export
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleExport('csv')}>
                Export as CSV
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleExport('pdf')}>
                Export as PDF
              </Dropdown.Item>
              <Dropdown.Item onClick={handlePrint}>
                <FaPrint className="me-2" />
                Print
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Card.Header>
        
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead>
                <tr>
                  <th>Unit Details</th>
                  <th>Classes</th>
                  <th>Attendance</th>
                  <th>Rate</th>
                  <th>Performance</th>
                  <th>Last Attendance</th>
                </tr>
              </thead>
              <tbody>
                {units.length > 0 ? (
                  units.map((unit, index) => {
                    const percentage = unit.attendancePercentage || 0;
                    const performanceColor = getPerformanceColor(percentage);
                    const performanceLabel = getPerformanceLabel(percentage);
                    
                    return (
                      <tr key={index}>
                        <td>
                          <div>
                            <strong>{unit.unitName}</strong>
                            <div className="small text-muted">{unit.unitCode}</div>
                          </div>
                        </td>
                        <td>
                          <div className="text-center">
                            <div className="fw-bold">{unit.totalClasses}</div>
                            <small className="text-muted">Total</small>
                          </div>
                        </td>
                        <td>
                          <div className="text-center">
                            <div className="fw-bold">{unit.attendedClasses}</div>
                            <small className="text-muted">Attended</small>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="fw-bold mb-1">{percentage.toFixed(2)}%</div>
                            <ProgressBar
                              now={percentage}
                              variant={performanceColor}
                              style={{ height: '6px' }}
                            />
                          </div>
                        </td>
                        <td>
                          <Badge bg={performanceColor}>
                            {performanceLabel}
                          </Badge>
                        </td>
                        <td>
                          {unit.lastAttendance ? (
                            <div>
                              <div>{formatDate(unit.lastAttendance, 'MMM D, YYYY')}</div>
                              <small className="text-muted">
                                {formatDate(unit.lastAttendance, 'hh:mm A')}
                              </small>
                            </div>
                          ) : (
                            <span className="text-muted">No attendance yet</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <div className="text-muted">
                        <FaBook size={48} className="mb-3" />
                        <h5>No units found</h5>
                        <p>You are not enrolled in any units yet</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Performance Summary */}
      {units.length > 0 && (
        <Row className="mt-4">
          <Col lg={6} className="mb-4">
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-white">
                <h5 className="mb-0 fw-bold">Performance Summary</h5>
              </Card.Header>
              <Card.Body>
                <div className="performance-summary">
                  {units.map((unit, index) => {
                    const percentage = unit.attendancePercentage || 0;
                    const performanceColor = getPerformanceColor(percentage);
                    
                    return (
                      <div key={index} className="performance-item mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span className="fw-medium">{unit.unitCode}</span>
                          <span className={`fw-bold text-${performanceColor}`}>
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                        <ProgressBar
                          now={percentage}
                          variant={performanceColor}
                          className="mb-2"
                        />
                        <div className="d-flex justify-content-between small text-muted">
                          <span>{unit.attendedClasses} of {unit.totalClasses} classes</span>
                          <span>{getPerformanceLabel(percentage)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={6} className="mb-4">
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-white">
                <h5 className="mb-0 fw-bold">Attendance Insights</h5>
              </Card.Header>
              <Card.Body>
                <div className="attendance-insights">
                  <div className="insight-item mb-4">
                    <h6>Overall Attendance Rate</h6>
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1">
                        <ProgressBar
                          now={stats.overallPercentage}
                          variant={getPerformanceColor(stats.overallPercentage)}
                          className="mb-2"
                        />
                      </div>
                      <div className="ms-3 fw-bold">
                        {stats.overallPercentage}%
                      </div>
                    </div>
                    <small className="text-muted">
                      {stats.attendedClasses} attended out of {stats.totalClasses} total classes
                    </small>
                  </div>
                  
                  <div className="insight-item mb-4">
                    <h6>Best Performing Unit</h6>
                    {units.length > 0 ? (
                      (() => {
                        const bestUnit = units.reduce((prev, current) => 
                          (prev.attendancePercentage || 0) > (current.attendancePercentage || 0) 
                            ? prev 
                            : current
                        );
                        
                        return (
                          <div>
                            <div className="fw-bold">{bestUnit.unitName}</div>
                            <div className="text-muted small">{bestUnit.unitCode}</div>
                            <Badge bg={getPerformanceColor(bestUnit.attendancePercentage)} className="mt-1">
                              {bestUnit.attendancePercentage.toFixed(1)}%
                            </Badge>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="text-muted">No units available</div>
                    )}
                  </div>
                  
                  <div className="insight-item">
                    <h6>Recommendations</h6>
                    <ul className="list-unstyled">
                      {stats.overallPercentage < 75 && (
                        <li className="mb-2">
                          <Badge bg="warning" className="me-2">!</Badge>
                          Try to maintain at least 75% attendance
                        </li>
                      )}
                      <li className="mb-2">
                        <Badge bg="info" className="me-2">✓</Badge>
                        Attend all scheduled lectures
                      </li>
                      <li>
                        <Badge bg="info" className="me-2">✓</Badge>
                        Scan QR codes promptly during lectures
                      </li>
                    </ul>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default StudentUnits;
