"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

interface Message {
  _id: string;
  senderId: {
    _id: string;
    name: string;
  };
  receiverId: {
    _id: string;
    name: string;
  };
  message: string;
  createdAt: string;
}

export const useSocket = () => {
  const { data: session } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const user = session?.user as any;
    
    // Only proceed if we don't have a socket or it's disconnected
    if (socketRef.current?.connected) {
      setIsConnected(true);
      return;
    }

    // IMPORTANT: Vercel doesn't support WebSockets!
    // Always use localhost for Socket.IO, or a dedicated WebSocket server
    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5001";

    console.log("Attempting to connect to WebSocket:", SOCKET_URL);
    console.log("User authenticated:", !!user?.accessToken);

    const socketOptions: any = {
      // Allow both websocket and polling for better compatibility
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      path: "/socket.io",
      withCredentials: true,
    };

    // Add auth token if available
    if (user?.accessToken) {
      socketOptions.auth = {
        token: user.accessToken,
      };
    }

    const newSocket = io(SOCKET_URL, socketOptions);
    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (err) => {
      console.error("🔴 Socket connection error:");
      console.error("  Message:", err.message);
      console.error("  Type:", (err as any).type);
      console.error("  Description:", (err as any).description);
      console.error("  Full error:", err);
      setIsConnected(false);
      
      // Show user-friendly error message
      const errorMsg = err.message || "Unknown error";
      if (errorMsg.includes("websocket error") || errorMsg.includes("xhr poll error")) {
        // Only show toast if it's a first-time connection error or important failure
        // avoid spamming on reconnection attempts
        if (!newSocket.active) {
            toast.error("Unable to connect to messaging server. Please check your connection.");
        }
      } else if (errorMsg.includes("unauthorized") || errorMsg.includes("authentication")) {
        toast.error("Authentication failed. Please try logging in again.");
      } else {
        toast.error(`Connection error: ${errorMsg}`);
      }
    });

    newSocket.on("reconnect", (attemptNumber) => {
      console.log(`🔄 Socket reconnected after ${attemptNumber} attempts`);
      setIsConnected(true);
      toast.success("Messaging reconnected!");
    });

    newSocket.on("reconnect_attempt", (attemptNumber) => {
      console.log(`🔄 Reconnection attempt ${attemptNumber}...`);
    });

    newSocket.on("reconnect_failed", () => {
      console.error("❌ Socket reconnection failed after all attempts");
      setIsConnected(false);
    });

    // Note: Message events are handled in individual components
    // Components should listen to: "receive_message" and "message_sent"

    return () => {
      if (socketRef.current) {
        console.log("Cleaning up socket connection");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [session]);

  // Function to send a message
  const sendMessage = (receiverId: string, message: string) => {
    const socket = socketRef.current;
    if (!socket || !isConnected) {
      console.error("Socket not connected");
      toast.error("Messaging is offline. Try again in a moment.");
      return;
    }

    const user = session?.user as any;
    if (!user?.id) {
      console.error("User not authenticated");
      return;
    }

    const messageData = {
      receiverId,
      message,
    };

    console.log("📤 Sending message:", messageData);
    socket.emit("send_message", messageData);

    // Optimistically add message to local state
    const newMessage: Message = {
      _id: Date.now().toString(),
      senderId: {
        _id: user.id,
        name: user.name || "You",
      },
      receiverId: {
        _id: receiverId,
        name: "",
      },
      message,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  return { 
    socket: socketRef.current, 
    isConnected, 
    messages, 
    setMessages,
    sendMessage 
  };
};
