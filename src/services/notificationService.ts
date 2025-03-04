import { getToken } from "./authService";
import config from "../config";

export const getNotifications = async () => {
    const token = getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/user/notifications`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            redirect: "follow"
        });
        const notifications= await response.json();
        return notifications.map((notification) => {
            const match = notification.message.match(/(.*)\s*\((.*?)\)$/);
            return {
                id: notification.id,
                title: match ? match[1].trim() : notification.message,
                message: match ? match[2].trim() : notification.message,
                type: "",
                read: notification.is_read,
                createdAt: notification.created_at,
            }
        })
    }
    catch (error) {
        return error?.message;
    }
}

export const getNotificationsHistory = async () => {
    const token = getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/user/notifications/history`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            redirect: "follow"
        });
        const notifications= await response.json();
        return notifications.map((notification) => {
            const match = notification.message.match(/(.*)\s*\((.*?)\)$/);
            return {
                id: notification.id,
                title: match ? match[1].trim() : notification.message,
                message: match ? match[2].trim() : notification.message,
                type: "",
                read: notification.is_read,
                createdAt: notification.created_at,
            }
        })
    }
    catch (error) {
        return error?.message;
    }
}

export const createNotification = async (userId: string, message: string) => {
    const token = getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/user/notification`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({user_id: userId, message}),
            redirect: "follow"
        });
        return await response.json();
    }
    catch (error) {
        return error?.message;
    }
}

export const updateNotification = async (id: string) => {
    const token = getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/user/notification/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            redirect: "follow"
        });
        return await response.json();
    }
    catch (error) {
        return error?.message;
    }
}

export const formatRelativeTime = (dateString: string): string => {
    console.log(dateString, "ku");
    const date = new Date(dateString.replace(' ', 'T')); // Parse the date string
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
    if (diffInSeconds < 60) {
      return 'just now';
    }
  
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }
  
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
  
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  