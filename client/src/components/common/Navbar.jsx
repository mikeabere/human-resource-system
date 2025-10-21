import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import "./Navbar.css";

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            ☰
          </button>
          <h1 className="navbar-title">HRMS</h1>
        </div>
        <div className="navbar-right">
          <div className="navbar-user">
            <span className="navbar-user-name">{user?.email}</span>
            <span className="navbar-user-role">{user?.role}</span>
          </div>
          <Button variant="ghost" size="small" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
