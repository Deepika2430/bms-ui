import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  BellDot, 
  MessageCircle,
  Check,
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getNotificationsHistory, updateNotification } from '@/services/notificationService';
import { formatRelativeTime } from '@/services/notificationService';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: Date;
}

const NotificationsHistory: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const { toast } = useToast();

  const fetchNotifications = async () => {
    const response = await getNotificationsHistory();
    console.log(response);
    setNotifications(response);
  };
  useEffect(() => {
    // Fetch notifications
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    const response = await updateNotification(id);
    console.log(response);
    fetchNotifications();
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
    });
  };

  const handleMarkAllAsRead = () => {
    notifications.forEach(async n => {
        const response = await updateNotification(n.id);
        console.log(response);
      });
      fetchNotifications();
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read.",
      variant: "default",
    });
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'info':
        return <Bell className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <BellDot className="h-5 w-5 text-amber-500" />;
      case 'error':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <MessageCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.read === false);

  const unreadCount = notifications.filter(n => n.read === false).length;

  return (
    <div className="max-w-4xl mx-auto mt-20 dark:bg-gray-800 rounded-lg border overflow-hidden">
      {/* <div className="px-4 py-4 flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-500 text-white"> */}
      <div className="px-4 py-4 flex items-center justify-between bg-nav-accent text-white ">
        <div className="flex items-center gap-2 ">
          <Bell className="h-5 w-5" />
          <h2 className="font-semibold text-2xl">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-medium rounded-full px-2 py-0.5">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleMarkAllAsRead}
            className="text-xs hover:bg-white/10"
          >
            Mark all as read
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveTab(value as 'all' | 'unread')}>
        <div className="px-0">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          <NotificationList 
            notifications={filteredNotifications}
            onMarkAsRead={handleMarkAsRead}
            getNotificationIcon={getNotificationIcon}
          />
        </TabsContent>

        <TabsContent value="unread" className="mt-0">
          <NotificationList 
            notifications={filteredNotifications}
            onMarkAsRead={handleMarkAsRead}
            getNotificationIcon={getNotificationIcon}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  getNotificationIcon: (type: NotificationType) => React.ReactNode;
}

const NotificationList: React.FC<NotificationListProps> = ({ 
  notifications, 
  onMarkAsRead,
  getNotificationIcon
}) => {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <Bell className="h-12 w-12 text-muted-foreground/50 mb-3" />
        <p className="text-muted-foreground">No notifications to display</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border max-h-96 overflow-y-auto scrollbar-thin">
      {notifications.map((notification) => (
        <div 
          key={notification.id}
          className={cn(
            "p-4 hover:bg-accent/50 transition-colors duration-200",
            notification.read === true && "bg-gray-100 dark:bg-yellow-700"
          )}
        >
          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-1">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <p className={cn(
                  "text-sm font-medium",
                  notification.read === false && "font-semibold"
                )}>
                  {notification.title}
                </p>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                  {formatRelativeTime(notification?.createdAt ?? "")}
                  {/* {notification?.createdAt } */}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {notification.message}
              </p>
              {notification.read === false && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2 h-8 text-xs text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-700 px-2"
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  Mark as read
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationsHistory;
