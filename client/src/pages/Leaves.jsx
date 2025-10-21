import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import Table from "../components/common/Table";
import Input, { Select, TextArea } from "../components/common/Input";
import Alert from "../components/common/Alert";
import Loader from "../components/common/Loader";
import { leaveService } from "../services/leaveService";
import "./Leaves.css";

const Leaves = () => {
  const { user, isAdmin, isHR } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  useEffect(() => {
    fetchLeaves();
    if (user.employee) {
      fetchLeaveBalance();
    }
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      let data;

      if (isAdmin || isHR) {
        data = await leaveService.getAllLeaves({ limit: 20 });
      } else {
        data = await leaveService.getMyLeaves({ limit: 20 });
      }

      setLeaves(data.data);
    } catch (error) {
      showAlert("error", "Failed to fetch leaves");
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveBalance = async () => {
    try {
      const data = await leaveService.getLeaveBalance();
      setLeaveBalance(data.data);
    } catch (error) {
      console.error("Failed to fetch leave balance");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await leaveService.applyLeave(formData);
      showAlert("success", "Leave application submitted successfully!");
      setShowModal(false);
      setFormData({ leaveType: "", startDate: "", endDate: "", reason: "" });
      fetchLeaves();
      fetchLeaveBalance();
    } catch (error) {
      showAlert(
        "error",
        error.response?.data?.message || "Failed to apply leave"
      );
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm("Are you sure you want to approve this leave?")) {
      try {
        await leaveService.approveLeave(id);
        showAlert("success", "Leave approved successfully!");
        fetchLeaves();
      } catch (error) {
        showAlert("error", "Failed to approve leave");
      }
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Enter rejection reason:");
    if (reason) {
      try {
        await leaveService.rejectLeave(id, reason);
        showAlert("success", "Leave rejected");
        fetchLeaves();
      } catch (error) {
        showAlert("error", "Failed to reject leave");
      }
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const leaveTypes = [
    { value: "annual", label: "Annual Leave" },
    { value: "sick", label: "Sick Leave" },
    { value: "casual", label: "Casual Leave" },
    { value: "maternity", label: "Maternity Leave" },
    { value: "paternity", label: "Paternity Leave" },
    { value: "unpaid", label: "Unpaid Leave" },
  ];

  const columns = [
    {
      header: "Leave Type",
      accessor: "leaveType",
      render: (value) => <span className="leave-type">{value}</span>,
    },
    {
      header: "Start Date",
      accessor: "startDate",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      header: "End Date",
      accessor: "endDate",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      header: "Days",
      accessor: "numberOfDays",
    },
    {
      header: "Status",
      accessor: "status",
      render: (value) => (
        <span className={`status-badge status-${value}`}>{value}</span>
      ),
    },
  ];

  if (isAdmin || isHR) {
    columns.unshift({
      header: "Employee",
      accessor: "employee",
      render: (value) => value?.firstName + " " + value?.lastName,
    });

    columns.push({
      header: "Actions",
      accessor: "_id",
      render: (value, row) =>
        row.status === "pending" && (
          <div className="action-buttons">
            <Button size="small" onClick={() => handleApprove(value)}>
              Approve
            </Button>
            <Button
              size="small"
              variant="danger"
              onClick={() => handleReject(value)}
            >
              Reject
            </Button>
          </div>
        ),
    });
  }

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="leaves-page">
      <div className="page-header">
        <h1>Leave Management</h1>
        {user.employee && (
          <Button onClick={() => setShowModal(true)}>Apply for Leave</Button>
        )}
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {leaveBalance && (
        <div className="leave-balance-cards">
          <Card className="balance-card">
            <div className="balance-content">
              <span className="balance-label">Annual Leave</span>
              <span className="balance-value">{leaveBalance.annual} days</span>
            </div>
          </Card>
          <Card className="balance-card">
            <div className="balance-content">
              <span className="balance-label">Sick Leave</span>
              <span className="balance-value">{leaveBalance.sick} days</span>
            </div>
          </Card>
          <Card className="balance-card">
            <div className="balance-content">
              <span className="balance-label">Casual Leave</span>
              <span className="balance-value">{leaveBalance.casual} days</span>
            </div>
          </Card>
        </div>
      )}

      <Card title="Leave Applications">
        <Table columns={columns} data={leaves} />
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Apply for Leave"
        size="medium"
      >
        <form onSubmit={handleSubmit}>
          <Select
            label="Leave Type"
            name="leaveType"
            value={formData.leaveType}
            onChange={handleInputChange}
            options={leaveTypes}
            required
          />

          <Input
            label="Start Date"
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            required
          />

          <Input
            label="End Date"
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            required
          />

          <TextArea
            label="Reason"
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            placeholder="Enter reason for leave"
            required
          />

          <div className="modal-actions">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Submit Application</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Leaves;
