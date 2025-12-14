import apiClient from "../utils/apiClient";

// Create Project
export const createProject = async (projectData: any) => {
  try {
    const response = await apiClient.post("/projects", projectData);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create project");
  }
};

// Get All Projects
export const getAllProjects = async (params: Record<string, any> = {}) => {
  try {
    const response = await apiClient.get("/projects", params);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch projects");
  }
};

// Get Project By ID
export const getProjectById = async (projectId: string) => {
  try {
    const response = await apiClient.get(`/projects/${projectId}`);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch project");
  }
};

// Update Project
export const updateProject = async (projectId: string, projectData: any) => {
  try {
    const response = await apiClient.put(`/projects/${projectId}`, projectData);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to update project");
  }
};

// Delete Project
export const deleteProject = async (projectId: string) => {
  try {
    const response = await apiClient.delete(`/projects/${projectId}`);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete project");
  }
};

// Approve Project
export const approveProject = async (projectId: string) => {
  try {
    const response = await apiClient.put(`/projects/${projectId}/approve`);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to approve project");
  }
};

// Invite User to Project
export const inviteUserToProject = async (
  projectId: string,
  inviteData: any
) => {
  try {
    const response = await apiClient.post(
      `/projects/${projectId}/invite`,
      inviteData
    );
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to invite user");
  }
};
