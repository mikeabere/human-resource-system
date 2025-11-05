# HRMS Frontend Utils Documentation

Complete documentation for all utility functions, constants, validators, and custom hooks used in the HRMS frontend application.

## 📁 Utils Structure

```
src/utils/
├── constants.js      # Application constants and enums
├── helpers.js        # Helper functions
├── validators.js     # Form validation functions
└── hooks.js          # Custom React hooks
```

---

## 📋 constants.js

### API Endpoints
Pre-defined API endpoint paths for all services.

```javascript
import { API_ENDPOINTS } from './utils/constants';

// Usage
const url = API_ENDPOINTS.AUTH.LOGIN; // '/auth/login'
const userUrl = API_ENDPOINTS.USERS.DETAILS(userId); // '/users/123'
```

### User Roles
```javascript
USER_ROLES.ADMIN          // 'admin'
USER_ROLES.HR_MANAGER     // 'hr_manager'
USER_ROLES.EMPLOYEE       // 'employee'
```

### Leave Types
```javascript
LEAVE_TYPES.ANNUAL        // 'annual'
LEAVE_TYPES.SICK          // 'sick'
LEAVE_TYPES.CASUAL        // 'casual'
LEAVE_TYPE_LABELS.ANNUAL  // 'Annual Leave'
```

### Status Values
```javascript
LEAVE_STATUS.PENDING      // 'pending'
LEAVE_STATUS.APPROVED     // 'approved'
ATTENDANCE_STATUS.PRESENT // 'present'
EMPLOYEE_STATUS.ACTIVE    // 'active'
```

### Other Constants
- `DEPARTMENTS` - Common department names
- `POSITIONS` - Common job positions
- `PAGINATION` - Pagination defaults
- `VALIDATION` - Validation regex patterns
- `ERROR_MESSAGES` - Standard error messages
- `SUCCESS_MESSAGES` - Standard success messages

---

## 🛠️ helpers.js

### Date & Time Functions

#### formatDate(date, format)
Format date to readable string.
```javascript
formatDate('2024-01-15', 'short');  // 'Jan 15, 2024'
formatDate('2024-01-15', 'long');   // 'Monday, January 15, 2024'
formatDate('2024-01-15T10:30', 'datetime'); // 'Jan 15, 2024 10:30'
```

#### formatTime(time)
Format time to readable string.
```javascript
formatTime('2024-01-15T14:30:00'); // '2:30 PM'
```

#### calculateDays(startDate, endDate)
Calculate number of days between dates.
```javascript
calculateDays('2024-01-01', '2024-01-05'); // 5
```

#### calculateWorkHours(checkIn, checkOut)
Calculate work hours between times.
```javascript
calculateWorkHours('2024-01-15T09:00', '2024-01-15T17:00'); // 8.00
```

#### getRelativeTime(date)
Get relative time string.
```javascript
getRelativeTime(new Date(Date.now() - 3600000)); // '1 hours ago'
```

#### isToday(date)
Check if date is today.
```javascript
isToday(new Date()); // true
```

#### isPast(date) / isFuture(date)
Check if date is in past or future.

### String Functions

#### capitalize(str)
Capitalize first letter.
```javascript
capitalize('hello'); // 'Hello'
```

#### titleCase(str)
Capitalize each word.
```javascript
titleCase('hello world'); // 'Hello World'
```

#### truncate(str, length)
Truncate string to length.
```javascript
truncate('This is a long text', 10); // 'This is a...'
```

#### getInitials(name)
Get initials from name.
```javascript
getInitials('John Doe'); // 'JD'
```

### Currency Functions

#### formatCurrency(amount, currency)
Format currency.
```javascript
formatCurrency(1234.56); // '$1,234.56'
formatCurrency(1234.56, 'EUR'); // '€1,234.56'
```

### Status Functions

#### getStatusColor(status)
Get color for status badge.
```javascript
getStatusColor('approved'); // '#10b981'
getStatusColor('pending'); // '#f59e0b'
```

### Utility Functions

#### debounce(func, delay)
Debounce function execution.
```javascript
const debouncedSearch = debounce(handleSearch, 300);
```

#### throttle(func, limit)
Throttle function execution.
```javascript
const throttledScroll = throttle(handleScroll, 100);
```

#### deepClone(obj)
Deep clone an object.
```javascript
const cloned = deepClone(originalObject);
```

#### groupBy(array, key)
Group array by key.
```javascript
const grouped = groupBy(employees, 'department');
// { 'Engineering': [...], 'HR': [...] }
```

#### sortBy(array, key, order)
Sort array by key.
```javascript
const sorted = sortBy(employees, 'salary', 'desc');
```

