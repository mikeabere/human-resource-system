import { useState, useEffect } from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import Table from "../components/common/Table";
import Input, { Select } from "../components/common/Input";
import Alert from "../components/common/Alert";
import Loader from "../components/common/Loader";
import { employeeService } from "../services/employeeService";
import "./Employees.css";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    employeeId:"",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    department: "",
    position: "",
    salary: "",
    hireDate: "",
    employmentType: "full-time",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getEmployees({ limit: 50 });
      setEmployees(data.data);
    } catch (error) {
      showAlert("error", "Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await employeeService.updateEmployee(selectedEmployee._id, formData);
        showAlert("success", "Employee updated successfully!");
      } else {
        await employeeService.createEmployee(formData);
        showAlert("success", "Employee created successfully!");
      }
      setShowModal(false);
      resetForm();
      fetchEmployees();
    } catch (error) {
      showAlert("error", error.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setFormData({
      employeeId:employee.employeeId,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      dateOfBirth: employee.dateOfBirth?.split("T")[0] || "",
      gender: employee.gender || "",
      department: employee.department,
      position: employee.position,
      salary: employee.salary,
      hireDate: employee.hireDate?.split("T")[0] || "",
      employmentType: employee.employmentType,
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await employeeService.deleteEmployee(id);
        showAlert("success", "Employee deleted successfully!");
        fetchEmployees();
      } catch (error) {
        showAlert("error", "Failed to delete employee");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      employeeId: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      department: "",
      position: "",
      salary: "",
      hireDate: "",
      employmentType: "full-time",
    });
    setEditMode(false);
    setSelectedEmployee(null);
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const employmentTypeOptions = [
    { value: "full-time", label: "Full Time" },
    { value: "part-time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "intern", label: "Intern" },
  ];

  const columns = [
    {
      header: "Employee ID",
      accessor: "employeeId",
    },
    {
      header: "Name",
      accessor: "firstName",
      render: (value, row) => `${row.firstName} ${row.lastName}`,
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Department",
      accessor: "department",
    },
    {
      header: "Position",
      accessor: "position",
    },
    {
      header: "Status",
      accessor: "status",
      render: (value) => (
        <span className={`status-badge status-${value}`}>{value}</span>
      ),
    },
    {
      header: "Actions",
      accessor: "_id",
      render: (value, row) => (
        <div className="action-buttons">
          <Button size="small" onClick={() => handleEdit(row)}>
            Edit
          </Button>
          <Button
            size="small"
            variant="danger"
            onClick={() => handleDelete(value)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="employees-page">
      <div className="page-header">
        <h1>Employee Management</h1>
        <Button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          Add Employee
        </Button>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <Card title="Employees List">
        <Table columns={columns} data={employees} />
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editMode ? "Edit Employee" : "Add New Employee"}
        size="large"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <Input
              label="Employee Id"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleInputChange}
              required
            />

            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />

            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            <Input
              label="Phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />

            <Input
              label="Date of Birth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
            />

            <Select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              options={genderOptions}
            />

            <Input
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              required
            />

            <Input
              label="Position"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              required
            />

            <Input
              label="Salary"
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleInputChange}
              required
            />

            <Input
              label="Hire Date"
              type="date"
              name="hireDate"
              value={formData.hireDate}
              onChange={handleInputChange}
              required
            />

            <Select
              label="Employment Type"
              name="employmentType"
              value={formData.employmentType}
              onChange={handleInputChange}
              options={employmentTypeOptions}
              required
            />
          </div>

          <div className="modal-actions">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editMode ? "Update Employee" : "Create Employee"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Employees;
