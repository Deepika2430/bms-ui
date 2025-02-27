import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import Index from "../pages/Index";
import Projects from "../pages/Projects";
import Clients from "../pages/Clients";
import Tasks from "../pages/Tasks";
import Settings from "../pages/Settings";
import BmsHome from "../pages/BmsHome";
import NotFound from "../pages/NotFound";
import SignOut from "./Signout";
import { getToken } from "../services/authService";

const AuthHandler = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getToken());
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = () => {
      const token = getToken();
      setIsAuthenticated(!!token);
      console.log("Authentication updated:", !!token);
      
      if (token) {
        navigate("/home", { replace: true });
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
      <Route path="/signout" element={<SignOut />} />

      {/* Protected Routes */}
      {isAuthenticated ? (
        <Route path="/" element={<Layout />}>
          <Route path="home" element={<Index />} />
          <Route path="projects" element={<Projects />} />
          <Route path="clients" element={<Clients />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/" replace />} />
      )}
    </Routes>
  );
};

export default AuthHandler;
