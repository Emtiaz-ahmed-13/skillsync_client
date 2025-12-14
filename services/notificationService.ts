import apiClient from "../utils/apiClient";

// Get Notifications
export const getNotifications = async (params: Record<string, any> = {}) => {
  try {
    const response = await apiClient.get("/notifications", params);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch notifications");
  }
};

// Mark Notification As Read
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const response = await apiClient.put(
      `/notifications/${notificationId}/read`
    );
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to mark notification as read");
  }
};

// Mark All Notifications As Read
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await apiClient.put("/notifications/read-all");
    return response;
  } catch (error: any) {
    throw new Error(
      error.message || "Failed to mark all notifications as read"
    );
  }
};

// Delete Notification
export const deleteNotification = async (notificationId: string) => {
  try {
    const response = await apiClient.delete(`/notifications/${notificationId}`);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete notification");
  }
};
