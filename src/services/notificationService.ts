import { getToken } from "../utils/auth";
import config from "../config";

export const getClient = async (clientId) => {
    const token = getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/clients/${clientId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            redirect: "follow"
        });
        return response.json();
    }
    catch (error) {
        return error?.message;
    }
}