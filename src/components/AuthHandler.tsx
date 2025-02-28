import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import Index from "../pages/Index";
import Projects from "../pages/Projects";
import Clients from "../pages/Clients";
import Tasks from "../pages/Tasks";
import ManagerTasks from "../components/managers/TaskList";
import Timesheet from "./consultant/TimeSheet";
import ConsultantTasks from "./consultant/Tasks";
import Settings from "../pages/Settings";
import BmsHome from "../pages/BmsHome";
import AuthForm from "../components/AuthForm";
import NotFound from "../pages/NotFound";
import { getToken, getRole } from "../services/authService";

const AuthHandler = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getToken());
  const [role, setRole] = useState<string | null>(getRole(getToken()));
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = () => {
      const token = getToken();
      setIsAuthenticated(!!token);

      if (token) {
        const userRole = getRole(token) || null; // Handle undefined role
        setRole(userRole);
        console.log("Role:", userRole);
        console.log("Authentication updated:", !!token);
        navigate("/home", { replace: true });
      } else {
        setRole(null);
        setIsAuthenticated(false);
      }
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<BmsHome />} />
      <Route path="/login" element={<AuthForm />} />

      {/* Protected Routes */}
      {isAuthenticated ? (
        <Route path="/" element={<Layout />}>
          <Route path="home" element={<Index />} />
          {role === "admin" && (
            <>
              <Route path="projects" element={<Projects />} />
              <Route path="clients" element={<Clients />} />
              <Route path="settings" element={<Settings />} />
            </>
          )}
          {role === "manager" && (
            <>
              <Route path="tasks" element={<ManagerTasks />} />
              <Route path="settings" element={<Settings />} />
            </>
          )}
          {role === "consultant" && (
            <>
              <Route path="tasks" element={<ConsultantTasks />} />
              <Route path="/timesheet" element={<Timesheet />} />
              <Route path="settings" element={<Settings />} />
            </>
          )}
          {["admin", "manager", "consultant", "associate-consultant"].includes(role ?? "") && (
            <Route path="tasks" element={<Tasks />} />
          )}
          <Route path="*" element={<NotFound />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/" replace />} />
      )}
    </Routes>
  );
};

export default AuthHandler;
