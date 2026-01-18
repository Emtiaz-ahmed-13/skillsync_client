import { apiClient } from "./api-client";

export interface Task {
    id: string;
    projectId: string;
    sprintId?: string;
    title: string;
    description?: string;
    assignedTo?: {
        _id: string;
        name: string;
        email: string;
        avatar?: string;
    };
    status: "todo" | "in-progress" | "review" | "completed";
    priority: "low" | "medium" | "high";
    order: number;
    tags?: string[];
    attachments?: string[];
    estimatedHours?: number;
    actualHours?: number;
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskData {
    projectId: string;
    sprintId?: string;
    title: string;
    description?: string;
    assignedTo?: string;
    status?: "todo" | "in-progress" | "review" | "completed";
    priority?: "low" | "medium" | "high";
    order?: number;
    tags?: string[];
    estimatedHours?: number;
    dueDate?: string;
}

export interface BulkUpdateTask {
    id: string;
    order: number;
    status?: "todo" | "in-progress" | "review" | "completed";
}

export const taskApi = {
    /**
     * Create task
     */
    create: (taskData: CreateTaskData, token: string) =>
        apiClient.post<Task>("/tasks", taskData, { token }),

    /**
     * Get tasks by project
     */
    getByProject: (projectId: string, token: string) =>
        apiClient.get<Task[]>(`/tasks/project/${projectId}`, { token }),

    /**
     * Get tasks by status (for Kanban columns)
     */
    getByStatus: (projectId: string, status: string, token: string) =>
        apiClient.get<Task[]>(`/tasks/project/${projectId}/status/${status}`, { token }),

    /**
     * Get task by ID
     */
    getById: (id: string, token: string) =>
        apiClient.get<Task>(`/tasks/${id}`, { token }),

    /**
     * Update task
     */
    update: (id: string, updates: Partial<Task>, token: string) =>
        apiClient.patch<Task>(`/tasks/${id}`, updates, { token }),

    /**
     * Update task order (for drag-and-drop)
     */
    updateOrder: (id: string, order: number, status: string | undefined, token: string) =>
        apiClient.patch<Task>(`/tasks/${id}/order`, { order, status }, { token }),

    /**
     * Bulk update tasks (for Kanban drag-and-drop)
     */
    bulkUpdate: (updates: BulkUpdateTask[], token: string) =>
        apiClient.patch<void>("/tasks/bulk-update", { updates }, { token }),

    /**
     * Delete task
     */
    delete: (id: string, token: string) =>
        apiClient.delete<void>(`/tasks/${id}`, { token }),
};
