import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, BarChart3Icon, UsersIcon, SettingsIcon } from "lucide-react";
import { getRole, getToken } from "@/services/authService";

const HomeLayout: React.FC = () => {
  const [role, setRole] = useState<string>("consultant");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = getToken();
    if (token) {
      const userRole = getRole(token) ?? "consultant";
      setRole(userRole);
      if (location.pathname === "/home") {
        navigate("/home/dashboard");
      }
    }
  }, [navigate, location.pathname]);

  const sidebarLinks = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/home/dashboard",
      allowedRoles: ["admin",],
    },
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/home/dashboard",
      allowedRoles: ["manager", "consultant", "associate-consultant"],
    },
    {
      name: "Analytics",
      icon: <BarChart3Icon size={20} />,
      path: "/home/analytics",
      allowedRoles: ["admin", "manager"],
    },
    {
      name: "Users",
      icon: <UsersIcon size={20} />,
      path: "/home/users",
      allowedRoles: ["admin",],
    },
    {
      name: "Appearance",
      icon: <SettingsIcon size={20} />,
      path: "/home/settings",
      allowedRoles: ["admin", "manager", "consultant", "associate-consultant"],
    },
  ];

  const hasPermission = (roles: string[]) => {
    if (!role) {
      return false;
    }
    return roles.includes(role);
  };

  const filteredSidebarItems = sidebarLinks.filter((item) =>
    hasPermission(item.allowedRoles as any[])
  );

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md p-5 fixed h-full pt-20">
        <h1 className="text-1xl font-bold mb-6">📊 {role.charAt(0).toUpperCase() + role.substring(1).toLowerCase()}  Panel</h1>
        <nav>
          {filteredSidebarItems.map((link) => (
            <button
              key={link.name}
              onClick={() => navigate(link.path)}
              className={`flex items-center w-full p-3 mb-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 ${
                location.pathname === link.path ? "bg-gray-200 dark:bg-gray-700" : ""
              }`}
            >
              {link.icon}
              <span className="ml-3">{link.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-3 bg-white overflow-y-auto ml-64 pt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default HomeLayout;
