"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Paperclip, Send } from "lucide-react";
import { useState } from "react";

interface Message {
  id: string;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
}

const mockMessages: Message[] = [
  {
    id: "1",
    user: "Alex Morgan",
    avatar: "AM",
    content: "Hi everyone! Just wanted to share the latest design mockups.",
    timestamp: "10:30 AM",
    isCurrentUser: false,
  },
  {
    id: "2",
    user: "You",
    avatar: "Y",
    content:
      "Thanks Alex! These look great. I'll review them and provide feedback.",
    timestamp: "10:32 AM",
    isCurrentUser: true,
  },
  {
    id: "3",
    user: "Jamie Smith",
    avatar: "JS",
    content:
      "I've started implementing the frontend components based on these designs.",
    timestamp: "10:45 AM",
    isCurrentUser: false,
  },
  {
    id: "4",
    user: "Taylor Kim",
    avatar: "TK",
    content:
      "Let me know when you need the backend APIs ready for integration.",
    timestamp: "10:50 AM",
    isCurrentUser: false,
  },
];

export function MessagesSection() {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to a server
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="border-gray-200 bg-white">
      <CardHeader>
        <CardTitle className="text-gray-900 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-[400px]">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {mockMessages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.isCurrentUser ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  message.isCurrentUser
                    ? "bg-skillsync-cyan text-skillsync-dark-blue"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {message.avatar}
              </div>
              <div
                className={`max-w-[80%] ${
                  message.isCurrentUser ? "text-right" : "text-left"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-primary-heading">
                    {message.user}
                  </span>
                  <span className="text-xs text-muted">
                    {message.timestamp}
                  </span>
                </div>
                <div
                  className={`inline-block p-3 rounded-lg ${
                    message.isCurrentUser
                      ? "bg-skillsync-cyan text-skillsync-dark-blue"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 bg-gray-50 border-gray-200 text-gray-900"
          />
          <Button
            variant="outline"
            size="icon"
            className="border-gray-300 text-body hover:bg-gray-100"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleSendMessage}
            className="bg-skillsync-cyan text-skillsync-dark-blue hover:bg-skillsync-cyan/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