#### searchArray(array, searchTerm, keys)
Search in array.
```javascript
const results = searchArray(employees, 'john', ['firstName', 'lastName']);
```

### Validation Functions

#### isValidEmail(email)
Check if valid email.
```javascript
isValidEmail('test@example.com'); // true
```

#### isValidPhone(phone)
Check if valid phone.
```javascript
isValidPhone('+1234567890'); // true
```

### File Functions

#### formatFileSize(bytes)
Format file size.
```javascript
formatFileSize(1048576); // '1 MB'
```

#### downloadFile(blob, filename)
Download file from blob.
```javascript
downloadFile(blob, 'report.pdf');
```

### Storage Functions

#### storage.get(key)
Get from localStorage.
```javascript
const user = storage.get('user');
```

#### storage.set(key, value)
Set to localStorage.
```javascript
storage.set('user', userData);
```

#### storage.remove(key)
Remove from localStorage.
```javascript
storage.remove('token');
```

---

## ✅ validators.js

### Individual Field Validators

#### validateEmail(email)
```javascript
const result = validateEmail('test@example.com');
// { isValid: true, error: null }
```

#### validatePassword(password)
```javascript
const result = validatePassword('pass123');
// { isValid: true, error: null }
```

#### validatePhone(phone)
```javascript
const result = validatePhone('+1234567890');
// { isValid: true, error: null }
```

#### validateName(name, fieldName)
```javascript
const result = validateName('John', 'First name');
// { isValid: true, error: null }
```

#### validateRequired(value, fieldName)
```javascript
const result = validateRequired('', 'Email');
// { isValid: false, error: 'Email is required' }
```

#### validateNumber(value, fieldName, options)
```javascript
const result = validateNumber(25, 'Age', { min: 18, max: 65 });
// { isValid: true, error: null }
```

#### validateDate(date, fieldName)
```javascript
const result = validateDate('2024-01-15', 'Start date');
// { isValid: true, error: null }
```

#### validateDateRange(startDate, endDate)
```javascript
const result = validateDateRange('2024-01-01', '2024-01-31');
// { isValid: true, error: null }
```

### Form Validators

#### validateEmployeeForm(formData)
Validate complete employee form.
```javascript
const errors = validateEmployeeForm({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  // ... other fields
});
// Returns object with field errors: { email: 'Error message' }
```

#### validateLeaveForm(formData)
Validate leave application form.
```javascript
const errors = validateLeaveForm({
  leaveType: 'annual',
  startDate: '2024-12-20',
  endDate: '2024-12-25',
  reason: 'Family vacation'
});
```

#### validateLoginForm(formData)
Validate login form.
```javascript
const errors = validateLoginForm({
  email: 'admin@hrms.com',
  password: 'admin123'
});
```

#### validatePasswordChangeForm(formData)
Validate password change form.
```javascript
const errors = validatePasswordChangeForm({
  currentPassword: 'old123',
  newPassword: 'new123',
  confirmPassword: 'new123'
});
```

### Generic Form Validator

#### validateForm(formData, rules)
Generic form validation with custom rules.
```javascript
const rules = {
  email: {
    required: true,
    type: 'email',
    label: 'Email Address'
  },
  age: {
    required: true,
    type: 'number',
    min: 18,
    max: 65,
    label: 'Age'
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[A-Za-z])(?=.*\d)/,
    message: 'Password must contain letters and numbers'
  }
};

const errors = validateForm(formData, rules);
```

### Helper Functions

#### hasErrors(errors)
Check if errors object has any errors.
```javascript
hasErrors({ email: 'Invalid email' }); // true
hasErrors({}); // false
```

#### getFirstError(errors)
Get first error message.
```javascript
getFirstError({ email: 'Invalid', password: 'Required' }); // 'Invalid'
```

---

## 🎣 hooks.js (Custom React Hooks)

### useForm
Manage form state with validation.
```javascript
const { 
  values, 
  errors, 
  handleChange, 
  handleBlur, 
  setFieldValue,
  resetForm 
} = useForm({
  email: '',
  password: ''
});

<input
  name="email"
  value={values.email}
  onChange={handleChange}
  onBlur={handleBlur}
/>
```

### useDebounce
Debounce a value.
```javascript
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 500);

useEffect(() => {
  // This runs 500ms after user stops typing
  fetchResults(debouncedSearch);
}, [debouncedSearch]);
```

### useLocalStorage
Sync state with localStorage.
```javascript
const [theme, setTheme] = useLocalStorage('theme', 'light');
```

### usePrevious
Get previous value.
```javascript
const [count, setCount] = useState(0);
const previousCount = usePrevious(count);
```

