import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen pt-32 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl font-bold text-nav-foreground mb-6">404</h1>
        <p className="text-nav-muted text-xl mb-8">
          The page you're looking for doesn't exist.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate(-1)} // Navigate back
            className="px-6 py-3 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
          >
            Go Back
          </button>
          <a
            href="/"
            className="px-6 py-3 rounded-md bg-nav-accent/10 text-nav-accent hover:bg-nav-accent/20 transition-colors"
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
