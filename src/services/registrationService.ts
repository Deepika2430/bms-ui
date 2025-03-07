import config from "@/config";
import { getToken } from "./authService";

export const getDesignations = async () => {
    try {
        const token = await getToken();
        const response = await fetch(`${config.apiBaseUrl}/designations`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching designations:', error);
        throw error;
    }
};

export const getDepartments = async () => {
    try {
        const token = await getToken();
        const response = await fetch(`${config.apiBaseUrl}/departments`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching departments:', error);
        throw error;
    }
};

export const getManagers = async () => {
    try {
        const token = await getToken();
        const response = await fetch(`${config.apiBaseUrl}/user?role=manager`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

        const data = await response.json();
        return data.map((manager: any) => ({
            id: manager?.employee_details.id,
            name: manager?.employee_details?.first_name + " " + manager?.employee_details?.last_name,
        }));
    } catch (error) {
        console.error('Error fetching managers:', error);
        throw error;
    }
};

export const getOrganizations = async () => {
    try {
        const token = await getToken();
        const response = await fetch(`${config.apiBaseUrl}/organizations`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`

                }
            });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching organizations:', error);
        throw error;
    }
};

export const registerUser = async (data: any) => {
    try {
        const token = await getToken();
        const response = await fetch(`${config.apiBaseUrl}/user/register`,
            {
                method: "POST",
                headers: {

                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
}