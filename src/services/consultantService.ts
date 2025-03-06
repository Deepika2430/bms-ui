import config from "@/config";
import { Cookie } from "js-cookie";
import { transformKeysToCamelCase } from "@/utils/transformKeys";
import { getToken } from "./authService";

export interface Consultant {
    id: string;
    name: string;
    email: string;
    // Add other relevant fields
}

export interface TeamMember extends Consultant {
    role?: string;
    department?: string;
    reportingTo?: string;
    teamId?: string;
}

export const getAllConsultants = async (): Promise<Consultant[]> => {
    const token = getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/consultants`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            redirect: "follow"
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching consultants:", error);
        throw error;
    }
};

export const getConsultantById = async (id: string): Promise<Consultant> => {
    const token = getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/consultants/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            redirect: "follow"
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching consultant:", error);
        throw error;
    }
};

export const getConsultants = async () => {
    try {
        const response = await fetch(`${config.apiBaseUrl}/user?role=consultant`, {
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

export const getTeamMembers = async (managerId: string): Promise<TeamMember[]> => {
    const token = getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/teams/members/${managerId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            redirect: "follow"
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const teamMembers = await response.json();
        return transformKeysToCamelCase(teamMembers);
    } catch (error) {
        console.error("Error fetching team members:", error);
        throw error;
    }
};

export const getTeamMembersByDepartment = async (departmentId: string): Promise<TeamMember[]> => {
    const token = getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/teams/department/${departmentId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            redirect: "follow"
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const teamMembers = await response.json();
        return transformKeysToCamelCase(teamMembers);
    } catch (error) {
        console.error("Error fetching department team members:", error);
        throw error;
    }
};