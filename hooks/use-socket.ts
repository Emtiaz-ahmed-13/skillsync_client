"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

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

let socket: Socket | null = null;

export const useSocket = () => {
  const { data: session } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const user = session?.user as any;
    if (!user?.accessToken) return;

    // Use the backend URL
    const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || "https://skillsync-server-kohl.vercel.app";

    socket = io(SOCKET_URL, {
      auth: {
        token: user.accessToken,
      },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket?.id);
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      setIsConnected(false);
    });

    // Listen for incoming messages
    socket.on("receiveMessage", (message: Message) => {
      console.log("Received message:", message);
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [session]);

  // Function to send a message
  const sendMessage = (receiverId: string, message: string) => {
    if (!socket || !isConnected) {
      console.error("Socket not connected");
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

    console.log("Sending message:", messageData);
    socket.emit("sendMessage", messageData);

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
    socket, 
    isConnected, 
    messages, 
    setMessages,
    sendMessage 
  };
};
