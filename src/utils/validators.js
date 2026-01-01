export const validateRequired = (value) => {
  if (!value || value.trim() === '') {
    return 'This field is required';
  }
  return '';
};

export const validateEmail = (email) => {
  if (!email) {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return '';
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return '';
};

export const validatePhone = (phone) => {
  if (!phone) {
    return 'Phone number is required';
  }
  const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
  if (!phoneRegex.test(phone)) {
    return 'Please enter a valid phone number';
  }
  return '';
};

export const validateAdmissionNumber = (admissionNumber) => {
  if (!admissionNumber) {
    return 'Admission number is required';
  }
  if (admissionNumber.length < 3) {
    return 'Admission number must be at least 3 characters long';
  }
  return '';
};

export const validateUnitCode = (unitCode) => {
  if (!unitCode) {
    return 'Unit code is required';
  }
  if (unitCode.length < 3) {
    return 'Unit code must be at least 3 characters long';
  }
  return '';
};

export const validateDate = (date) => {
  if (!date) {
    return 'Date is required';
  }
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    return 'Date cannot be in the past';
  }
  return '';
};

export const validateTime = (time) => {
  if (!time) {
    return 'Time is required';
  }
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(time)) {
    return 'Please enter a valid time (HH:MM)';
  }
  return '';
};

export const validateDuration = (duration) => {
  if (!duration) {
    return 'Duration is required';
  }
  const num = parseInt(duration);
  if (isNaN(num) || num < 5 || num > 240) {
    return 'Duration must be between 5 and 240 minutes';
  }
  return '';
};

export const validateConfirmation = (value, confirmValue, fieldName) => {
  if (value !== confirmValue) {
    return `${fieldName} do not match`;
  }
  return '';
};

export const validateNumber = (value, min = null, max = null) => {
  if (value === '' || value === null || value === undefined) {
    return 'This field is required';
  }
  
  const num = Number(value);
  if (isNaN(num)) {
    return 'Please enter a valid number';
  }
  
  if (min !== null && num < min) {
    return `Value must be at least ${min}`;
  }
  
  if (max !== null && num > max) {
    return `Value must be at most ${max}`;
  }
  
  return '';
};

export const validateUrl = (url) => {
  if (!url) {
    return '';
  }
  
  try {
    new URL(url);
    return '';
  } catch (error) {
    return 'Please enter a valid URL';
  }
};

// Form validation helper
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  Object.keys(validationRules).forEach(field => {
    const value = formData[field];
    const rules = validationRules[field];
    
    for (const rule of rules) {
      const error = rule(value, formData);
      if (error) {
        errors[field] = error;
        isValid = false;
        break;
      }
    }
  });

  return { errors, isValid };
};
