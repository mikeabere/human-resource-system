import { VALIDATION } from './constants';

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {Object} Validation result
 */
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!VALIDATION.EMAIL_REGEX.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate password
 * @param {string} password - Password
 * @returns {Object} Validation result
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    return { 
      isValid: false, 
      error: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters` 
    };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate password confirmation
 * @param {string} password - Password
 * @param {string} confirmPassword - Confirm password
 * @returns {Object} Validation result
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate phone number
 * @param {string} phone - Phone number
 * @returns {Object} Validation result
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  if (!VALIDATION.PHONE_REGEX.test(phone)) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate name
 * @param {string} name - Name
 * @param {string} fieldName - Field name for error message
 * @returns {Object} Validation result
 */
export const validateName = (name, fieldName = 'Name') => {
  if (!name) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (name.length < VALIDATION.NAME_MIN_LENGTH) {
    return { 
      isValid: false, 
      error: `${fieldName} must be at least ${VALIDATION.NAME_MIN_LENGTH} characters` 
    };
  }
  
  if (name.length > VALIDATION.NAME_MAX_LENGTH) {
    return { 
      isValid: false, 
      error: `${fieldName} must not exceed ${VALIDATION.NAME_MAX_LENGTH} characters` 
    };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate required field
 * @param {any} value - Field value
 * @param {string} fieldName - Field name
 * @returns {Object} Validation result
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate number
 * @param {any} value - Value to validate
 * @param {string} fieldName - Field name
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateNumber = (value, fieldName = 'This field', options = {}) => {
  const { min, max, required = true } = options;
  
  if (required && (value === null || value === undefined || value === '')) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (!required && (value === null || value === undefined || value === '')) {
    return { isValid: true, error: null };
  }
  
  const num = Number(value);
  
  if (isNaN(num)) {
    return { isValid: false, error: `${fieldName} must be a valid number` };
  }
  
  if (min !== undefined && num < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min}` };
  }
  
  if (max !== undefined && num > max) {
    return { isValid: false, error: `${fieldName} must not exceed ${max}` };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate date
 * @param {string} date - Date string
 * @param {string} fieldName - Field name
 * @returns {Object} Validation result
 */
export const validateDate = (date, fieldName = 'Date') => {
  if (!date) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: `${fieldName} is not a valid date` };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate date range
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Object} Validation result
 */
