import { apiClient } from "./api-client";

export interface Milestone {
    id: string;
    projectId: string;
    title: string;
    description?: string;
    amount?: number;
    dueDate?: string;
    status: "pending" | "in_progress" | "completed" | "paid";
    completed: boolean;
    completedAt?: string;
    approvedBy?: string;
    approvedAt?: string;
    order: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateMilestoneData {
    projectId: string;
    title: string;
    description?: string;
    amount?: number;
    dueDate?: string;
    order?: number;
}

export const milestoneApi = {
    /**
     * Get milestone by ID
     */
    getById: (id: string, token: string) =>
        apiClient.get<Milestone>(`/milestones/${id}`, { token }),

    /**
     * Get milestones by project
     */
    getByProject: (projectId: string, token: string) =>
        apiClient.get<Milestone[]>(`/projects/${projectId}/milestones`, { token }),

    /**
     * Create milestone
     */
    create: (milestoneData: CreateMilestoneData, token: string) =>
        apiClient.post<Milestone>(
            `/projects/${milestoneData.projectId}/milestones`,
            milestoneData,
            { token }
        ),

    /**
     * Update milestone
     */
    update: (id: string, updates: Partial<Milestone>, token: string) =>
        apiClient.put<Milestone>(`/milestones/${id}`, updates, { token }),

    /**
     * Complete milestone (freelancer)
     */
    complete: (id: string, token: string) =>
        apiClient.put<Milestone>(`/milestones/${id}/complete`, undefined, { token }),

    /**
     * Approve milestone (client)
     */
    approve: (id: string, token: string) =>
        apiClient.put<Milestone>(`/milestones/${id}/approve`, undefined, { token }),

    /**
     * Delete milestone
     */
    delete: (id: string, token: string) =>
        apiClient.delete<void>(`/milestones/${id}`, { token }),
};
