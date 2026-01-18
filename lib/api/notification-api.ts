import { apiClient } from "./api-client";

export interface Notification {
    id: string;
    userId: string;
    senderId?: {
        _id: string;
        name: string;
        email: string;
        avatar?: string;
    };
    type:
    | "project_created"
    | "project_updated"
    | "milestone_created"
    | "milestone_completed"
    | "task_assigned"
    | "task_updated"
    | "file_uploaded"
    | "payment_received"
    | "review_received"
    | "message_sent"
    | "bid_submitted"
    | "bid_accepted"
    | "bid_rejected"
    | "work_submitted"
    | "work_accepted"
    | "work_rejected";
    title: string;
    message: string;
    projectId?: string;
    taskId?: string;
    milestoneId?: string;
    fileId?: string;
    reviewId?: string;
    isRead: boolean;
    readAt?: string;
    metadata?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

export interface NotificationListResponse {
    notifications: Notification[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalNotifications: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export interface UnreadCountResponse {
    unreadCount: number;
}

export const notificationApi = {
    /**
     * Get user notifications with pagination
     */
    getAll: (token: string, page: number = 1, limit: number = 20) =>
        apiClient.get<NotificationListResponse>(
            `/notifications?page=${page}&limit=${limit}`,
            { token }
        ),

    /**
     * Get unread count
     */
    getUnreadCount: (token: string) =>
        apiClient.get<UnreadCountResponse>("/notifications/unread-count", { token }),

    /**
     * Mark notification as read
     */
    markAsRead: (id: string, token: string) =>
        apiClient.patch<Notification>(`/notifications/${id}/read`, undefined, { token }),

    /**
     * Mark all as read
     */
    markAllAsRead: (token: string) =>
        apiClient.patch<void>("/notifications/mark-all-read", undefined, { token }),

    /**
     * Delete notification
     */
    delete: (id: string, token: string) =>
        apiClient.delete<void>(`/notifications/${id}`, { token }),
};
