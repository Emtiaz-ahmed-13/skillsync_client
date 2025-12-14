import apiClient from "../utils/apiClient";

// Start Time Entry
export const startTimeEntry = async (timeData: {
  projectId: string;
  taskId?: string;
  description?: string;
}) => {
  try {
    const response = await apiClient.post("/time-tracking/start", timeData);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to start time entry");
  }
};

// Stop Time Entry
export const stopTimeEntry = async (entryId: string) => {
  try {
    const response = await apiClient.put(`/time-tracking/${entryId}/stop`);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to stop time entry");
  }
};

// Get Time Entries
export const getTimeEntries = async (params: Record<string, any> = {}) => {
  try {
    const response = await apiClient.get("/time-tracking", params);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch time entries");
  }
};

// Update Time Entry
export const updateTimeEntry = async (entryId: string, timeData: any) => {
  try {
    const response = await apiClient.put(`/time-tracking/${entryId}`, timeData);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to update time entry");
  }
};

// Delete Time Entry
export const deleteTimeEntry = async (entryId: string) => {
  try {
    const response = await apiClient.delete(`/time-tracking/${entryId}`);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete time entry");
  }
};
