import config from "@/config";
import { getToken } from "./authService";
import { transformKeysToCamelCase } from "@/utils/transformKeys";

export const getUserHierarchy = async () => {
    const token = await getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/user/hierarchy`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        return transformKeysToCamelCase(data);
    } catch (error) {
        console.error("Error fetching user hierarchy:", error);
        throw error;
    }
};

export const getOrgChart = async (userId: string) => {
    const token = await getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/user/org-chart?user_id=${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
        const data = await response.json();
        return transformKeysToCamelCase(data);
    } catch (error) {
        console.error("Error fetching org chart:", error);
        throw error;
    }
}