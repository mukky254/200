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
  Pagination,
  Dropdown,
  Modal
} from 'react-bootstrap';
import {
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaEye,
  FaEdit,
  FaTrash,
  FaDownload,
  FaPrint,
  FaQrcode
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { lecturerService } from '../../services/lecturer';
import {
  formatDate,
  formatTime,
  getRelativeTime
} from '../../utils/helpers';
import {
  LECTURE_STATUS_COLORS,
  LECTURE_STATUS_LABELS
} from '../../utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './LectureHistory.css';

const LectureHistory = () => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    unitCode: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 10,
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [lectureToDelete, setLectureToDelete] = useState(null);

  useEffect(() => {
    fetchLectures();
  }, [filters]);

  const fetchLectures = async () => {
    try {
      setLoading(true);
      const response = await lecturerService.getLectures(filters);
      
      if (response.success) {
        setLectures(response.data.lectures);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching lectures:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleDeleteClick = (lecture) => {
    setLectureToDelete(lecture);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!lectureToDelete) return;
    
    try {
      const response = await lecturerService.deleteLecture(lectureToDelete._id);
      
      if (response.success) {
        toast.success('Lecture deactivated successfully');
        fetchLectures();
      } else {
        toast.error(response.error || 'Failed to deactivate lecture');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error('Delete lecture error:', error);
    } finally {
      setShowDeleteModal(false);
      setLectureToDelete(null);
    }
  };

  const handleExport = (format) => {
    // Implement export functionality
    console.log(`Exporting as ${format}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusCount = (status) => {
    if (!lectures.length) return 0;
    return lectures.filter(lecture => lecture.status === status).length;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>Lecture History | IN Attendance System</title>
      </Helmet>

      <div className="page-header mb-4">
        <h1 className="h2 fw-bold">Lecture History</h1>
        <p className="text-muted">
          View and manage all your lectures
        </p>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <h3 className="mb-1">{pagination.total}</h3>
              <p className="text-muted mb-0">Total Lectures</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <h3 className="mb-1">{getStatusCount('completed')}</h3>
              <p className="text-muted mb-0">Completed</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <h3 className="mb-1">{getStatusCount('ongoing')}</h3>
              <p className="text-muted mb-0">Ongoing</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <h3 className="mb-1">{getStatusCount('scheduled')}</h3>
              <p className="text-muted mb-0">Scheduled</p>
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
                  {Object.entries(LECTURE_STATUS_LABELS).map(([value, label]) => (
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
                    <option value="date">Date</option>
                    <option value="unitCode">Unit Code</option>
                    <option value="createdAt">Created Date</option>
                    <option value="attendanceCount">Attendance</option>
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
                    sortBy: 'date',
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
                    <Dropdown.Item onClick={handlePrint}>
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

      {/* Lectures Table */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white">
          <h5 className="mb-0 fw-bold">Lectures</h5>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead>
                <tr>
                  <th>Unit Details</th>
                  <th>Date & Time</th>
                  <th>Venue</th>
                  <th>Status</th>
                  <th>Attendance</th>
                  <th>QR Code</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lectures.length > 0 ? (
                  lectures.map((lecture, index) => (
                    <tr key={index}>
                      <td>
                        <div>
                          <strong>{lecture.unitName}</strong>
                          <div className="small text-muted">{lecture.unitCode}</div>
                          {lecture.description && (
                            <div className="small text-muted mt-1">
                              {lecture.description.length > 50
                                ? lecture.description.substring(0, 50) + '...'
                                : lecture.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>{formatDate(lecture.date, 'MMM D, YYYY')}</div>
                          <div className="small text-muted">
                            {lecture.startTime} - {lecture.endTime}
                          </div>
                          <div className="small text-muted">
                            {getRelativeTime(lecture.createdAt)}
                          </div>
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
                          <div className="fw-bold">{lecture.attendanceCount || 0}</div>
                          <small className="text-muted">
                            {lecture.attendanceRate || 0}% rate
                          </small>
                        </div>
                      </td>
                      <td>
                        {lecture.qrCodeId ? (
                          <Badge bg={lecture.qrCodeId.isActive ? 'success' : 'secondary'}>
                            {lecture.qrCodeId.isActive ? 'Active' : 'Expired'}
                          </Badge>
                        ) : (
                          <Badge bg="secondary">No QR</Badge>
                        )}
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
                          {lecture.status === 'scheduled' && (
                            <Button
                              variant="outline-warning"
                              size="sm"
                              as={Link}
                              to={`/lecturer/generate-qr?edit=${lecture._id}`}
                            >
                              <FaEdit size={12} />
                            </Button>
                          )}
                          {lecture.status !== 'completed' && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteClick(lecture)}
                            >
                              <FaTrash size={12} />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <div className="text-muted">
                        <FaCalendarAlt size={48} className="mb-3" />
                        <h5>No lectures found</h5>
                        <p>Try adjusting your filters or create a new lecture</p>
                        <Button
                          as={Link}
                          to="/lecturer/generate-qr"
                          variant="primary"
                          className="mt-2"
                        >
                          <FaQrcode className="me-2" />
                          Create New Lecture
                        </Button>
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
                {pagination.total} lectures
              </div>
              
              <Pagination className="mb-0">
                <Pagination.Prev
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                />
                
                {[...Array(pagination.pages)].map((_, i) => {
                  const pageNum = i + 1;
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

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Deactivate Lecture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to deactivate this lecture?
          </p>
          {lectureToDelete && (
            <div className="alert alert-warning">
              <strong>{lectureToDelete.unitName} ({lectureToDelete.unitCode})</strong><br />
              Date: {formatDate(lectureToDelete.date, 'MMM D, YYYY')}<br />
              Time: {lectureToDelete.startTime} - {lectureToDelete.endTime}
            </div>
          )}
          <p className="text-muted small">
            Note: Deactivated lectures cannot be used for attendance. This action cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            <FaTrash className="me-2" />
            Deactivate
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LectureHistory;
