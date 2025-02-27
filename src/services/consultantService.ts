import config from "@/config";
import { Cookie } from "js-cookie";
import { transformKeysToCamelCase } from "@/utils/transformKeys";
import { getToken } from "./authService";

export const getConsultants = async () => {
    try {
        const response = await fetch(`${config.apiBaseUrl}/consultant`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            }
        });

        const consultants = await response.json();
        return transformKeysToCamelCase(consultants);
    }
    catch (error) {
        console.log(error);
        return error?.message;
    }
}