import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { isAdmin, isHR } = useAuth();

  const menuItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: "📊",
      roles: ["admin", "hr_manager", "employee"],
    },
    {
      path: "/employees",
      label: "Employees",
      icon: "👥",
      roles: ["admin", "hr_manager"],
    },
    {
      path: "/attendance",
      label: "Attendance",
      icon: "📅",
      roles: ["admin", "hr_manager", "employee"],
    },
    {
      path: "/leaves",
      label: "Leaves",
      icon: "🏖️",
      roles: ["admin", "hr_manager", "employee"],
    },
    {
      path: "/performance",
      label: "Performance",
      icon: "⭐",
      roles: ["admin", "hr_manager", "employee"],
    },
    {
      path: "/profile",
      label: "My Profile",
      icon: "👤",
      roles: ["admin", "hr_manager", "employee"],
    },
  ];

  const { user } = useAuth();
  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-menu">
          {filteredMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "sidebar-item-active" : ""}`
              }
              onClick={closeSidebar}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
