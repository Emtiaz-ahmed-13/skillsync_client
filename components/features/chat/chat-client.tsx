"use client";

import { Navbar } from "@/components/shared/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useSocket } from "@/hooks/use-socket";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export default function ChatClient() {
  const { data: session } = useSession();
  const { socket, sendMessage, messages, setMessages } = useSocket();
  const [conversations, setConversations] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = session?.user as any;

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUser?.accessToken) return;
      try {
        const response = await fetch("http://localhost:5001/api/v1/chat/conversations", {
          headers: {
            Authorization: `Bearer ${currentUser.accessToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setConversations(data.data);
          
          // Check for userId in URL params to auto-select
          const searchParams = new URLSearchParams(window.location.search);
          const userIdParam = searchParams.get('userId');
          if (userIdParam) {
             // If user is already in conversations, select them
             const existingUser = data.data.find((u: User) => u._id === userIdParam);
             if (existingUser) {
                 setSelectedUser(existingUser);
             } else {
                 // If not, fetch their details temporarily seamlessly
                 const userRes = await fetch(`http://localhost:5001/api/v1/auth/users/${userIdParam}`, {
                    headers: { Authorization: `Bearer ${currentUser.accessToken}` }
                 });
                 if (userRes.ok) {
                    const userData = await userRes.json();
                    if(userData.success) {
                       const newUser = userData.data;
                       setConversations(prev => [...prev, newUser]);
                       setSelectedUser(newUser);
                    }
                 }
             }
          }
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };
    fetchConversations();
  }, [currentUser]);

  // Fetch chat history when selecting a user
  useEffect(() => {
    const fetchHistory = async () => {
      if (!selectedUser || !currentUser?.accessToken) return;
      
      try {
        const response = await fetch(`http://localhost:5001/api/v1/chat/history/${selectedUser._id}`, {
             headers: {
                Authorization: `Bearer ${currentUser.accessToken}`,
              },
        });
        
        if (response.ok) {
            const data = await response.json();
            setMessages(data.data);
        }
      } catch (error) {
          console.error("Error fetching history:", error);
      }
    };
    
    if (selectedUser) {
        fetchHistory();
    }
  }, [selectedUser, currentUser, setMessages]);

  const handleSend = () => {
    if (!newMessage.trim() || !selectedUser) return;
    sendMessage(selectedUser._id, newMessage);
    setNewMessage("");
  };
  
  // Filter messages for current conversation
  const currentMessages = messages.filter(
      msg => 
        (msg.senderId._id === selectedUser?._id && msg.receiverId._id === currentUser?.id) ||
        (msg.senderId._id === currentUser?.id && msg.receiverId._id === selectedUser?._id)
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-80px)]">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full">
            {/* Sidebar - Conversations */}
            <Card className="md:col-span-1 p-4 h-full flex flex-col">
                <h2 className="text-xl font-bold mb-4">Messages</h2>
                <Separator className="mb-4" />
                <ScrollArea className="flex-1">
                    <div className="space-y-2">
                        {conversations.length === 0 ? (
                            <p className="text-muted-foreground text-sm">No conversations yet.</p>
                        ) : (
                            conversations.map((user) => (
                                <button
                                    key={user._id}
                                    onClick={() => setSelectedUser(user)}
                                    className={cn(
                                        "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left",
                                        selectedUser?._id === user._id 
                                            ? "bg-primary/10" 
                                            : "hover:bg-muted"
                                    )}
                                >
                                    <Avatar>
                                        <AvatarImage src={user.avatar} />
                                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="overflow-hidden">
                                        <p className="font-medium truncate">{user.name}</p>
                                        <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </Card>
            
            {/* Main Chat Area */}
             <Card className="md:col-span-3 p-4 h-full flex flex-col">
                {selectedUser ? (
                    <>
                        <div className="flex items-center gap-3 mb-4 p-2 border-b">
                            <Avatar>
                                <AvatarImage src={selectedUser.avatar} />
                                <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-bold">{selectedUser.name}</h3>
                                <div className="flex items-center gap-2">
                                     <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                                     <span className="text-xs text-muted-foreground">Online</span>
                                </div>
                            </div>
                        </div>
                        
                        <ScrollArea className="flex-1 pr-4">
                            <div className="space-y-4">
                                {currentMessages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "flex w-full mb-4",
                                            msg.senderId._id === currentUser?.id ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "max-w-[70%] p-3 rounded-2xl text-sm",
                                                msg.senderId._id === currentUser?.id
                                                    ? "bg-primary text-primary-foreground rounded-br-none"
                                                    : "bg-muted text-foreground rounded-bl-none"
                                            )}
                                        >
                                            <p>{msg.message}</p>
                                            <p className={cn(
                                                "text-[10px] mt-1 text-right opacity-70",
                                                msg.senderId._id === currentUser?.id ? "text-primary-foreground" : "text-muted-foreground"
                                            )}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>
                        
                        <div className="mt-4 flex gap-2 pt-2 border-t">
                             <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                className="flex-1"
                             />
                             <Button onClick={handleSend} size="icon">
                                 <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-4 h-4"
                                  >
                                    <line x1="22" y1="2" x2="11" y2="13" />
                                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                  </svg>
                             </Button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                        <div className="bg-muted/50 p-6 rounded-full mb-4">
                             <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-12 h-12 opacity-50"
                              >
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                              </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Select a Conversation</h3>
                        <p>Choose a user from the sidebar to start chatting</p>
                    </div>
                )}
             </Card>
         </div>
      </div>
    </div>
  );
}