### useClickOutside
Detect clicks outside element.
```javascript
const ref = useClickOutside(() => {
  setIsOpen(false);
});

<div ref={ref}>
  {/* Modal content */}
</div>
```

### useWindowSize
Get window dimensions.
```javascript
const { width, height } = useWindowSize();

if (width < 768) {
  // Mobile view
}
```

### useMediaQuery
Match media query.
```javascript
const isMobile = useMediaQuery('(max-width: 768px)');
```

### useAsync
Handle async operations.
```javascript
const { execute, status, data, error, isLoading } = useAsync();

const loadData = async () => {
  await execute(() => fetchEmployees());
};
```

### usePagination
Manage pagination.
```javascript
const {
  currentPage,
  totalPages,
  goToPage,
  goToNextPage,
  goToPreviousPage,
  hasNextPage
} = usePagination(100, 10);
```

### useToggle
Toggle boolean state.
```javascript
const [isOpen, toggle, setTrue, setFalse] = useToggle(false);

<button onClick={toggle}>Toggle</button>
```

### useInterval
Run function at interval.
```javascript
useInterval(() => {
  // Runs every second
  checkUpdates();
}, 1000);
```

### useCopyToClipboard
Copy text to clipboard.
```javascript
const { isCopied, copy } = useCopyToClipboard();

<button onClick={() => copy('Text to copy')}>
  {isCopied ? 'Copied!' : 'Copy'}
</button>
```

### useOnlineStatus
Check online status.
```javascript
const isOnline = useOnlineStatus();

{!isOnline && <Alert>You are offline</Alert>}
```

### useArray
Manage array state.
```javascript
const { array, push, remove, update, clear } = useArray([]);

push(newItem);
remove(0);
update(1, updatedItem);
```

### useSearch
Search/filter array.
```javascript
const [searchTerm, setSearchTerm] = useState('');
const filteredEmployees = useSearch(
  employees, 
  searchTerm, 
  ['firstName', 'lastName', 'email']
);
```

### useSort
Sort array.
```javascript
const [sortKey, setSortKey] = useState('name');
const [sortOrder, setSortOrder] = useState('asc');
const sortedData = useSort(data, sortKey, sortOrder);
```

### useDocumentTitle
Set document title.
```javascript
useDocumentTitle('Dashboard - HRMS');
```

### useHover
Track hover state.
```javascript
const [hoverRef, isHovered] = useHover();

<div ref={hoverRef}>
  {isHovered ? 'Hovering!' : 'Not hovering'}
</div>
```

---

## 💡 Usage Examples

### Example 1: Form with Validation
```javascript
import { useForm } from './utils/hooks';
import { validateEmployeeForm } from './utils/validators';
import { capitalize } from './utils/helpers';

const EmployeeForm = () => {
  const { values, errors, handleChange, setErrors } = useForm({
    firstName: '',
    lastName: '',
    email: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateEmployeeForm(values);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Submit form
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="firstName"
        value={capitalize(values.firstName)}
        onChange={handleChange}
      />
      {errors.firstName && <span>{errors.firstName}</span>}
    </form>
  );
};
```

### Example 2: Search with Debounce
```javascript
import { useState, useEffect } from 'react';
import { useDebounce } from './utils/hooks';
import { searchArray } from './utils/helpers';

const EmployeeSearch = ({ employees }) => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [results, setResults] = useState(employees);

  useEffect(() => {
    const filtered = searchArray(
      employees, 
      debouncedSearch, 
      ['firstName', 'lastName', 'email']
    );
    setResults(filtered);
  }, [debouncedSearch, employees]);

  return (
    <div>
      <input 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search employees..."
      />
      {/* Display results */}
    </div>
  );
};
```

### Example 3: Date Formatting
```javascript
import { formatDate, getRelativeTime, isToday } from './utils/helpers';

const AttendanceItem = ({ attendance }) => {
  return (
    <div>
      <span>{formatDate(attendance.date, 'long')}</span>
      <span>{getRelativeTime(attendance.checkIn)}</span>
      {isToday(attendance.date) && <Badge>Today</Badge>}
    </div>
  );
};
```

---

## 🎯 Best Practices

1. **Always validate user input** before submitting forms
2. **Use debounce** for search and API calls
3. **Format dates and currency** consistently across the app
4. **Handle errors gracefully** with proper error messages
5. **Use custom hooks** to avoid code duplication
6. **Store non-sensitive data** in localStorage
7. **Validate both client and server side**

---

## 📚 Additional Resources

- React Hooks Documentation: https://react.dev/reference/react
- JavaScript Date: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
- Web Storage API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API

---

**Happy Coding! 🚀**