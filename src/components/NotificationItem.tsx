
import { cn } from "@/lib/utils";
import { Bell, Calendar, CheckCircle } from "lucide-react";
import { format } from "date-fns";

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
  className?: string;
}

const NotificationItem = ({ notification, onRead, className }: NotificationItemProps) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task":
        return <CheckCircle className="h-5 w-5 text-primary" />;
      case "project":
        return <Calendar className="h-5 w-5 text-primary" />;
      default:
        return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  const formattedDate = format(new Date(notification.createdAt), "MMM d, h:mm a");

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-md transition-colors",
        !notification.read ? "bg-secondary/50" : "bg-transparent",
        className
      )}
    >
      <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium">{notification.title}</h4>
        <p className="text-xs text-muted-foreground mt-0.5">{(notification?.message).substring(0, 47) + "..."}</p>
        <span className="text-xs text-muted-foreground mt-1 block">{formattedDate}</span>
      </div>
      {!notification.read && (
        <button
          onClick={() => onRead(notification.id)}
          className="text-xs text-primary hover:underline"
        >
          Mark as read
        </button>
      )}
    </div>
  );
};

export default NotificationItem;
