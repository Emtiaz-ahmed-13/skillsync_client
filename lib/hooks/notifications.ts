"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  createdAt: string;
}

export const useNotifications = () => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const accessToken = (session?.user as { accessToken?: string })?.accessToken;

  const formatDate = (dateString: string): string => {
    const diffInSeconds = Math.floor(
      (Date.now() - new Date(dateString).getTime()) / 1000,
    );
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const mapNotification = (n: Record<string, unknown>): Notification => ({
    id: String(n.id || n._id),
    title: String(n.title || "Notification"),
    description: String(n.message || n.description || ""),
    read: Boolean(n.isRead ?? n.read),
    createdAt: String(n.createdAt || new Date().toISOString()),
    time: formatDate(String(n.createdAt || new Date().toISOString())),
  });

  const fetchNotifications = async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [listRes, countRes] = await Promise.all([
        fetch("/api/v1/notifications?limit=20", {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        fetch("/api/v1/notifications/unread-count", {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      ]);

      if (listRes.ok) {
        const data = await listRes.json();
        const list = data.data?.notifications || data.data || [];
        const mapped = (Array.isArray(list) ? list : []).map(mapNotification);
        setNotifications(
          mapped.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
        );
      }

      if (countRes.ok) {
        const countData = await countRes.json();
        setUnreadCount(countData.data?.unreadCount ?? countData.data?.count ?? 0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    if (!accessToken) return false;
    try {
      const response = await fetch(`/api/v1/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const markAllAsRead = async () => {
    if (!accessToken) return false;
    try {
      const response = await fetch("/api/v1/notifications/read-all", {
        method: "PUT",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  useEffect(() => {
    if (accessToken) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [accessToken]);

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
