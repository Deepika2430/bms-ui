import config from "@/config";
import { getToken } from "./authService";
import { transformKeysToCamelCase } from "@/utils/transformKeys";

export type ProjectData = {
  project_code: string;
  project_name: string;
  project_description: string;
  planned_start_date: Date;
  planned_end_date: Date;
  revised_planned_end_date?: Date | null;
  actual_start_date?: Date | null;
  actual_end_date?: Date | null;
  contracted_efforts?: string | null;
  planned_efforts?: string | null;
  po_number?: string | null;
  po_amount?: string | null;
  currency?: string | null;
  po_start_date?: Date | null;
  po_end_date?: Date | null;
  po_validity?: string | null;
  po_upliftment_details?: string | null;
  comments?: string | null;
  status: string;
  created_at?: Date;
  updated_at?: Date;
  client_id?: string | null;
};

const transformProjectData = (project): ProjectData => ({
  project_code: project.projectCode,
  project_name: project.projectName,
  project_description: project.projectDescription,
  planned_start_date: project.plannedStartDate ? new Date(project.plannedStartDate) : new Date(),
  planned_end_date: project.plannedEndDate ? new Date(project.plannedEndDate) : new Date(),
  revised_planned_end_date: project.revisedPlannedEndDate ? new Date(project.revisedPlannedEndDate) : null,
  actual_start_date: project.actualStartDate ? new Date(project.actualStartDate) : null,
  actual_end_date: project.actualEndDate ? new Date(project.actualEndDate) : null,
  contracted_efforts: project.contractedEfforts || null,
  planned_efforts: project.plannedEfforts || null,
  po_number: project.poNumber || null,
  po_amount: project.poAmount || null,
  currency: project.currency || null,
  po_start_date: project.poStartDate ? new Date(project.poStartDate) : null,
  po_end_date: project.poEndDate ? new Date(project.poEndDate) : null,
  po_validity: project.poValidity || null,
  po_upliftment_details: project.poUpliftmentDetails || null,
  comments: project.comments || null,
  status: project.status || 'active',
  client_id: project.clientId || null,
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
        return await response.json();
    }
    catch (error) {
        return error?.message;
    }
}

export const createProject = async (project) => {
  const token = getToken();
  try {
    const transformedData = transformProjectData(project);
    const response = await fetch(`${config.apiBaseUrl}/projects`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(transformedData),
      redirect: "follow"
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
  catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

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
        return await response.json();
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
        if (!response.ok) {
            throw new Error(`${projects.error}`);
        }
        return projects.map(project => ({
            ...transformKeysToCamelCase(project),
            client: project.clients?.company_name
        }));
    }
    catch (error) {
        return error?.message;
    }
}
