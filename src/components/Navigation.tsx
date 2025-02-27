import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronRight, Home, FolderKanban, Users, CheckSquare, Settings, FileText, LogOut } from "lucide-react";

interface NavLink {
  path: string;
  label: string;
  icon: React.ElementType;
}

const links: NavLink[] = [
  { path: "/home", label: "Home", icon: Home },
  { path: "/projects", label: "Projects", icon: FolderKanban },
  { path: "/clients", label: "Clients", icon: Users },
  { path: "/tasks", label: "Tasks", icon: CheckSquare },
  { path: "/reports", label: "Reports", icon: FileText },
  { path: "/settings", label: "Settings", icon: Settings },
  { path: "/signout", label: "Signout", icon: LogOut}
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const pathParts = location.pathname.split("/").filter(Boolean);
  const breadcrumbs = pathParts.map((part, index) => {
    const path = `/${pathParts.slice(0, index + 1).join("/")}`;
    return {
      label: part.charAt(0).toUpperCase() + part.slice(1),
      path,
    };
  });

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-lg" : ""
      }`}
    >
      <nav className="relative bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and brand */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <div className="flex-shrink-0 w-12 h-8 bg-nav-accent rounded-lg flex items-center justify-center">
                  {/* <span className="text-white font-bold text-xl">BMS</span> */}
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYR9OQLjpoVN2lnE14Lx20UtUKZ-V2gbcGYw&s" alt="BMS" className=" object-contain object-fill" />
                </div>
                <span className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                  {/* Business Management System */}  
                </span>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2
                      ${
                        isActive
                          ? "bg-nav-accent/10 text-nav-accent"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden rounded-lg p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Breadcrumbs */}
          <div className="py-2 text-sm flex items-center text-gray-500 dark:text-gray-400">
            <Link 
              to="/home" 
              className="flex items-center hover:text-nav-accent transition-colors"
            >
              <Home className="h-4 w-4" />
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex items-center">
                <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                <Link
                  to={crumb.path}
                  className={`hover:text-nav-accent transition-colors ${
                    index === breadcrumbs.length - 1
                      ? "text-nav-accent font-medium"
                      : ""
                  }`}
                >
                  {crumb.label}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0 invisible"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium transition-colors
                    ${
                      isActive
                        ? "bg-nav-accent/10 text-nav-accent"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;