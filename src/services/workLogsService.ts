import config from "@/config";
import { getToken } from "./authService";

export interface WorkLog {
    project_id: string;
    task_id: string;
    hours_worked: number;
    work_date: string;
    notes?: string;
    rejection_reason?: string;
}

export interface TeamWorkLog extends WorkLog {
    id: string;
    user_id: string;
    user_name: string;
    task_title: string;
    project_name: string;
    status: 'pending' | 'approved' | 'rejected';
    rejection_reason?: string;
}

export const getWorkLogs = async () => {
    const token = getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/work-logs`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching work logs:", error);
        throw error;
    }
};

// export const getTeamWorkLogs = async (userId: string = 'all') => {
//     const token = getToken();
//     try {
//         const url = userId === 'all'
//             ? `${config.apiBaseUrl}/work-logs/team`
//             : `${config.apiBaseUrl}/work-logs/team/${userId}`;

//         const response = await fetch(url, {
//             method: "GET",
//             headers: {
//                 "Authorization": `Bearer ${token}`,
//                 "Content-Type": "application/json"
//             }
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         return await response.json();
//     } catch (error) {
//         console.error("Error fetching team work logs:", error);
//         throw error;
//     }
// };

export const addWorkLog = async (workLog: WorkLog) => {
    const token = getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/work-logs`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(workLog)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error adding work log:", error);
        throw error;
    }
};

export const updateWorkLogStatus = async (id: string, { status, rejectionReason }: { status: string, rejectionReason?: string }) => {
    const token = getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/work-logs/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({status, comments: rejectionReason})
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating work log:", error);
        throw error;
    }
};

export const approveWorkLog = async (id: string) => {
    const token = getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/work-logs/${id}/approve`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error approving work log:", error);
        throw error;
    }
};

export const rejectWorkLog = async (id: string, rejectionReason: string) => {
    const token = getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/work-logs/${id}/reject`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ rejection_reason: rejectionReason })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error rejecting work log:", error);
        throw error;
    }
};

export const getConsultantWorkLogs = async (userId: string) => {
    const token = getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/work-logs/?user_id=${userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching consultant work logs:", error);
        throw error;
    }
};



