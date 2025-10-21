import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Table from "../components/common/Table";
import Alert from "../components/common/Alert";
import Loader from "../components/common/Loader";
import { attendanceService } from "../services/attendanceService";
import "./Attendance.css";

const Attendance = () => {
  const { user, isAdmin, isHR } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedInToday, setCheckedInToday] = useState(false);
  const [checkedOutToday, setCheckedOutToday] = useState(false);
  const [alert, setAlert] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      let data;

      if (isAdmin || isHR) {
        data = await attendanceService.getAllAttendance({ limit: 20 });
      } else {
        data = await attendanceService.getMyAttendance({ limit: 20 });
      }

      setAttendance(data.data);

      // Check if already checked in today
      if (user.employee && data.data.length > 0) {
        const today = new Date().toDateString();
        const todayRecord = data.data.find(
          (record) => new Date(record.date).toDateString() === today
        );
        if (todayRecord) {
          setCheckedInToday(true);
          setCheckedOutToday(!!todayRecord.checkOut);
        }
      }
    } catch (error) {
      showAlert("error", "Failed to fetch attendance records");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      await attendanceService.checkIn();
      showAlert("success", "Checked in successfully!");
      setCheckedInToday(true);
      fetchAttendance();
    } catch (error) {
      showAlert("error", error.response?.data?.message || "Failed to check in");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      await attendanceService.checkOut();
      showAlert("success", "Checked out successfully!");
      setCheckedOutToday(true);
      fetchAttendance();
    } catch (error) {
      showAlert(
        "error",
        error.response?.data?.message || "Failed to check out"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const columns = [
    {
      header: "Date",
      accessor: "date",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      header: "Check In",
      accessor: "checkIn",
      render: (value) => new Date(value).toLocaleTimeString(),
    },
    {
      header: "Check Out",
      accessor: "checkOut",
      render: (value) => (value ? new Date(value).toLocaleTimeString() : "-"),
    },
    {
      header: "Work Hours",
      accessor: "workHours",
      render: (value) => (value ? `${value} hrs` : "-"),
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
  }

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="attendance-page">
      <div className="page-header">
        <h1>Attendance Management</h1>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {user.employee && (
        <Card title="Quick Actions">
          <div className="attendance-actions">
            {!checkedInToday ? (
              <Button onClick={handleCheckIn} loading={actionLoading}>
                Check In
              </Button>
            ) : !checkedOutToday ? (
              <Button
                onClick={handleCheckOut}
                variant="secondary"
                loading={actionLoading}
              >
                Check Out
              </Button>
            ) : (
              <p className="text-gray">
                You have already checked out for today.
              </p>
            )}
          </div>
        </Card>
      )}

      <Card title="Attendance Records">
        <Table columns={columns} data={attendance} />
      </Card>
    </div>
  );
};

export default Attendance;
