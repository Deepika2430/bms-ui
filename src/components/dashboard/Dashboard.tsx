import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Analytics from "./Analytics";
import Users from "./Users";
import Settings from "./Settings";
import { HomeIcon, BarChart3Icon, UsersIcon, SettingsIcon, LayoutDashboard } from "lucide-react";
import ConsultantDashboard from "@/components/consultant/Dashboard";
import { getRole, getToken } from "@/services/authService";

const Dashboard: React.FC = () => {
  const [search, setSearch] = useState("");
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
      allowedRoles: ["admin", "manager", "consultant", "associate-consultant"],
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
      allowedRoles: ["admin", "manager"],
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
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md p-5 fixed h-full">
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
      <main className="flex-1 p-3 bg-white overflow-y-auto ml-64">
        <Routes>
          <Route path="dashboard" element={<DashboardContent />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
};

const DashboardContent: React.FC = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="overflow-y-auto h-full">
      {/* <h2 className="text-3xl font-semibold mb-4">
        Welcome to Your Dashboard 🚀
      </h2> */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className={`p-5 rounded-lg text-white shadow-md ${stat.color}`}
          >
            <h3 className="text-lg">{stat.title}</h3>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Project Table */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-semibold">Project List</h3>
          <input
            type="text"
            placeholder="Search..."
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <table className="w-full border border-gray-200 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Project</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Deadline</th>
            </tr>
          </thead>
          <tbody>
            {projects
              .filter((p) =>
                p.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3">{getStatusBadge(p.status)}</td>
                  <td className="px-4 py-3">{p.deadline}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const stats = [
  { title: "Active Projects", value: "24", color: "bg-blue-500" },
  { title: "Completed Tasks", value: "134", color: "bg-green-500" },
  { title: "Team Members", value: "18", color: "bg-yellow-500" },
  { title: "Upcoming Deadlines", value: "7", color: "bg-red-500" },
];

const barChartData = [
  { name: "Jan", projects: 5 },
  { name: "Feb", projects: 8 },
  { name: "Mar", projects: 6 },
  { name: "Apr", projects: 10 },
  { name: "May", projects: 12 },
];

const pieChartData = [
  { name: "Completed", value: 65, color: "#4CAF50" },
  { name: "In Progress", value: 25, color: "#FFC107" },
  { name: "Pending", value: 10, color: "#F44336" },
];

const projects = [
  {
    id: 1,
    name: "Website Redesign",
    status: "In Progress",
    deadline: "2025-03-15",
  },
  {
    id: 2,
    name: "Mobile App Launch",
    status: "Completed",
    deadline: "2025-02-10",
  },
  {
    id: 3,
    name: "Marketing Campaign",
    status: "Pending",
    deadline: "2025-04-05",
  },
];

const getStatusBadge = (status: string) => {
  const statusColors: Record<string, string> = {
    "In Progress":
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100",
    Completed:
      "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100",
    Pending: "bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100",
  };

  return (
    <span className={`px-3 py-1 text-sm rounded-full ${statusColors[status]}`}>
      {status}
    </span>
  );
};

export default Dashboard;
