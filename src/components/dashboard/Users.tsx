import React, { useState } from "react";

const usersData = [
  { id: 1, name: "Alice Johnson", role: "Admin" },
  { id: 2, name: "Bob Smith", role: "Editor" },
  { id: 3, name: "Charlie Brown", role: "Viewer" },
];

const Users: React.FC = () => {
  const [search, setSearch] = useState("");

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-4">👥 Users</h2>
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
        <div className="mb-4 flex justify-between">
          <h3 className="text-xl font-semibold">User List</h3>
          <input
            type="text"
            placeholder="Search users..."
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 text-black dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <table className="w-full border border-gray-200 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {usersData
              .filter((user) => user.name.toLowerCase().includes(search.toLowerCase()))
              .map((user) => (
                <tr key={user.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.role}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
