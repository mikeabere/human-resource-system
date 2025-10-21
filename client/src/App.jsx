import { useState } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

function AppContent() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = location.pathname === "/login";
  const showLayout = isAuthenticated && !isLoginPage;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="app">
      {showLayout && <Navbar toggleSidebar={toggleSidebar} />}
      {showLayout && (
        <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
      )}
      <main className={showLayout ? "main-content" : "main-content-full"}>
        <AppRoutes />
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
