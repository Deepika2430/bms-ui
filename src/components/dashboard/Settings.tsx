import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);

  const handleSave = () => {
    setTheme(selectedTheme);
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-4">⚙️ Settings</h2>
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
        
        {/* Theme Selection */}
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Appearance</h3>
          <div className="flex items-center justify-between">
            <span>Theme</span>
            <select
              className="px-3 py-2 border rounded-md dark:text-gray-white dark:border-gray-700 dark:bg-gray-700"
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value as "Light" | "Dark" | "System")}
            >
              <option value="Light">Light</option>
              <option value="Dark">Dark</option>
              <option value="System">System Default</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Settings;