export const validateDateRange = (startDate, endDate) => {
  if (!startDate) {
    return { isValid: false, error: 'Start date is required' };
  }
  
  if (!endDate) {
    return { isValid: false, error: 'End date is required' };
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime())) {
    return { isValid: false, error: 'Start date is not valid' };
  }
  
  if (isNaN(end.getTime())) {
    return { isValid: false, error: 'End date is not valid' };
  }
  
  if (end < start) {
    return { isValid: false, error: 'End date must be after start date' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate date is not in past
 * @param {string} date - Date string
 * @param {string} fieldName - Field name
 * @returns {Object} Validation result
 */
export const validateFutureDate = (date, fieldName = 'Date') => {
  if (!date) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (dateObj < today) {
    return { isValid: false, error: `${fieldName} cannot be in the past` };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate file upload
 * @param {File} file - File object
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateFile = (file, options = {}) => {
  const { 
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = [],
    required = true 
  } = options;
  
  if (required && !file) {
    return { isValid: false, error: 'File is required' };
  }
  
  if (!required && !file) {
    return { isValid: true, error: null };
  }
  
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    return { 
      isValid: false, 
      error: `File size must not exceed ${maxSizeMB}MB` 
    };
  }
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` 
    };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate salary
 * @param {number} salary - Salary amount
 * @returns {Object} Validation result
 */
export const validateSalary = (salary) => {
  if (!salary) {
    return { isValid: false, error: 'Salary is required' };
  }
  
  const amount = Number(salary);
  
  if (isNaN(amount)) {
    return { isValid: false, error: 'Salary must be a valid number' };
  }
  
  if (amount <= 0) {
    return { isValid: false, error: 'Salary must be greater than 0' };
  }
  
  if (amount > 10000000) {
    return { isValid: false, error: 'Salary amount seems too high' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate employee form
 * @param {Object} formData - Form data
 * @returns {Object} Validation errors
 */
export const validateEmployeeForm = (formData) => {
  const errors = {};
  
  // Validate first name
  const firstNameValidation = validateName(formData.firstName, 'First name');
  if (!firstNameValidation.isValid) {
    errors.firstName = firstNameValidation.error;
  }
  
  // Validate last name
  const lastNameValidation = validateName(formData.lastName, 'Last name');
  if (!lastNameValidation.isValid) {
    errors.lastName = lastNameValidation.error;
  }
  
  // Validate email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }
  
  // Validate phone
  const phoneValidation = validatePhone(formData.phone);
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.error;
  }
  
  // Validate department
  const departmentValidation = validateRequired(formData.department, 'Department');
  if (!departmentValidation.isValid) {
    errors.department = departmentValidation.error;
  }
  
  // Validate position
  const positionValidation = validateRequired(formData.position, 'Position');
  if (!positionValidation.isValid) {
    errors.position = positionValidation.error;
  }
  
  // Validate salary
  const salaryValidation = validateSalary(formData.salary);
  if (!salaryValidation.isValid) {
    errors.salary = salaryValidation.error;
  }
  
  // Validate hire date
  const hireDateValidation = validateDate(formData.hireDate, 'Hire date');
  if (!hireDateValidation.isValid) {
    errors.hireDate = hireDateValidation.error;
  }
  
  return errors;
};

/**
 * Validate leave application form
 * @param {Object} formData - Form data
 * @returns {Object} Validation errors
 */
export const validateLeaveForm = (formData) => {
  const errors = {};
  
  // Validate leave type
  const leaveTypeValidation = validateRequired(formData.leaveType, 'Leave type');
  if (!leaveTypeValidation.isValid) {
    errors.leaveType = leaveTypeValidation.error;
  }
  
  // Validate date range
  const dateRangeValidation = validateDateRange(formData.startDate, formData.endDate);
  if (!dateRangeValidation.isValid) {
    errors.dateRange = dateRangeValidation.error;
  }
  
  // Validate start date is not in past
  const startDateValidation = validateFutureDate(formData.startDate, 'Start date');
  if (!startDateValidation.isValid) {
    errors.startDate = startDateValidation.error;
  }
  
  // Validate reason
  const reasonValidation = validateRequired(formData.reason, 'Reason');
  if (!reasonValidation.isValid) {
    errors.reason = reasonValidation.error;
  }
  
  if (formData.reason && formData.reason.length < 10) {
    errors.reason = 'Reason must be at least 10 characters';
  }
  
  return errors;
};

/**
 * Validate login form
 * @param {Object} formData - Form data
 * @returns {Object} Validation errors
 */
export const validateLoginForm = (formData) => {
  const errors = {};
  
  // Validate email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }
  
  // Validate password
  const passwordValidation = validateRequired(formData.password, 'Password');
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  }
  
  return errors;
};

/**
 * Validate password change form
 * @param {Object} formData - Form data
 * @returns {Object} Validation errors
 */
export const validatePasswordChangeForm = (formData) => {
  const errors = {};
  
  // Validate current password
  const currentPasswordValidation = validateRequired(formData.currentPassword, 'Current password');
  if (!currentPasswordValidation.isValid) {
    errors.currentPassword = currentPasswordValidation.error;
  }
  
  // Validate new password
  const newPasswordValidation = validatePassword(formData.newPassword);
  if (!newPasswordValidation.isValid) {
    errors.newPassword = newPasswordValidation.error;
  }
  
  // Validate password match
  const passwordMatchValidation = validatePasswordMatch(
    formData.newPassword, 
    formData.confirmPassword
  );
  if (!passwordMatchValidation.isValid) {
    errors.confirmPassword = passwordMatchValidation.error;
  }
  
  // Check new password is different from current
  if (formData.currentPassword && formData.newPassword && 
      formData.currentPassword === formData.newPassword) {
    errors.newPassword = 'New password must be different from current password';
  }
  
  return errors;
};

/**
 * Validate performance review form
 * @param {Object} formData - Form data
 * @returns {Object} Validation errors
 */
export const validatePerformanceForm = (formData) => {
  const errors = {};
  
  // Validate employee
  const employeeValidation = validateRequired(formData.employee, 'Employee');
  if (!employeeValidation.isValid) {
    errors.employee = employeeValidation.error;
  }
  
  // Validate review type
  const reviewTypeValidation = validateRequired(formData.reviewType, 'Review type');
  if (!reviewTypeValidation.isValid) {
    errors.reviewType = reviewTypeValidation.error;
  }
  
  // Validate review period
  if (!formData.reviewPeriod?.startDate) {
    errors.reviewPeriodStart = 'Review start date is required';
  }
  
  if (!formData.reviewPeriod?.endDate) {
    errors.reviewPeriodEnd = 'Review end date is required';
  }
  
  if (formData.reviewPeriod?.startDate && formData.reviewPeriod?.endDate) {
    const dateRangeValidation = validateDateRange(
      formData.reviewPeriod.startDate,
      formData.reviewPeriod.endDate
    );
    if (!dateRangeValidation.isValid) {
      errors.reviewPeriod = dateRangeValidation.error;
    }
  }
  
  // Validate ratings (1-5)
  const ratingFields = ['quality', 'productivity', 'communication', 'teamwork', 'leadership', 'punctuality'];
  ratingFields.forEach(field => {
    if (formData.ratings?.[field]) {
      const ratingValidation = validateNumber(
        formData.ratings[field],
        field.charAt(0).toUpperCase() + field.slice(1),
        { min: 1, max: 5, required: false }
      );
      if (!ratingValidation.isValid) {
        errors[`ratings.${field}`] = ratingValidation.error;
      }
    }
  });
  
  return errors;
};

/**
 * Check if form has errors
 * @param {Object} errors - Errors object
 * @returns {boolean} True if has errors
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

/**
 * Get first error message
 * @param {Object} errors - Errors object
 * @returns {string|null} First error message
 */
export const getFirstError = (errors) => {
  const keys = Object.keys(errors);
  return keys.length > 0 ? errors[keys[0]] : null;
};

/**
 * Validate form data generically
 * @param {Object} formData - Form data
 * @param {Object} rules - Validation rules
 * @returns {Object} Validation errors
 */
export const validateForm = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = formData[field];
    
    if (rule.required) {
      const validation = validateRequired(value, rule.label || field);
      if (!validation.isValid) {
        errors[field] = validation.error;
        return;
      }
    }
    
    if (rule.type === 'email') {
      const validation = validateEmail(value);
      if (!validation.isValid) {
        errors[field] = validation.error;
      }
    }
    
    if (rule.type === 'phone') {
      const validation = validatePhone(value);
      if (!validation.isValid) {
        errors[field] = validation.error;
      }
    }
    
    if (rule.type === 'number') {
      const validation = validateNumber(value, rule.label || field, {
        min: rule.min,
        max: rule.max,
        required: rule.required,
      });
      if (!validation.isValid) {
        errors[field] = validation.error;
      }
    }
    
    if (rule.type === 'date') {
      const validation = validateDate(value, rule.label || field);
      if (!validation.isValid) {
        errors[field] = validation.error;
      }
    }
    
    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `${rule.label || field} must be at least ${rule.minLength} characters`;
    }
    
    if (rule.maxLength && value && value.length > rule.maxLength) {
      errors[field] = `${rule.label || field} must not exceed ${rule.maxLength} characters`;
    }
    
    if (rule.pattern && value && !rule.pattern.test(value)) {
      errors[field] = rule.message || `${rule.label || field} format is invalid`;
    }
    
    if (rule.custom && typeof rule.custom === 'function') {
      const customValidation = rule.custom(value, formData);
      if (!customValidation.isValid) {
        errors[field] = customValidation.error;
      }
    }
  });
  
  return errors;
};

export default {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validatePhone,
  validateName,
  validateRequired,
  validateNumber,
  validateDate,
  validateDateRange,
  validateFutureDate,
  validateFile,
  validateSalary,
  validateEmployeeForm,
  validateLeaveForm,
  validateLoginForm,
  validatePasswordChangeForm,
  validatePerformanceForm,
  hasErrors,
  getFirstError,
  validateForm,
};