import { getToken } from "./authService";
import config from "@/config";

export interface WorkLog {
    project_id: string;
    task_id: string;
    hours_worked: number;
    work_date: string;
    comments?: string;
}

export const addWorkLog = async (workLog: WorkLog) => {
    const token = getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/work-logs`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(workLog),
            redirect: "follow"
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const createdWorkLog = await response.json();
        return createdWorkLog;
    } catch (error) {
        console.error("Error adding work log:", error);
        throw error;
    }
};

export const getWorkLogs = async () => {
    const token = getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/work-logs`, {
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

        return (await response.json());

    } catch (error) {
        console.error("Error fetching work logs:", error);
        throw error;
    }
};

export const updateWorkLog = async (workLogId: string, workLog: WorkLog): Promise<any> => {
    try {
        const response = await fetch(`${config.apiBaseUrl}/work-logs/${workLogId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(workLog)
        });

        if (!response.ok) {
            throw new Error('Failed to update work log');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating work log:', error);
        throw error;
    }
};