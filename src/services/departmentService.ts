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