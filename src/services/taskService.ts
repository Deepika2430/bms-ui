import { getToken } from "./authService";
import config from "@/config";
import { transformKeysToCamelCase } from "@/utils/transformKeys";

export const getTasks = async () => {
    const token = getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/tasks`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            redirect: "follow"
        });

        const tasks = await response.json();
        return tasks.map(task => ({
            id: task.id,
            project: task.projects?.project_name || "N/A",
            taskType: task.taskType ?? "N/A",
            taskTitle: task.title,
            description: task.description,
            startDate: task.start_date,
            endDate: task.due_date,
            status: task.status,
            priority: task.priority,
            estimatedHours: task.estimated_hours,
            assignedTo: task.users?.name || "Unassigned",
            createdAt: task.created_at,
            updatedAt: task.updated_at,
            projectId: task.project_id,
            assignedToId: task.assigned_to,
            assignedById: task.assigned_by,
            assignedBy: task.tasks?.name || "Admin",
            assignedUsers: task.task_assignments,
        }));
    }
    catch (error) {
        return error?.message;
    }
}

export const createTask = async (task) => {
    console.log("Creating task------------", task);
    const token = getToken();
    try {
        // Ensure dates are in ISO format
        const formattedTask = {
            ...task,
            start_date: new Date(task.start_date).toISOString(),
            due_date: new Date(task.due_date).toISOString(),
        };

        const response = await fetch(`${config.apiBaseUrl}/tasks`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formattedTask),
            redirect: "follow"
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const createdTask = await response.json();
        return createdTask;
    }
    catch (error) {
        console.error("Error creating task:", error);
        throw error;
    }
};

export const updateTask = async (taskId: string, task: any) => {
    const token = getToken();
    try {
        // Ensure dates are in ISO format
        const formattedTask = {
            ...task,
            start_date: new Date(task.start_date).toISOString(),
            due_date: new Date(task.due_date).toISOString(),
        };

        const response = await fetch(`${config.apiBaseUrl}/tasks/${taskId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formattedTask),
            redirect: "follow"
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const updatedTask = await response.json();
        return updatedTask;
    }
    catch (error) {
        console.error("Error updating task:", error);
        throw error;
    }
};

export const assignTask = async (taskId: string, consultantId: string) => {
    const token = getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/task-assignment`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user_id: consultantId, task_id: taskId }),
            redirect: "follow"
        });

        const assignedTask = await response.json();
        if (!response.ok) {
            throw new Error(`${assignedTask?.error}`);
        }
        return assignedTask;

    }
    catch (error) {
        console.error("Error assigning task: ", error);
        throw error;
    }
};

export const deleteTask = async (taskId: string) => {
    const token = getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/tasks/${taskId}`, {
            method: "DELETE",
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
    }
    catch (error) {
        console.error("Error deleting task:", error);
        throw error;
    }
};

export const getAssignedTasks = async () => {
    const token = getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/user/tasks/assigned`, {
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

        const assignedTasks = await response.json();
        return assignedTasks.map(task => ({
            id: task.id,
            taskTitle: task.title,
            description: task.description,
            startDate: task.start_date,
            endDate: task.due_date,
            status: task.status,
            priority: task.priority,
            estimatedHours: task.estimated_hours,
            project: task.project?.project_name || "N/A",
            projectId: task.project.id
        }));
    }
    catch (error) {
        console.error("Error fetching assigned tasks:", error);
        throw error;
    }
}