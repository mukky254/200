import moment from 'moment';

// Format date
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  if (!date) return '';
  return moment(date).format(format);
};

// Format time
export const formatTime = (time, format = 'HH:mm') => {
  if (!time) return '';
  return moment(time, 'HH:mm').format(format);
};

// Format datetime
export const formatDateTime = (datetime, format = 'YYYY-MM-DD HH:mm') => {
  if (!datetime) return '';
  return moment(datetime).format(format);
};

// Get relative time
export const getRelativeTime = (datetime) => {
  if (!datetime) return '';
  return moment(datetime).fromNow();
};

// Calculate percentage
export const calculatePercentage = (part, total) => {
  if (!total || total === 0) return 0;
  return ((part / total) * 100).toFixed(2);
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Generate random color
export const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

// Capitalize first letter
export const capitalizeFirst = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

// Format phone number
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format for Kenya numbers
  if (cleaned.startsWith('254')) {
    return `+254 ${cleaned.substring(3, 6)} ${cleaned.substring(6, 9)} ${cleaned.substring(9)}`;
  } else if (cleaned.startsWith('07') && cleaned.length === 10) {
    return `+254 ${cleaned.substring(1, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7)}`;
  }
  
  return phone;
};

// Download file
export const downloadFile = (data, filename, type = 'text/csv') => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Generate QR code data URL
export const generateQRCodeData = (data) => {
  return `data:image/png;base64,${data}`;
};

// Validate email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate phone number
export const validatePhone = (phone) => {
  const re = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
  return re.test(phone);
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Get user initials
export const getUserInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Get status badge color
export const getStatusColor = (status) => {
  const colors = {
    active: 'success',
    inactive: 'secondary',
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
    present: 'success',
    late: 'warning',
    absent: 'danger',
    excused: 'info',
    scheduled: 'info',
    ongoing: 'primary',
    completed: 'success',
    cancelled: 'danger'
  };
  return colors[status] || 'secondary';
};
