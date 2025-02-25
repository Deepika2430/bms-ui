import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, Briefcase, Users, ClipboardList } from "lucide-react";

interface NavLink {
  path: string;
  label: string;
  icon: JSX.Element;
}

const links: NavLink[] = [
  { path: "/", label: "Home", icon: <Home className="mr-2 h-4 w-4" /> },
  { path: "/projects", label: "Projects", icon: <Briefcase className="mr-2 h-4 w-4" /> },
  { path: "/clients", label: "Clients", icon: <Users className="mr-2 h-4 w-4" /> },
  { path: "/tasks", label: "Tasks", icon: <ClipboardList className="mr-2 h-4 w-4" /> },
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
        scrolled ? "shadow-md bg-gradient-to-r from-blue-600 to-indigo-600" : "bg-gradient-to-r from-blue-800 to-indigo-800"
      }`}
    >
      <nav className="relative bg-nav/95 backdrop-blur-nav border-b border-gray-200/20 animate-nav-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo placeholder */}
            <div className="flex-shrink-0 w-10 h-10 bg-nav-accent/10 rounded-md align-middle">
              <img src="https://tecnics.com/wp-content/uploads/2020/03/logo1.png" alt="Logo" className="align-middle object-contain" />
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center text-gray-500 text-sm font-medium transition-colors hover:text-gray-900
                    ${location.pathname === link.path ? "text-gray-900 font-semibold" : ""}
                    group`}
                >
                  {link.icon}
                  {link.label}
                  <span className="absolute bottom-0 left-0 h-0.5 bg-gray-300 transform origin-left scale-x-0 transition-transform group-hover:scale-x-100"></span>
                </Link>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden rounded-md p-2 text-white hover:bg-gray-300/10 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Breadcrumbs */}
          <div className="py-2 text-sm ">
            <Link to="/" className={`hover:text-blue-900 transition-colors ${breadcrumbs.length === 0 ? "font-semibold" : "text-red-500"}`}>
              Home
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <span className="text-gray-900" key={crumb.path}>
                <span className="mx-2">/</span>
                <Link
                  to={crumb.path}
                  className={`${
                    index === breadcrumbs.length - 1
                      ? "text-gray-900 font-semibold"
                      : "hover:text-gray-900"
                  } transition-colors`}
                >
                  {crumb.label}
                </Link>
              </span>
            ))}
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0 invisible"
          }`}
        >
          <div className="px-4 pt-2 pb-3 space-y-1 bg-nav/95 backdrop-blur-nav border-t border-gray-200/20">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors
                  ${
                    location.pathname === link.path
                      ? "bg-gray-700 text-white"
                      : "text-white hover:text-gray-300 hover:bg-gray-300/5"
                  }`}
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center">
                  {link.icon}
                  {link.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
