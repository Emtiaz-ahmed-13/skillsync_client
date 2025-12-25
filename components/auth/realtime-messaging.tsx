"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

export default function RealtimeMessaging({
  projectId,
}: {
  projectId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "John Doe",
      content: "Hi team, I've completed the initial design mockups.",
      timestamp: "2025-01-10T09:30:00",
      isOwn: false,
    },
    {
      id: "2",
      sender: "You",
      content: "Great work! Can you share the files?",
      timestamp: "2025-01-10T09:32:00",
      isOwn: true,
    },
    {
      id: "3",
      sender: "Jane Smith",
      content: "I've uploaded the files to the file sharing section.",
      timestamp: "2025-01-10T09:35:00",
      isOwn: false,
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const participants = [
    { name: "John Doe", role: "Designer" },
    { name: "Jane Smith", role: "Developer" },
    { name: "Bob Johnson", role: "Project Manager" },
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: "You",
      content: newMessage,
      timestamp: new Date().toISOString(),
      isOwn: true,
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <span>Real-time Messaging</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">{participants.length} participants</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Participants List */}
          <div className="w-full md:w-48 flex-shrink-0">
            <h3 className="font-medium mb-3">Participants</h3>
            <div className="space-y-2">
              {participants.map((participant, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 rounded hover:bg-muted"
                >
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">
                    {participant.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{participant.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {participant.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages Container */}
            <div className="flex-1 border rounded-lg p-4 mb-4 h-80 overflow-y-auto bg-muted/10">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.isOwn ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                        message.isOwn
                          ? "bg-purple-600 text-white"
                          : "bg-background border"
                      }`}
                    >
                      {!message.isOwn && (
                        <p className="text-xs font-medium mb-1">
                          {message.sender}
                        </p>
                      )}
                      <p>{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.isOwn
                            ? "text-purple-200"
                            : "text-muted-foreground"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
