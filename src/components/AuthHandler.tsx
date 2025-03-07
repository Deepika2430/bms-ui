import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import HomeLayout from "../pages/Index";
import Projects from "../pages/Projects";
import Clients from "../pages/Clients";
import Tasks from "../pages/Tasks";
import ConsultantTasks from "./consultant/Tasks";
import Settings from "../pages/Settings";
import BmsHome from "../pages/BmsHome";
import Profile from "../pages/Profile";
import AuthForm from "../components/AuthForm";
import NotFound from "../pages/NotFound";
import { getToken, getRole } from "../services/authService";
import NotificationsHistory from "./notifications/NotificationHistory";
import MyTimesheet from "./timesheet/MyTimesheet";
import ManageTeamTimesheet from "./timesheet/ManageTeamTimesheet";
import OrganizationChart from "../pages/OrganizationChart";
import RegistrationForm from "@/pages/Registration";
import Analytics from "@/components/dashboard/Analytics";
import Users from "@/components/dashboard/Users";
import ThemeSettings from "@/components/dashboard/Settings";
import Dashboard from "@/components/dashboard/Dashboard";
import ConsultantDashboard from "@/components/consultant/Dashboard";

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
          <Route path="home" element={<HomeLayout />}>
            {role === "consultant" && (
              <Route path="dashboard" element={<ConsultantDashboard />} />
            )}
            {role === "admin" && (
            <>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="users" element={<Users />} />
            </>
            )}
            <Route path="settings" element={<ThemeSettings />} />
          </Route>
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<NotificationsHistory />} />
          <Route path="organization-chart" element={<OrganizationChart />} />
          {role === "admin" && (
            <>
              <Route path="projects" element={<Projects />} />
              <Route path="clients" element={<Clients />} />
              <Route path="settings" element={<Settings />} />
              <Route path="/register" element={<RegistrationForm />} />
            </>
          )}
          {role === "manager" && (
            <>
              <Route path="projects" element={<Projects />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="settings" element={<Settings />} />
              <Route path="/my-timesheet" element={<MyTimesheet />} />
              <Route path="/manage-team-timesheet" element={<ManageTeamTimesheet />} />
            </>
          )}
          {role === "consultant" && (
            <>
              <Route path="tasks" element={<ConsultantTasks />} />
              <Route path="/timesheet" element={<MyTimesheet />} />
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
