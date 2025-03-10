import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { getProjects } from "@/services/projectService";
import { getClients } from "@/services/clientService";
import { getTasks } from "@/services/taskService";

const Dashboard: React.FC = () => {
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState([]);
  const [tasks, setTasks] = useState([]);

  const defaultStats = [
    {
      title: "Total Projects",
      value: 0,
      color: "bg-blue-500",
    },
    { title: "Completed Tasks", value: 0, color: "bg-green-500" },
    { title: "Active Clients", value: 0, color: "bg-yellow-500" },
    { title: "Upcoming Deadlines", value: 0, color: "bg-red-500" },
  ];

  const fetchProjects = async () => {
    try {
      const response = await getProjects();
      setProjects(response);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
      toast.error("Failed to load projects");
    }
  };

  const fetchClients = async () => {
    try {
      const response = await getClients();
      console.log(response);
      setClients(response);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setClients([]);
      toast.error("Failed to load clients");
    }
  };

  const fetchTasks = async () => {
      try {
        const tasksData = await getTasks();
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Failed to refresh tasks");
      }
    };

  const getStats = () => {
    return [
      {
        title: "Active Projects",
        value: projects.filter((p) => p.status === "active").length,
        color: "bg-blue-500",
      },
      { title: "Completed Tasks", value: tasks.filter((t) => t.status === "completed").length, color: "bg-green-500" },
      {
        title: "Active Clients",
        value: clients.filter((c) => c.isActive === true).length,
        color: "bg-yellow-500",
      },
      {
        title: "Near Deadlines",
        value: projects.filter((p) => {
          const today = new Date();
          const endDate = new Date(p?.poEndDate);
          const oneWeekFromNow = new Date();
          oneWeekFromNow.setDate(today.getDate() + 7);
          return p?.poEndDate && endDate > today && endDate <= oneWeekFromNow;
        }).length,
        color: "bg-orange-500",
      },
    ];
  };

  useEffect(() => {
    fetchProjects();
    fetchClients();
    fetchTasks();
  }, []);

  useEffect(() => {
    setStats(getStats());
  }, [projects, clients]);

  return (
    <div className="overflow-y-auto h-full">
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
                p?.projectName?.toLowerCase().includes(search.toLowerCase())
              )
              .sort((a, b) => new Date(a.poEndDate).getTime() - new Date(b.poEndDate).getTime()) // Sort by poEndDate
              .map((p) => (
                <tr
                  key={p?.id}
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  <td className="px-4 py-3">{p.projectName}</td>
                  <td className="px-4 py-3">{getStatusBadge(p.status)}</td>
                  <td className="px-4 py-3">
                    {format(new Date(p.poEndDate), "MMM d, yyyy")}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const getStatusBadge = (status: string) => {
  const statusColors: Record<string, string> = {
    active:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100",
    inactive:
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
