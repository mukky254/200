export const APP_NAME = process.env.REACT_APP_APP_NAME || 'IN Attendance System';
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const QR_CODE_SIZE = parseInt(process.env.REACT_APP_QR_CODE_SIZE) || 300;
export const DEFAULT_PAGE_SIZE = parseInt(process.env.REACT_APP_DEFAULT_PAGE_SIZE) || 20;

export const ROLES = {
  ADMIN: 'admin',
  LECTURER: 'lecturer',
  STUDENT: 'student'
};

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  LATE: 'late',
  ABSENT: 'absent',
  EXCUSED: 'excused'
};

export const ATTENDANCE_STATUS_COLORS = {
  present: 'success',
  late: 'warning',
  absent: 'danger',
  excused: 'info'
};

export const ATTENDANCE_STATUS_LABELS = {
  present: 'Present',
  late: 'Late',
  absent: 'Absent',
  excused: 'Excused'
};

export const LECTURE_STATUS = {
  SCHEDULED: 'scheduled',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const LECTURE_STATUS_COLORS = {
  scheduled: 'info',
  ongoing: 'primary',
  completed: 'success',
  cancelled: 'danger'
};

export const LECTURE_STATUS_LABELS = {
  scheduled: 'Scheduled',
  ongoing: 'Ongoing',
  completed: 'Completed',
  cancelled: 'Cancelled'
};

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const DAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export const TIME_FORMAT = 'HH:mm';
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const YEARS_OF_STUDY = ['1', '2', '3', '4', '5', 'Postgraduate'];

export const COURSES = [
  'Computer Science',
  'Information Technology',
  'Software Engineering',
  'Computer Engineering',
  'Information Systems',
  'Cybersecurity',
  'Data Science',
  'Business Information Technology'
];

export const DEPARTMENTS = [
  'School of Computing',
  'School of Engineering',
  'School of Business',
  'School of Science',
  'School of Humanities'
];
