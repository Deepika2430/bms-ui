import config from "@/config";
import { getToken } from "./authService";
import { transformKeysToCamelCase } from "@/utils/transformKeys";

const transformProjectData = (project) => ({
    project_code: project.projectCode,
    project_name: project.projectName,
    project_description: project.projectDescription,
    planned_start_date: project.plannedStartDate ? new Date(project.plannedStartDate).toISOString() : null,
    planned_end_date: project.plannedEndDate ? new Date(project.plannedEndDate).toISOString() : null,
    revised_planned_end_date: project.revisedPlannedEndDate ? new Date(project.revisedPlannedEndDate).toISOString() : null,
    actual_start_date: project.actualStartDate ? new Date(project.actualStartDate).toISOString() : null,
    actual_end_date: project.actualEndDate ? new Date(project.actualEndDate).toISOString() : null,
    contracted_efforts: project.contractedEfforts,
    planned_efforts: project.plannedEfforts,
    po_number: project.poNumber,
    po_amount: project.poAmount,
    currency: project.currency,
    po_start_date: project.poStartDate ? new Date(project.poStartDate).toISOString() : null,
    po_end_date: project.poEndDate ? new Date(project.poEndDate).toISOString() : null,
    po_validity: project.poValidity,
    po_upliftment_details: project.poUpliftmentDetails,
    comments: project.comments,
    status: project.status,
    created_at: project.createdAt,
    updated_at: project.updatedAt,
    client_id: project.clientId,
});

export const updateProject = async (projectId, project) => {
    const token = getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/projects/${projectId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(transformProjectData(project)),
            redirect: "follow"
        });
        return response.json();
    }
    catch (error) {
        return error?.message;
    }
}

export const createProject = async (project) => {
    const token = getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/projects`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(transformProjectData(project)),
            redirect: "follow"
        });
        return response.json();
    }
    catch (error) {
        return error?.message;
    }
}

export const getProject = async (projectId) => {
    const token = getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/projects/${projectId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            redirect: "follow"
        });
        return response.json();
    }
    catch (error) {
        return error?.message;
    }
}

export const getProjects = async () => {
    const token = getToken();
    try {
        const response = await fetch(`${config.apiBaseUrl}/projects`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            redirect: "follow"
        });

        const projects = await response.json();
        return projects.map(project => ({
            ...transformKeysToCamelCase(project),
            client: project.clients?.company_name
        }));
    }
    catch (error) {
        return error?.message;
    }
}
