// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    REGISTER: "/auth/register",
    UPDATE_PASSWORD: "/auth/update-password",
  },
  USERS: {
    BASE: "/users",
    DETAILS: (id) => `/users/${id}`,
    ACTIVATE: (id) => `/users/${id}/activate`,
    DEACTIVATE: (id) => `/users/${id}/deactivate`,
  },
  EMPLOYEES: {
    BASE: "/employees",
    DETAILS: (id) => `/employees/${id}`,
    MY_PROFILE: "/employees/me/profile",
    STATS: "/employees/stats/overview",
  },
  ATTENDANCE: {
    CHECKIN: "/attendance/checkin",
    CHECKOUT: "/attendance/checkout",
    MY_RECORDS: "/attendance/my-records",
    BASE: "/attendance",
    EMPLOYEE: (id) => `/attendance/employee/${id}`,
    SUMMARY: "/attendance/summary/stats",
  },
  LEAVES: {
    BASE: "/leaves",
    MY_LEAVES: "/leaves/my-leaves",
    DETAILS: (id) => `/leaves/${id}`,
    APPROVE: (id) => `/leaves/${id}/approve`,
    REJECT: (id) => `/leaves/${id}/reject`,
    CANCEL: (id) => `/leaves/${id}/cancel`,
    BALANCE: "/leaves/balance",
  },
  PERFORMANCE: {
    BASE: "/performance",
    MY_REVIEWS: "/performance/my-reviews",
    DETAILS: (id) => `/performance/${id}`,
    SUBMIT: (id) => `/performance/${id}/submit`,
    ACKNOWLEDGE: (id) => `/performance/${id}/acknowledge`,
    EMPLOYEE_STATS: (id) => `/performance/employee/${id}/stats`,
  },
};

// User Roles
export const USER_ROLES = {
  ADMIN: "admin",
  HR_MANAGER: "hr_manager",
  EMPLOYEE: "employee",
};

// Leave Types
export const LEAVE_TYPES = {
  ANNUAL: "annual",
  SICK: "sick",
  CASUAL: "casual",
  MATERNITY: "maternity",
  PATERNITY: "paternity",
  UNPAID: "unpaid",
};

export const LEAVE_TYPE_LABELS = {
  [LEAVE_TYPES.ANNUAL]: "Annual Leave",
  [LEAVE_TYPES.SICK]: "Sick Leave",
  [LEAVE_TYPES.CASUAL]: "Casual Leave",
  [LEAVE_TYPES.MATERNITY]: "Maternity Leave",
  [LEAVE_TYPES.PATERNITY]: "Paternity Leave",
  [LEAVE_TYPES.UNPAID]: "Unpaid Leave",
};

// Leave Status
export const LEAVE_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
};

// Attendance Status
export const ATTENDANCE_STATUS = {
  PRESENT: "present",
  ABSENT: "absent",
  HALF_DAY: "half-day",
  LATE: "late",
  ON_LEAVE: "on-leave",
};

// Employment Types
export const EMPLOYMENT_TYPES = {
  FULL_TIME: "full-time",
  PART_TIME: "part-time",
  CONTRACT: "contract",
  INTERN: "intern",
};

export const EMPLOYMENT_TYPE_LABELS = {
  [EMPLOYMENT_TYPES.FULL_TIME]: "Full Time",
  [EMPLOYMENT_TYPES.PART_TIME]: "Part Time",
  [EMPLOYMENT_TYPES.CONTRACT]: "Contract",
  [EMPLOYMENT_TYPES.INTERN]: "Intern",
};

// Employee Status
export const EMPLOYEE_STATUS = {
  ACTIVE: "active",
  ON_LEAVE: "on-leave",
  TERMINATED: "terminated",
  RESIGNED: "resigned",
};

// Performance Review Types
export const REVIEW_TYPES = {
  QUARTERLY: "quarterly",
  HALF_YEARLY: "half-yearly",
  ANNUAL: "annual",
  PROBATION: "probation",
};

export const REVIEW_TYPE_LABELS = {
  [REVIEW_TYPES.QUARTERLY]: "Quarterly Review",
  [REVIEW_TYPES.HALF_YEARLY]: "Half-Yearly Review",
  [REVIEW_TYPES.ANNUAL]: "Annual Review",
  [REVIEW_TYPES.PROBATION]: "Probation Review",
};

// Performance Review Status
export const REVIEW_STATUS = {
  DRAFT: "draft",
  SUBMITTED: "submitted",
  ACKNOWLEDGED: "acknowledged",
};

