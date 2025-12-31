"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface SessionUser {
  name?: string;
  email?: string;
  image?: string;
  role?: string;
  accessToken?: string;
}

interface Session {
  user?: SessionUser;
  expires: string;
}

export const useNotifications = () => {
  const { data: session } = useSession() as {
    data: Session | null;
    status: string;
  };
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    if (!session?.user?.accessToken) {
      setError("No access token available");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `/api/v1/notifications`,
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        const sortedNotifications = data.data
          .map((notif: Notification) => ({
            ...notif,
            time: formatDate(notif.createdAt),
          }))
          .sort(
            (a: Notification, b: Notification) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        setNotifications(sortedNotifications);
        setUnreadCount(sortedNotifications.filter((n) => !n.read).length);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch notifications"
      );
    } finally {
      setLoading(false);
    }
  };
  const fetchUnreadCount = async () => {
    if (!session?.user?.accessToken) {
      return 0;
    }

    try {
      const response = await fetch(
        `/api/v1/notifications/unread-count`,
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch unread count: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        return data.data?.count || 0;
      }
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
    return 0;
  };

  // Mark notification as read
  const markAsRead = async (id: string) => {
    if (!session?.user?.accessToken) {
      return false;
    }

    try {
      const response = await fetch(
        `/api/v1/notifications/${id}/read`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );

      if (response.ok) {
        // Update local state
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error marking notification as read:", err);
      return false;
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!session?.user?.accessToken) {
      return false;
    }

    try {
      const response = await fetch(
        `/api/v1/notifications/mark-all-read`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );

      if (response.ok) {
        // Update local state
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, read: true }))
        );
        setUnreadCount(0);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      return false;
    }
  };

  // Format date to relative time (e.g., "2 min ago", "1 hour ago")
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    if (session?.user?.accessToken) {
      fetchNotifications();

      const interval = setInterval(() => {
        fetchNotifications();
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [session?.user?.accessToken]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    formatDate,
  };
};
