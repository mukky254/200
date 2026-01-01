import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Card,
  Table,
  Badge,
  Button,
  Form,
  Row,
  Col,
  InputGroup,
  Dropdown,
  Pagination
} from 'react-bootstrap';
import {
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaDownload,
  FaPrint,
  FaEye
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { studentService } from '../../services/student';
import {
  formatDate,
  formatTime,
  getRelativeTime
} from '../../utils/helpers';
import {
  ATTENDANCE_STATUS_COLORS,
  ATTENDANCE_STATUS_LABELS
} from '../../utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './AttendanceHistory.css';

const AttendanceHistory = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    unitCode: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 10,
    sortBy: 'scanTime',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  useEffect(() => {
    fetchAttendanceHistory();
  }, [filters]);

  const fetchAttendanceHistory = async () => {
    try {
      setLoading(true);
      const response = await studentService.getAttendanceHistory(filters);
      
      if (response.success) {
        setAttendanceData(response.data.attendance);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching attendance history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleExport = (format) => {
    // Implement export functionality
    console.log(`Exporting as ${format}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusCount = (status) => {
    if (!attendanceData.length) return 0;
    return attendanceData.filter(item => item.status === status).length;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>Attendance History | IN Attendance System</title>
      </Helmet>

      <div className="page-header mb-4">
        <h1 className="h2 fw-bold">Attendance History</h1>
        <p className="text-muted">
          View and manage your attendance records
        </p>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <h3 className="mb-1">{pagination.total}</h3>
              <p className="text-muted mb-0">Total Records</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <h3 className="mb-1">{getStatusCount('present')}</h3>
              <p className="text-muted mb-0">Present</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <h3 className="mb-1">{getStatusCount('late')}</h3>
              <p className="text-muted mb-0">Late</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <h3 className="mb-1">{getStatusCount('absent')}</h3>
              <p className="text-muted mb-0">Absent</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">All Status</option>
                  {Object.entries(ATTENDANCE_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group>
                <Form.Label>Unit Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., CS101"
                  value={filters.unitCode}
                  onChange={(e) => handleFilterChange('unitCode', e.target.value)}
                />
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group>
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group>
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group>
                <Form.Label>Sort By</Form.Label>
                <div className="d-flex gap-2">
                  <Form.Select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  >
                    <option value="scanTime">Scan Time</option>
                    <option value="lectureId.date">Date</option>
                    <option value="lectureId.unitCode">Unit Code</option>
                  </Form.Select>
                  <Form.Select
                    value={filters.sortOrder}
                    onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </Form.Select>
                </div>
              </Form.Group>
            </Col>
            
            <Col md={6} className="d-flex align-items-end">
              <div className="d-flex gap-2 w-100">
                <Button
                  variant="outline-secondary"
                  onClick={() => setFilters({
                    status: '',
                    unitCode: '',
                    startDate: '',
                    endDate: '',
                    page: 1,
                    limit: 10,
                    sortBy: 'scanTime',
                    sortOrder: 'desc'
                  })}
                  className="flex-fill"
                >
                  <FaFilter className="me-2" />
                  Reset Filters
                </Button>
                
                <Dropdown>
                  <Dropdown.Toggle variant="outline-primary">
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
                    <Dropdown.Item onClick={() => handleExport('print')}>
                      <FaPrint className="me-2" />
                      Print
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Attendance Table */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white">
          <h5 className="mb-0 fw-bold">Attendance Records</h5>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead>
                <tr>
                  <th>Unit Details</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Lecturer</th>
                  <th>Venue</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.length > 0 ? (
                  attendanceData.map((attendance, index) => (
                    <tr key={index}>
                      <td>
                        <div>
                          <strong>{attendance.lectureId?.unitName || 'N/A'}</strong>
                          <div className="small text-muted">
                            {attendance.lectureId?.unitCode || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          {formatDate(attendance.scanTime, 'MMM D, YYYY')}
                          <div className="small text-muted">
                            {getRelativeTime(attendance.scanTime)}
                          </div>
                        </div>
                      </td>
                      <td>{formatTime(attendance.scanTime, 'hh:mm A')}</td>
                      <td>{attendance.lectureId?.lecturerName || 'N/A'}</td>
                      <td>{attendance.lectureId?.venue || 'N/A'}</td>
                      <td>
                        <Badge
                          bg={ATTENDANCE_STATUS_COLORS[attendance.status]}
                          className="text-capitalize"
                        >
                          {ATTENDANCE_STATUS_LABELS[attendance.status] || attendance.status}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          as={Link}
                          to={`/student/attendance/${attendance._id}`}
                          variant="outline-primary"
                          size="sm"
                        >
                          <FaEye className="me-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <div className="text-muted">
                        <FaCalendarAlt size={48} className="mb-3" />
                        <h5>No attendance records found</h5>
                        <p>Try adjusting your filters or scan a QR code to mark attendance</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
        
        {/* Pagination */}
        {pagination.pages > 1 && (
          <Card.Footer className="bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-muted">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} records
              </div>
              
              <Pagination className="mb-0">
                <Pagination.Prev
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                />
                
                {[...Array(pagination.pages)].map((_, i) => {
                  const pageNum = i + 1;
                  // Show first page, last page, and pages around current page
                  if (
                    pageNum === 1 ||
                    pageNum === pagination.pages ||
                    (pageNum >= pagination.page - 2 && pageNum <= pagination.page + 2)
                  ) {
                    return (
                      <Pagination.Item
                        key={pageNum}
                        active={pageNum === pagination.page}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Pagination.Item>
                    );
                  } else if (
                    pageNum === pagination.page - 3 ||
                    pageNum === pagination.page + 3
                  ) {
                    return <Pagination.Ellipsis key={pageNum} />;
                  }
                  return null;
                })}
                
                <Pagination.Next
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                />
              </Pagination>
            </div>
          </Card.Footer>
        )}
      </Card>
    </>
  );
};

export default AttendanceHistory;
