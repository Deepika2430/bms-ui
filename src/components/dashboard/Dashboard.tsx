import React, { useState } from "react";

const Dashboard: React.FC = () => {
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
