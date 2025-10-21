import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Card from "../components/common/Card";
import Loader from "../components/common/Loader";
import { employeeService } from "../services/employeeService";
import { attendanceService } from "../services/attendanceService";
import "./Dashboard.css";

const Dashboard = () => {
  const { user, isAdmin, isHR } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendanceToday, setAttendanceToday] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      if (isAdmin || isHR) {
        const statsData = await employeeService.getStats();
        setStats(statsData.data);
      }

      // Get today's attendance for employee
      if (user.employee) {
        const today = new Date().toISOString().split("T")[0];
        const attendanceData = await attendanceService.getMyAttendance({
          startDate: today,
          endDate: today,
        });
        if (attendanceData.data && attendanceData.data.length > 0) {
          setAttendanceToday(attendanceData.data[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.email}!</p>
      </div>

      {(isAdmin || isHR) && stats && (
        <div className="dashboard-stats">
          <Card className="stat-card stat-card-primary">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>{stats.totalEmployees}</h3>
              <p>Total Employees</p>
            </div>
          </Card>

          <Card className="stat-card stat-card-success">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{stats.departmentStats?.length || 0}</h3>
              <p>Departments</p>
            </div>
          </Card>

          <Card className="stat-card stat-card-warning">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3>{stats.positionStats?.length || 0}</h3>
              <p>Positions</p>
            </div>
          </Card>
        </div>
      )}

      <div className="dashboard-grid">
        {attendanceToday ? (
          <Card title="Today's Attendance">
            <div className="attendance-info">
              <div className="attendance-row">
                <span className="attendance-label">Check In:</span>
                <span className="attendance-value">
                  {new Date(attendanceToday.checkIn).toLocaleTimeString()}
                </span>
              </div>
              {attendanceToday.checkOut && (
                <>
                  <div className="attendance-row">
                    <span className="attendance-label">Check Out:</span>
                    <span className="attendance-value">
                      {new Date(attendanceToday.checkOut).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="attendance-row">
                    <span className="attendance-label">Work Hours:</span>
                    <span className="attendance-value">
                      {attendanceToday.workHours} hours
                    </span>
                  </div>
                </>
              )}
            </div>
          </Card>
        ) : (
          user.employee && (
            <Card title="Attendance">
              <p className="text-gray">You haven't checked in today yet.</p>
            </Card>
          )
        )}

        <Card title="Quick Links">
          <div className="quick-links">
            <a href="/attendance" className="quick-link">
              📅 Attendance
            </a>
            <a href="/leaves" className="quick-link">
              🏖️ Leave Management
            </a>
            <a href="/performance" className="quick-link">
              ⭐ Performance
            </a>
            <a href="/profile" className="quick-link">
              👤 My Profile
            </a>
          </div>
        </Card>
      </div>

      {(isAdmin || isHR) && stats?.departmentStats && (
        <Card title="Department Distribution">
          <div className="department-list">
            {stats.departmentStats.map((dept, index) => (
              <div key={index} className="department-item">
                <span className="department-name">{dept._id}</span>
                <span className="department-count">{dept.count} employees</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
