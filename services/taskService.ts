import apiClient from "../utils/apiClient";

// Create Task
export const createTask = async (taskData: any) => {
  try {
    const response = await apiClient.post("/tasks", taskData);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create task");
  }
};

// Get Project Tasks
export const getProjectTasks = async (
  projectId: string,
  params: Record<string, any> = {}
) => {
  try {
    const response = await apiClient.get(`/tasks/project/${projectId}`, params);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch tasks");
  }
};

// Get Task By ID
export const getTaskById = async (taskId: string) => {
  try {
    const response = await apiClient.get(`/tasks/${taskId}`);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch task");
  }
};

// Update Task
export const updateTask = async (taskId: string, taskData: any) => {
  try {
    const response = await apiClient.put(`/tasks/${taskId}`, taskData);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to update task");
  }
};

// Delete Task
export const deleteTask = async (taskId: string) => {
  try {
    const response = await apiClient.delete(`/tasks/${taskId}`);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete task");
  }
};
