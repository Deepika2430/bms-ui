
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

interface NavLink {
  path: string;
  label: string;
}

const links: NavLink[] = [
  { path: "/", label: "Home" },
  { path: "/projects", label: "Projects" },
  { path: "/clients", label: "Clients" },
  { path: "/tasks", label: "Tasks" },
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
        scrolled ? "shadow-md" : ""
      }`}
    >
      <nav className="relative bg-nav/95 backdrop-blur-nav border-b border-gray-200/20 animate-nav-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo placeholder */}
            <div className="flex-shrink-0 w-10 h-10 bg-nav-accent/10 rounded-md">{<img src="https://tecnics.com/wp-content/uploads/2020/03/logo1.png"/>}</div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-nav-foreground text-sm font-medium transition-colors hover:text-nav-accent
                    ${location.pathname === link.path ? "text-nav-accent" : ""}
                    group`}
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 h-0.5 bg-nav-accent transform origin-left scale-x-0 transition-transform group-hover:scale-x-100"></span>
                </Link>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden rounded-md p-2 text-nav-foreground hover:bg-nav-accent/10 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Breadcrumbs */}
          <div className="py-2 text-sm">
            <Link to="/" className="text-nav-muted hover:text-nav-accent transition-colors">
              Home
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.path}>
                <span className="mx-2 text-nav-muted">/</span>
                <Link
                  to={crumb.path}
                  className={`${
                    index === breadcrumbs.length - 1
                      ? "text-nav-accent"
                      : "text-nav-muted hover:text-nav-accent"
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
                      ? "text-nav-accent bg-nav-accent/10"
                      : "text-nav-foreground hover:text-nav-accent hover:bg-nav-accent/5"
                  }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
