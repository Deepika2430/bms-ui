import config from "@/config";
import { Cookie } from "js-cookie";
import { transformKeysToCamelCase } from "@/utils/transformKeys";
import { getToken } from "./authService";
import { getUserIdFromToken } from "@/utils/decodeToken";

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
    const userId = getUserIdFromToken(token);
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
        let data = await response.json();
        const updatedData = data?.employee_details?.filter((employee: any) => {
            if (employee?.user_id !== userId) return employee;
        });
        data.employee_details = updatedData;
        return transformKeysToCamelCase(data);
    } catch (error) {
        console.error("Error fetching department users:", error);
        throw error;
    }
}