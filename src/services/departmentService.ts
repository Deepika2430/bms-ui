import config from "@/config";
import { Cookie } from "js-cookie";
import { transformKeysToCamelCase } from "@/utils/transformKeys";
import { getToken } from "./authService";

export const getDepartments = async () => {
    try {
        const response = await fetch(`${config.apiBaseUrl}/departments`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            }
        });

        const departments = await response.json();
        return transformKeysToCamelCase(departments);
    }
    catch (error) {
        console.log(error);
        return error?.message;
    }
}


export const getDepartmentUsers = async () => {
    const token = getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/departments/users`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return transformKeysToCamelCase(await response.json());
    } catch (error) {
        console.error("Error fetching department users:", error);
        throw error;
    }
}