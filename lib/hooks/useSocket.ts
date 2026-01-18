"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { Notification as AppNotification } from "../api/notification-api";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5001";

export const useSocket = () => {
    const { data: session } = useSession();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!session?.user) return;

        // Create socket connection
        const newSocket = io(SOCKET_URL, {
            auth: {
                token: (session as any).accessToken,
            },
            transports: ["websocket", "polling"],
        });

        socketRef.current = newSocket;
        setSocket(newSocket);

        // Connection events
        newSocket.on("connect", () => {
            console.log("Socket connected:", newSocket.id);
            setIsConnected(true);
        });

        newSocket.on("disconnect", () => {
            console.log("Socket disconnected");
            setIsConnected(false);
        });

        newSocket.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
            setIsConnected(false);
        });

        // Listen for notifications
        newSocket.on("notification", (notification: AppNotification) => {
            console.log("New notification received:", notification);
            setNotifications((prev) => [notification, ...prev]);

            // Show browser notification if permitted
            if (Notification.permission === "granted") {
                new Notification(notification.title, {
                    body: notification.message,
                    icon: "/icon.webp",
                });
            }
        });

        // Cleanup on unmount
        return () => {
            newSocket.close();
        };
    }, [session]);

    // Request notification permission
    useEffect(() => {
        if (typeof window !== "undefined" && "Notification" in window) {
            if (Notification.permission === "default") {
                Notification.requestPermission();
            }
        }
    }, []);

    return {
        socket,
        isConnected,
        notifications,
        clearNotifications: () => setNotifications([]),
    };
};
