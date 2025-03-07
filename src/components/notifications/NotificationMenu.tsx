import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell } from "lucide-react";
import NotificationItem from "./NotificationItem";
import { getNotifications, updateNotification } from "@/services/notificationService";
import { useNavigate } from "react-router-dom";

const NotificationMenu = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    const response = await getNotifications();
    setNotifications(response);
  };

  useEffect(() => {
    fetchNotifications(); // Initial fetch

    const interval = setInterval(() => {
      fetchNotifications();
    }, 60000); // Fetch every 60 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const unreadCount = notifications?.length > 0 ? notifications?.filter((n) => !n.read)?.length : 0;

  const handleMarkAsRead = async (id: string) => {
    setNotifications(
      notifications?.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    await updateNotification(id);
    fetchNotifications();
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications?.map((n) => ({ ...n, read: true })));
    notifications?.forEach(async (n) => {
      await updateNotification(n.id);
    });
    fetchNotifications();
  };

  return (
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
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-8"
            onClick={() => navigate("/notifications")}
          >
            View all
          </Button>
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
          {notifications?.length > 0 ? (
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
  );
};

export default NotificationMenu;
