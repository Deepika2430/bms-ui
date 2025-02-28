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