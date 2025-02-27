import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {clearAuthToken} from "@/services/authService"

const SignOut = () => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSignOut = () => {
    // Clear authentication data (Example: localStorage, session, tokens)
    clearAuthToken();

    // Redirect to login page after sign out
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={() => setShowConfirm(true)}
        className="px-6 py-3 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
      >
        Sign Out
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Are you sure you want to sign out?
            </h2>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignOut;