// Gender Options
export const GENDER = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
};

export const GENDER_LABELS = {
  [GENDER.MALE]: "Male",
  [GENDER.FEMALE]: "Female",
  [GENDER.OTHER]: "Other",
};

// Departments (commonly used)
export const DEPARTMENTS = [
  "Engineering",
  "Human Resources",
  "Finance",
  "Marketing",
  "Sales",
  "Operations",
  "IT",
  "Customer Support",
  "Product",
  "Design",
  "Legal",
  "Administration",
];

// Positions (commonly used)
export const POSITIONS = [
  "Software Engineer",
  "Senior Software Engineer",
  "Team Lead",
  "Manager",
  "Senior Manager",
  "Director",
  "VP",
  "HR Manager",
  "HR Executive",
  "Accountant",
  "Finance Manager",
  "Marketing Manager",
  "Sales Executive",
  "Sales Manager",
  "Operations Manager",
  "Product Manager",
  "UI/UX Designer",
  "DevOps Engineer",
  "QA Engineer",
  "Business Analyst",
  "Project Manager",
];

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: "MMM DD, YYYY",
  INPUT: "YYYY-MM-DD",
  DATETIME: "MMM DD, YYYY HH:mm",
  TIME: "HH:mm",
};

// Status Colors
export const STATUS_COLORS = {
  [LEAVE_STATUS.PENDING]: "#f59e0b",
  [LEAVE_STATUS.APPROVED]: "#10b981",
  [LEAVE_STATUS.REJECTED]: "#ef4444",
  [LEAVE_STATUS.CANCELLED]: "#6b7280",
  [ATTENDANCE_STATUS.PRESENT]: "#10b981",
  [ATTENDANCE_STATUS.ABSENT]: "#ef4444",
  [ATTENDANCE_STATUS.LATE]: "#f59e0b",
  [ATTENDANCE_STATUS.ON_LEAVE]: "#3b82f6",
  [EMPLOYEE_STATUS.ACTIVE]: "#10b981",
  [EMPLOYEE_STATUS.ON_LEAVE]: "#f59e0b",
  [EMPLOYEE_STATUS.TERMINATED]: "#ef4444",
  [EMPLOYEE_STATUS.RESIGNED]: "#6b7280",
};

// Alert Types
export const ALERT_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  THEME: "theme",
  LANGUAGE: "language",
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  SERVER_ERROR: "Server error. Please try again later.",
  VALIDATION_ERROR: "Please check your input and try again.",
  NOT_FOUND: "The requested resource was not found.",
  SESSION_EXPIRED: "Your session has expired. Please login again.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: "Login successful!",
  LOGOUT: "Logged out successfully!",
  CREATE: "Created successfully!",
  UPDATE: "Updated successfully!",
  DELETE: "Deleted successfully!",
  SAVE: "Saved successfully!",
  SUBMIT: "Submitted successfully!",
};

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX:
    /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/jpg", "image/gif"],
  ACCEPTED_DOCUMENT_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

// Rating Scale
export const RATING_SCALE = {
  MIN: 1,
  MAX: 5,
  LABELS: {
    1: "Poor",
    2: "Below Average",
    3: "Average",
    4: "Good",
    5: "Excellent",
  },
};

// Working Hours
export const WORKING_HOURS = {
  STANDARD: 8,
  HALF_DAY: 4,
  START_TIME: "09:00",
  END_TIME: "18:00",
  LUNCH_BREAK: 1,
};

// Default Values
export const DEFAULTS = {
  LEAVE_BALANCE: {
    annual: 20,
    sick: 10,
    casual: 5,
  },
  PROFILE_PHOTO: "/default-avatar.png",
  PAGE_TITLE: "HRMS",
  COMPANY_NAME: "Your Company",
};

export default {
  API_ENDPOINTS,
  USER_ROLES,
  LEAVE_TYPES,
  LEAVE_TYPE_LABELS,
  LEAVE_STATUS,
  ATTENDANCE_STATUS,
  EMPLOYMENT_TYPES,
  EMPLOYMENT_TYPE_LABELS,
  EMPLOYEE_STATUS,
  REVIEW_TYPES,
  REVIEW_TYPE_LABELS,
  REVIEW_STATUS,
  GENDER,
  GENDER_LABELS,
  DEPARTMENTS,
  POSITIONS,
  PAGINATION,
  DATE_FORMATS,
  STATUS_COLORS,
  ALERT_TYPES,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION,
  FILE_UPLOAD,
  RATING_SCALE,
  WORKING_HOURS,
  DEFAULTS,
};
