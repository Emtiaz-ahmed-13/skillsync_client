"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSocket } from "@/hooks/use-socket";
import { Loader2, MessageCircle, Send, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Message {
  _id: string;
  senderId: {
    _id: string;
    name: string;
    avatar?: string;
  } | string;
  receiverId: {
    _id: string;
    name: string;
    avatar?: string;
  } | string;
  message: string;
  createdAt: string;
  isOwn?: boolean;
}

interface Participant {
  _id: string;
  name: string;
  role: string;
  email?: string;
  avatar?: string;
}

export default function RealtimeMessaging({ projectId }: { projectId: string }) {
  const { data: session } = useSession();
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]); // Initialize as empty array
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeParticipant, setActiveParticipant] = useState<Participant | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch project details and chat history
  useEffect(() => {
    const fetchProjectData = async () => {
      const user = session?.user as any;
      if (!projectId || !user?.accessToken) return;

      try {
        // 1. Fetch Project Details
        const res = await fetch(`/api/v1/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        });
        const data = await res.json();
        
        if (data.success) {
          const project = data.data;
          const currentUserId = user.id;
          
          const ownerId = typeof project.ownerId === 'object' ? project.ownerId._id : project.ownerId;
          
          // 2. Fetch Project Bids to find the Freelancer
          const bidsRes = await fetch(`/api/v1/bids/project/${projectId}`, {
              headers: { Authorization: `Bearer ${user.accessToken}` },
          });
          const bidsData = await bidsRes.json();
          const acceptedBid = bidsData.success ? bidsData.data.find((b: any) => b.status === 'accepted' || b.status === 'in-progress') : null;
          // Note: status 'in-progress' might not strictly exist on Bid, but covering bases if schema differed.
          // Usually Bid status is accepted, then Project becomes in-progress.
          
          const freelancerId = acceptedBid 
            ? (typeof acceptedBid.freelancerId === 'object' ? acceptedBid.freelancerId._id : acceptedBid.freelancerId)
            : null;

          const freelancerUser = acceptedBid && typeof acceptedBid.freelancerId === 'object' ? acceptedBid.freelancerId : null;


          // 3. Fetch Conversations
          const conversationsRes = await fetch("/api/v1/chat/conversations", {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          });
          const conversationsData = await conversationsRes.json();
          
          // Map conversations to participants
          // We also want to assign correct ROLES (Client vs Freelancer) specific to THIS projectContext if possible
          // But technically 'participants' here are people I have chatted with.
          let convParticipants: Participant[] = [];
          
          if (conversationsData.success) {
               convParticipants = conversationsData.data.map((c: any) => {
                 // The other party is the participant
                 // "withUser" logic depends on backend response structure for /conversations
                 // Assuming existing logic was correct or response is list of users
                 // If the endpoint returns "users I have separate chats with":
                 return {
                   _id: c._id,
                   name: c.name,
                   // Logic to determine role relative to THIS project
                   role: c._id === ownerId ? "Client" : (c._id === freelancerId ? "Freelancer" : (c.role || "User")), 
                   email: c.email,
                   avatar: c.avatar
                 };
               });
          }

          // 4. Ensure Key Players are in the list
          
          // If I am the Freelancer (or just a user), make sure Client is in the list
          if (currentUserId !== ownerId) {
               // Check if Owner is already in conversations
               if (!convParticipants.find((p) => p._id === ownerId)) {
                   if (typeof project.ownerId === 'object') {
                      const owner = project.ownerId;
                      convParticipants.push({
                          _id: owner._id,
                          name: owner.name || "Project Owner",
                          role: "Client",
                          email: owner.email,
                          avatar: owner.avatar
                      });
                   }
               }
          }
          
          // If I am the Client, make sure Freelancer is in the list (if exists)
          if (currentUserId === ownerId && freelancerId && freelancerUser) {
               if (!convParticipants.find((p) => p._id === freelancerId)) {
                   convParticipants.push({
                       _id: freelancerUser._id,
                       name: freelancerUser.name || "Freelancer",
                       role: "Freelancer",
                       email: freelancerUser.email,
                       avatar: freelancerUser.avatar
                   });
               }
          }
          
          // Update roles for existing participants again (just in case they were added before role logic)
          // Actually the map above handled existing. The pushes handled new.
          // But wait, if I pushed a simplified object, make sure it matches Participant interface.
          
          // Helper to fix roles in the final list
          const finalParticipants = convParticipants.map(p => ({
              ...p,
              role: p._id === ownerId ? "Client" : (p._id === freelancerId ? "Freelancer" : "User")
          }));

          setParticipants(finalParticipants);
          
          // Auto-select first participant if none selected
          if (finalParticipants.length > 0 && !activeParticipant) {
              setActiveParticipant(finalParticipants[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
        toast.error("Failed to load project details");
      }
    };

    fetchProjectData();
  }, [projectId, session]);

  // Fetch messages when active participant changes
  useEffect(() => {
    if (!activeParticipant) return;

    const fetchMessages = async () => {
      setLoading(true);
      const user = session?.user as any;
      try {
        const res = await fetch(`/api/v1/chat/history/${activeParticipant._id}`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        });
        const data = await res.json();
        if (data.success) {
          setMessages(data.data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [activeParticipant, session]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (newMessage: Message) => {
        // Only append if the message belongs to the current active chat
        // Check sender or receiver to match activeParticipant
        const otherId = typeof newMessage.senderId === 'object' ? newMessage.senderId._id : newMessage.senderId;
        
        if (activeParticipant && (otherId === activeParticipant._id)) {
            setMessages((prev) => [...prev, newMessage]);
        } else {
            // Optional: Show notification dot for other user
            toast.info(`New message from ${typeof newMessage.senderId === 'object' ? newMessage.senderId.name : "User"}`);
        }
    };
    
    const handleMessageSent = (sentMessage: Message) => {
        // Determine if this message belongs to current view (it should, as we sent it)
         setMessages((prev) => [...prev, sentMessage]);
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("message_sent", handleMessageSent);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("message_sent", handleMessageSent);
    };
  }, [socket, activeParticipant]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeParticipant || !socket) return;

    const user = session?.user as any;
    const payload = {
      receiverId: activeParticipant._id,
      message: newMessage,
      projectId: projectId,
    };

    socket.emit("send_message", payload);
    setNewMessage("");
  };
  
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const user = session?.user as any;

  return (
    <Card className="border-none shadow-2xl bg-gradient-to-br from-background to-background/50 backdrop-blur-xl md:border md:shadow-2xl overflow-hidden">
      <CardHeader className="px-6 py-4 border-b bg-muted/20">
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-full">
              <MessageCircle className="w-5 h-5 text-purple-600" />
            </div>
            <span className="font-bold tracking-tight">Messages</span>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-background/50 border shadow-sm">
             <div className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isConnected ? "bg-green-400" : "bg-red-400"}`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isConnected ? "bg-green-500" : "bg-red-500"}`}></span>
             </div>
             <span className="text-xs font-medium text-muted-foreground">{isConnected ? "Online" : "Offline"}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row h-[600px]">
          {/* Sidebar: Conversations */}
          <div className="w-full md:w-80 flex-shrink-0 border-r bg-muted/10 flex flex-col">
            <div className="p-4 border-b">
                <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-4">Conversations</h3>
                <div className="relative">
                    <Users className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search..." className="pl-9 bg-background/50 border-none shadow-sm focus-visible:ring-purple-500/20" />
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {participants.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-center p-4">
                      <p className="text-sm font-medium text-muted-foreground">No conversations yet</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">Chat will start when you connect with a freelancer or client.</p>
                  </div>
              ) : (
                  participants.map((participant) => (
                    <div
                      key={participant._id}
                      onClick={() => setActiveParticipant(participant)}
                      className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border border-transparent ${
                        activeParticipant?._id === participant._id 
                            ? "bg-purple-600 shadow-lg shadow-purple-900/20 md:translate-x-1" 
                            : "hover:bg-background hover:shadow-md hover:border-border/50"
                      }`}
                    >
                      <div className={`relative w-10 h-10 rounded-full flex items-center justify-center font-semibold shadow-sm text-sm transition-transform group-hover:scale-105 ${
                          activeParticipant?._id === participant._id 
                          ? "bg-white text-purple-600" 
                          : "bg-gradient-to-tr from-purple-100 to-indigo-100 text-purple-700 dark:from-purple-900 dark:to-indigo-900 dark:text-indigo-200"
                      }`}>
                        {participant.name.charAt(0)}
                        {/* Online indicator mock */}
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-background rounded-full bg-green-500"></span>
                      </div>
                      <div className="overflow-hidden flex-1">
                        <p className={`text-sm font-semibold truncate ${
                             activeParticipant?._id === participant._id ? "text-white" : "text-foreground"
                        }`}>{participant.name}</p>
                        <p className={`text-xs truncate ${
                             activeParticipant?._id === participant._id ? "text-purple-100" : "text-muted-foreground"
                        }`}>
                          {participant.role}
                        </p>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col bg-gradient-to-b from-background to-muted/20 relative">
             {/* Grid Pattern Overlay */}
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

             {activeParticipant ? (
                 <>
                    {/* Active Chat Header */}
                    <div className="p-4 border-b bg-background/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                             <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-medium shadow-md">
                                {activeParticipant.name.charAt(0)}
                             </div>
                             <div>
                                <h4 className="font-semibold text-sm leading-none mb-1">{activeParticipant.name}</h4>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    <p className="text-xs text-muted-foreground">Active Now - {activeParticipant.role}</p>
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Messages Feed */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-6 scroll-smooth">
                        {loading ? (
                            <div className="flex h-full items-center justify-center flex-col gap-3">
                                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                                <p className="text-sm text-muted-foreground animate-pulse">Loading conversation...</p>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center text-center p-8">
                                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                     <MessageCircle className="w-8 h-8 text-muted-foreground/50" />
                                </div>
                                <h5 className="font-medium text-foreground mb-1">Start the conversation</h5>
                                <p className="text-sm text-muted-foreground max-w-xs">
                                  Say hello to {activeParticipant.name} to discuss the project details.
                                </p>
                            </div>
                        ) : (
                            messages.map((message, index) => {
                                const senderId = typeof message.senderId === 'object' ? message.senderId._id : message.senderId;
                                const isMe = senderId === user.id;
                                // Check if previous message was from same sender to group visually
                                const prevMessage = messages[index - 1];
                                const prevSenderId =
                                  index > 0 && prevMessage
                                    ? typeof prevMessage.senderId === "object"
                                      ? prevMessage.senderId._id
                                      : prevMessage.senderId
                                    : null;

                                const isSequence =
                                  index > 0 && prevSenderId === senderId;
                                
                                return (
                                    <div
                                        key={message._id}
                                        className={`flex ${isMe ? "justify-end" : "justify-start"} ${isSequence ? "mt-1" : "mt-6"}`}
                                    >
                                        <div className={`flex flex-col max-w-[80%] md:max-w-[65%] ${isMe ? "items-end" : "items-start"}`}>
                                            {!isMe && !isSequence && (
                                                <span className="text-xs font-medium text-muted-foreground ml-1 mb-1.5">
                                                  {typeof message.senderId === 'object' ? message.senderId.name : "User"}
                                                </span>
                                            )}
                                            
                                            <div
                                            className={`px-5 py-3 rounded-2xl shadow-sm relative group ${
                                                isMe
                                                ? "bg-purple-600 text-white rounded-tr-sm"
                                                : "bg-white dark:bg-zinc-800 border rounded-tl-sm text-foreground"
                                            }`}
                                            >
                                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
                                                <span className={`text-[10px] absolute bottom-1 right-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                                                    isMe ? "text-purple-100" : "text-muted-foreground"
                                                }`}>
                                                    {formatTime(message.createdAt)}
                                                </span>
                                            </div>
                                            
                                         
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-background/80 backdrop-blur-md border-t">
                        <div className="flex gap-3 max-w-4xl mx-auto">
                           <div className="relative flex-1">
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="pr-12 py-6 bg-muted/40 border-muted focus-visible:ring-purple-500/20 focus-visible:border-purple-500 rounded-xl"
                                    onKeyPress={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                    }}
                                />
                                <Button 
                                    onClick={handleSendMessage} 
                                    disabled={!newMessage.trim() || !isConnected}
                                    size="icon"
                                    className={`absolute right-2 top-1.5 h-9 w-9 rounded-lg transition-all ${
                                        newMessage.trim() 
                                        ? "bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20" 
                                        : "bg-muted text-muted-foreground hover:bg-muted"
                                    }`}
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                           </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground text-center mt-3">
                            Press <kbd className="font-sans px-1 rounded bg-muted">Enter</kbd> to send
                        </p>
                    </div>
                 </>
             ) : (
                 <div className="flex-1 flex flex-col items-center justify-center p-8 bg-muted/10">
                     <div className="max-w-md text-center space-y-6">
                        <div className="relative mx-auto w-24 h-24 mb-4">
                            <div className="absolute inset-0 bg-purple-500/10 rounded-full animate-ping delay-75"></div>
                            <div className="absolute inset-2 bg-purple-500/20 rounded-full animate-ping delay-150"></div>
                            <div className="relative w-full h-full bg-background border-2 border-purple-500/20 rounded-full flex items-center justify-center">
                                <MessageCircle className="w-10 h-10 text-purple-600" />
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-2">Real-time Messaging</h3>
                            <p className="text-muted-foreground">
                                Select a conversation from the sidebar to chat instantly with your team. 
                                History stays saved so you can catch up anytime.
                            </p>
                        </div>
                     </div>
                 </div>
             )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
