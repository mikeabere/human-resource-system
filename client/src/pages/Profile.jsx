import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Alert from "../components/common/Alert";
import Loader from "../components/common/Loader";
import { employeeService } from "../services/employeeService";
import { authService } from "../services/authService";
import "./Profile.css";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formData, setFormData] = useState({
    phone: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getMyProfile();
      setProfile(data.data);
      setFormData({ phone: data.data.phone || "" });
    } catch (error) {
      showAlert("error", "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await employeeService.updateMyProfile(formData);
      showAlert("success", "Profile updated successfully!");
      setEditMode(false);
      fetchProfile();
    } catch (error) {
      showAlert("error", "Failed to update profile");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showAlert("error", "Passwords do not match");
      return;
    }
    try {
      await authService.updatePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      showAlert("success", "Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      showAlert(
        "error",
        error.response?.data?.message || "Failed to update password"
      );
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <Card>
          <p className="text-center text-gray">No profile found.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>My Profile</h1>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="profile-grid">
        <Card
          title="Personal Information"
          actions={
            !editMode && (
              <Button size="small" onClick={() => setEditMode(true)}>
                Edit
              </Button>
            )
          }
        >
          {editMode ? (
            <form onSubmit={handleProfileUpdate}>
              <Input
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
              <div className="form-actions">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-row">
                <span className="info-label">Employee ID:</span>
                <span className="info-value">{profile.employeeId}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Name:</span>
                <span className="info-value">
                  {profile.firstName} {profile.lastName}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{profile.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Phone:</span>
                <span className="info-value">{profile.phone || "N/A"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Department:</span>
                <span className="info-value">{profile.department}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Position:</span>
                <span className="info-value">{profile.position}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Hire Date:</span>
                <span className="info-value">
                  {new Date(profile.hireDate).toLocaleDateString()}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Status:</span>
                <span className={`status-badge status-${profile.status}`}>
                  {profile.status}
                </span>
              </div>
            </div>
          )}
        </Card>

        <Card title="Change Password">
          <form onSubmit={handlePasswordUpdate}>
            <Input
              label="Current Password"
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />
            <Input
              label="New Password"
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
            <Button type="submit" fullWidth>
              Update Password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
