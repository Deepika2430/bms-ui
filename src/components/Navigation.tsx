import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ChevronRight,
  Home,
  FolderKanban,
  Users,
  CheckSquare,
  Settings,
  FileText,
  LogOut,
  User,
  Bell,
  Eye,
} from "lucide-react";
import { clearAuthToken } from "@/services/authService";
import { getUserDetails } from "@/services/userService";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationItem from "./NotificationItem";
import { getNotifications, updateNotification } from "@/services/notificationService";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

interface NavLink {
  path: string;
  label: string;
  icon: React.ElementType;
  action?: () => void; // Optional action for signout
  allowedRoles?: string[];
  subMenu?: { path: string; label: string }[];
}

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSignoutModal, setShowSignoutModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    const response = await getNotifications();
    console.log(response);
    setNotifications(response);
  };
  useEffect(() => {
    fetchNotifications(); // Initial fetch

    const interval = setInterval(() => {
      fetchNotifications();
    }, 60000); // Fetch every 60 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const unreadCount = notifications?.filter(n => !n.read).length;

  const handleMarkAsRead = async (id: string) => {
    setNotifications(
      notifications.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    const response = await updateNotification(id);
    console.log(response);
    fetchNotifications();
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    notifications.forEach(async n => {
      const response = await updateNotification(n.id);
      console.log(response);
    });
    fetchNotifications();
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserDetails();
        setUser(response);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
      }
      fetchUser();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignout = () => {
    setShowSignoutModal(true);
  };

  const handleProfile = () => {
    setShowProfileModal(true);
  };
  const confirmSignout = () => {
    setShowSignoutModal(false);
    clearAuthToken();
    navigate("/login"); // Redirect to login page
  };

  const links: NavLink[] = [
    {
      path: "/home",
      label: "Home",
      icon: Home,
      allowedRoles: ["admin", "manager", "consultant", "associate"],
    },
    {
      path: "/projects",
      label: "Projects",
      icon: FolderKanban,
      allowedRoles: ["admin", "manager"],
    },
    {
      path: "/clients",
      label: "Clients",
      icon: Users,
      allowedRoles: ["admin"],
    },
    {
      path: "/tasks",
      label: "Tasks",
      icon: CheckSquare,
      allowedRoles: ["admin", "manager", "consultant", "associate-consultant"],
    },
    {
      path: "/timesheet",
      label: "Timesheet",
      icon: Settings,
      allowedRoles: ["consultant", "associate-consultant"],
    },
    {
      path: "/my-timesheet",
      label: "Timesheet",
      icon: Settings,
      allowedRoles: ["manager"],
      subMenu: [
        {
          path: "/my-timesheet",
          label: "My Timesheet",
        },
        {
          path: "/manage-team-timesheet",
          label: "Manage Team Timesheet",
        },
      ],
    },
  ];

  const hasPermission = (roles: string[]) => {
    if (!user) {
      return false;
    }
    return roles.includes(user.role);
  };

  const filteredNavItems = links.filter((item) =>
    hasPermission(item.allowedRoles as any[])
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-lg" : ""
      }`}
    >
      <nav className="relative bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <div className="flex-shrink-0 w-12 h-8 bg-nav-accent rounded-lg flex items-center justify-center">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYR9OQLjpoVN2lnE14Lx20UtUKZ-V2gbcGYw&s"
                    alt="BMS"
                    className="object-contain object-fill"
                  />
                </div>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {filteredNavItems.map(({ path, label, icon: Icon, action, subMenu }) => {
                const isActive = location.pathname === path;

                if (subMenu) {
                  return (
                    <NavigationMenu key={path}>
                      <NavigationMenuList>
                        <NavigationMenuItem>
                          <NavigationMenuTrigger
                            className={`px-4 py-2 text-sm font-medium flex items-center space-x-2
                              ${isActive ? "bg-nav-accent/10 text-nav-accent" : "text-gray-600"}`}
                          >
                            <Icon className="h-4 w-4" />
                            <span>{label}</span>
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <ul className="grid w-[200px] gap-1 p-2">
                              {subMenu.map((item) => (
                                <li key={item.path}>
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start"
                                    onClick={() => navigate(item.path)}
                                  >
                                    {item.label}
                                  </Button>
                                </li>
                              ))}
                            </ul>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      </NavigationMenuList>
                    </NavigationMenu>
                  );
                }

                return (
                  <button
                    key={path}
                    onClick={action ? action : () => navigate(path)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2
                      ${
                        isActive
                          ? "bg-nav-accent/10 text-nav-accent"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </button>
                );
              })}
              {
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                          {unreadCount}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="end">
                    <div className="flex items-center justify-between p-3 border-b border-border bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      <h3 className="font-medium">Notifications</h3>
                      <Button variant="ghost" size="sm" className="text-xs h-8" onClick={()=> navigate("/notifications")}>View all</Button>
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-8"
                          onClick={handleMarkAllAsRead}
                        >
                          Mark all as read
                        </Button>
                      )}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {notifications.length > 0 ? (
                        <div className="divide-y divide-border">
                          {notifications?.map((notification) => (
                            <NotificationItem
                              key={notification.id}
                              notification={notification}
                              onRead={handleMarkAsRead}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          No notifications yet
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              }
              {
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full focus:outline-none border-none"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user?.avatar}
                          alt={user?.firstName || ""}
                        />
                        <AvatarFallback>
                          {user?.firstName?.charAt(0) +
                            user?.lastName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.firstName + " " + user?.lastName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignout}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              }
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Signout Confirmation Modal */}
      {showSignoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Are you sure you want to sign out?
            </h3>
            <div className="mt-4 flex justify-center space-x-4">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
                onClick={confirmSignout}
              >
                Ok
              </button>
              <button
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg"
                onClick={() => setShowSignoutModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;
