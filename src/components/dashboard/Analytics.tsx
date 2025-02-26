import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const analyticsData = [
  { name: "Jan", users: 200 },
  { name: "Feb", users: 450 },
  { name: "Mar", users: 300 },
  { name: "Apr", users: 500 },
  { name: "May", users: 600 },
];

const Analytics: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-semibold mb-4">📊 Analytics</h2>
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-3">User Activity Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analyticsData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="users" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
