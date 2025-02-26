import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import Clients from "./pages/Clients";
import Tasks from "./pages/Tasks";
import Settings from "./pages/Settings";
import BmsHome from "./pages/BmsHome";
import NotFound from "./pages/NotFound";
import { getToken } from "./services/authService";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    setIsAuthenticated(!!getToken());
    // setIsAuthenticated(false); // for testing
    console.log("Authenticated:", isAuthenticated);

  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; 
  }
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<BmsHome />} />
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
              <Route path="*" element={<Navigate to="/" />} />
            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
