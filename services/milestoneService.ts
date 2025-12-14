import apiClient from "../utils/apiClient";

// Create Milestone
export const createMilestone = async (milestoneData: any) => {
  try {
    const response = await apiClient.post("/milestones", milestoneData);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create milestone");
  }
};

// Get Project Milestones
export const getProjectMilestones = async (
  projectId: string,
  params: Record<string, any> = {}
) => {
  try {
    const response = await apiClient.get(
      `/milestones/project/${projectId}`,
      params
    );
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch milestones");
  }
};

// Update Milestone
export const updateMilestone = async (
  milestoneId: string,
  milestoneData: any
) => {
  try {
    const response = await apiClient.put(
      `/milestones/${milestoneId}`,
      milestoneData
    );
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to update milestone");
  }
};

// Delete Milestone
export const deleteMilestone = async (milestoneId: string) => {
  try {
    const response = await apiClient.delete(`/milestones/${milestoneId}`);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete milestone");
  }
};

// Complete Milestone
export const completeMilestone = async (milestoneId: string) => {
  try {
    const response = await apiClient.put(`/milestones/${milestoneId}/complete`);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to complete milestone");
  }
};
