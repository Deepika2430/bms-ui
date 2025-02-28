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
            return {
                id: notification.id,
                title: notification.message,
                message: notification.message,
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
            return {
                id: notification.id,
                title: notification.message,
                message: notification.message,
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
