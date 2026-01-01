"use client";

import RealtimeMessaging from "@/components/features/common/realtime-messaging";
import { ClientReviews } from "@/components/features/dashboard/client-reviews";
import { MeetingRequestModal } from "@/components/features/dashboard/meeting-request-modal";
import { Navbar } from "@/components/shared/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Project {
  _id: string;
  title: string;
  description: string;
  minimumBid: number;
  budget: number;
  technology: string[];
  status: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

interface Bid {
  _id: string;
  projectId: string;
  freelancerId: string | { name: string; email: string };
  amount: number;
  proposal: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  freelancer: {
    name: string;
    email: string;
    hourlyRate?: number;
    skills?: string[];
  };
  resumeUrl?: string;
}

interface Feature {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
}


interface WorkSubmission {
  _id: string;
  projectId: string;
  sprintId: string | { title: string }; 
  freelancerId: string | { name: string; email: string }; 
  completedFeatures: string[];
  remainingFeatures: string[];
  githubLink: string;
  liveLink?: string;
  meetingLink?: string;
  notes?: string;
  status: "pending" | "review" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  freelancer?: {
    name: string;
    email: string;
    hourlyRate?: number;
    skills?: string[];
  };
  sprint?: {
    title: string;
    description: string;
    features: Feature[];
  };
}

export default function ClientProjectDetailsClient({ id }: { id: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [workSubmissions, setWorkSubmissions] = useState<WorkSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated" && session?.user) {
      const sessionUser = session.user as { role?: string };
      if (sessionUser.role !== "client") {
        router.push("/dashboard");
      } else {
        fetchProjectDetails();
      }
    }
  }, [status, session, router, id]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const sessionUser = session?.user as {
        accessToken?: string;
        role?: string;
      };
      const accessToken = sessionUser?.accessToken;

      if (!accessToken) {
        setError("Authentication token not available");
        return;
      }

      // Fetch project details
      const projectResponse = await fetch(
        `http://localhost:5001/api/v1/projects/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!projectResponse.ok) {
        throw new Error("Failed to fetch project");
      }

      const projectData = await projectResponse.json();
      if (projectData.success && projectData.data) {
        setProject(projectData.data);
      } else {
        throw new Error("Project not found");
      }

      // Fetch bids for this project
      const bidsResponse = await fetch(
        `http://localhost:5001/api/v1/bids/project/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!bidsResponse.ok) {
        throw new Error("Failed to fetch bids");
      }

      const bidsData = await bidsResponse.json();
      if (bidsData.success && bidsData.data && Array.isArray(bidsData.data)) {
        setBids(bidsData.data);
      } else {
        setBids([]);
      }

      // Fetch work submissions for this project using the API function
      try {
        const { getWorkSubmissionsByProject } = await import(
          "@/lib/api/work-submission-api"
        );
        const response = await getWorkSubmissionsByProject(id, accessToken);
        if (response.success && response.data && Array.isArray(response.data)) {
          setWorkSubmissions(response.data);
        } else {
          setWorkSubmissions([]);
        }
      } catch (error) {
        console.error("Error fetching work submissions:", error);
        setWorkSubmissions([]);
      }
    } catch (err) {
      console.error("Error fetching project details:", err);
      setError("Failed to load project details");
      toast.error("Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBid = async (bidId: string) => {
    if (!bidId) {
      toast.error("Invalid bid ID");
      return;
    }
    
    try {
      const sessionUser = session?.user as { accessToken?: string };
      const accessToken = sessionUser?.accessToken;

      if (!accessToken) {
        toast.error("Authentication token not available");
        return;
      }

      const response = await fetch(
        `http://localhost:5001/api/v1/bids/${bidId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            status: "accepted",
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
        
          setBids((prevBids) =>
            prevBids.map((bid) =>
              (bid._id === bidId || (bid as any).id === bidId) ? { ...bid, status: "accepted" } : bid
            )
          );
          toast.success("Bid accepted successfully!");

          if (project) {
            setProject({ ...project, status: "in-progress" });
          }
        } else {
          toast.error(result.message || "Failed to accept bid");
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to accept bid");
      }
    } catch (error) {
      console.error("Error accepting bid:", error);
      toast.error("An error occurred while accepting the bid");
    }
  };

  const [meetingModalOpen, setMeetingModalOpen] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);

  const handleApproveWork = async (submissionId: string) => {
      try {
        const sessionUser = session?.user as { accessToken?: string };
        const accessToken = sessionUser?.accessToken;
  
        if (!accessToken) {
          toast.error("Authentication token not available");
          return;
        }
  
        const response = await fetch(
          `http://localhost:5001/api/v1/work-submissions/${submissionId}/status`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              status: "approved",
            }),
          }
        );
  
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setWorkSubmissions((prev) =>
              prev.map((sub) =>
                sub._id === submissionId ? { ...sub, status: "approved" } : sub
              )
            );
            toast.success("Work approved successfully!");
          } else {
            toast.error(result.message || "Failed to approve work");
          }
        } else {
          toast.error("Failed to approve work");
        }
      } catch (error) {
        console.error("Error approving work:", error);
        toast.error("An error occurred while approving work");
      }
    };
  
    const handleRequestMeeting = (submissionId: string) => {
      setSelectedSubmissionId(submissionId);
      setMeetingModalOpen(true);
    };
  
    const submitMeetingRequest = async (link: string) => {
      if (!selectedSubmissionId) return;
  
      try {
        const sessionUser = session?.user as { accessToken?: string };
        const accessToken = sessionUser?.accessToken;
  
        if (!accessToken) {
          toast.error("Authentication token not available");
          return;
        }
        
        const response = await fetch(
          `http://localhost:5001/api/v1/work-submissions/${selectedSubmissionId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              status: "review",
              meetingLink: link,
            }),
          }
        );
  
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setWorkSubmissions((prev) =>
              prev.map((sub) =>
                sub._id === selectedSubmissionId
                  ? { ...sub, status: "review", meetingLink: link }
                  : sub
              )
            );
            toast.success("Meeting requested successfully!");
            setMeetingModalOpen(false);
            setSelectedSubmissionId(null);
          } else {
            toast.error(result.message || "Failed to request meeting");
          }
        } else {
            toast.error("Failed to request meeting");
        }
      } catch (error) {
        console.error("Error requesting meeting:", error);
        toast.error("An error occurred while requesting meeting");
      }
    };

  const handleRejectBid = async (bidId: string) => {
    if (!bidId) {
      toast.error("Invalid bid ID");
      return;
    }

    try {
      const sessionUser = session?.user as { accessToken?: string };
      const accessToken = sessionUser?.accessToken;

      if (!accessToken) {
        toast.error("Authentication token not available");
        return;
      }

      const response = await fetch(
        `http://localhost:5001/api/v1/bids/${bidId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            status: "rejected",
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
      
          setBids((prevBids) =>
            prevBids.map((bid) =>
              (bid._id === bidId || (bid as any).id === bidId) ? { ...bid, status: "rejected" } : bid
            )
          );
          toast.success("Bid rejected successfully!");
        } else {
          toast.error(result.message || "Failed to reject bid");
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to reject bid");
      }
    } catch (error) {
      console.error("Error rejecting bid:", error);
      toast.error("An error occurred while rejecting the bid");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background overflow-hidden relative">
        <Navbar />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="flex justify-center items-center h-32">
            <p>Loading project details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background overflow-hidden relative">
        <Navbar />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <Button className="mt-4" onClick={() => router.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background overflow-hidden relative">
        <Navbar />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="text-center py-8">
            <p>Project not found</p>
            <Button className="mt-4" onClick={() => router.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalFreelancers = new Set(bids.map((bid) => bid.freelancerId)).size;
  const totalBids = bids.length;
  const acceptedBids = bids.filter((bid) => bid.status === "accepted").length;
  const pendingBids = bids.filter((bid) => bid.status === "pending").length;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <Navbar />
      <div className="mt-20"></div>

      <div className="flex-1 container max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-8 pt-32 relative z-10">
      
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <Badge variant={project.status === "in-progress" ? "default" : "secondary"} className="uppercase tracking-wider text-[10px]">
                  {project.status}
               </Badge>
               <span className="text-xs text-muted-foreground">{new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{project.title}</h1>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" onClick={() => router.back()}>Back to Dashboard</Button>
          </div>
        </div>

        <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg w-full md:w-fit mb-8 backdrop-blur-sm border">
           {["overview", "bids", "submissions", "messages", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
           ))}
        </div>

        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
  
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Bids", value: totalBids, icon: "📄" },
                  { label: "Freelancers", value: totalFreelancers, icon: "👥" },
                  { label: "Pending Review", value: pendingBids, icon: "hourglass" },
                  { label: "Accepted", value: acceptedBids, icon: "checkmark" }
                ].map((stat, i) => (
                  <Card key={i} className="bg-card/50 backdrop-blur-sm border-muted/60 hover:border-purple-500/30 transition-colors">
                    <CardHeader className="pb-2">
                       <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                    </CardHeader>
                    <CardContent>
                       <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
      
               <Card className="md:col-span-2 bg-card/50 backdrop-blur-sm border-muted/60">
                 <CardHeader>
                   <CardTitle>Project Description</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-6">
                    <p className="leading-relaxed text-muted-foreground whitespace-pre-line">{project.description}</p>
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-3 text-foreground">Required Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.technology.map((tech, index) => (
                          <Badge key={`tech-${index}`} variant="secondary" className="px-3 py-1 bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 border-purple-200/20">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                 </CardContent>
               </Card>
  
               <Card className="bg-card/50 backdrop-blur-sm border-muted/60 h-fit">
                 <CardHeader>
                   <CardTitle>Details</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-dashed border-muted">
                       <span className="text-sm text-muted-foreground">Budget</span>
                       <span className="font-semibold">${project.budget}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-dashed border-muted">
                       <span className="text-sm text-muted-foreground">Minimum Bid</span>
                       <span className="font-semibold">${project.minimumBid}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-dashed border-muted">
                       <span className="text-sm text-muted-foreground">Project ID</span>
                       <span className="font-mono text-xs text-muted-foreground truncate max-w-[100px]">{project._id}</span>
                    </div>
                 </CardContent>
               </Card>
            </div>
          </motion.div>
        )}

        {activeTab === "bids" && (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
             <Card className="border-none bg-transparent shadow-none">
               <CardHeader className="px-0 pt-0">
                  <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Proposals</CardTitle>
                        <CardDescription>Manage and review freelancer bids.</CardDescription>
                    </div>
                    <Badge variant="outline">{bids.length} Total</Badge>
                  </div>
               </CardHeader>
               <CardContent className="px-0 space-y-4">
                 {bids.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl bg-muted/20">
                       <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                          <span className="text-xl">📄</span>
                       </div>
                       <h3 className="text-lg font-medium">No proposals yet</h3>
                       <p className="text-muted-foreground max-w-sm mt-2">Freelancers will submit proposals here. Check back soon!</p>
                    </div>
                 ) : (
                    bids.map((bid) => {
                       const bidId = bid._id || (bid as any).id;
                       return (
                         <div key={typeof bid._id === "string" ? bid._id : `bid-${bid.amount}`} 
                              className="group p-5 rounded-xl border bg-card/60 backdrop-blur-sm hover:shadow-lg hover:border-purple-500/40 transition-all duration-300">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                               <div className="flex-1 space-y-3">
                                  <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                                         {(bid.freelancer?.name || (bid.freelancerId as any)?.name || "U").charAt(0)}
                                     </div>
                                     <div>
                                        <h3 className="font-semibold text-base">
                                            {bid.freelancer ? bid.freelancer.name : (bid.freelancerId && typeof bid.freelancerId === 'object' ? (bid.freelancerId as any).name : "Unknown Freelancer")}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                           {bid.freelancer ? bid.freelancer.email : (bid.freelancerId && typeof bid.freelancerId === 'object' ? (bid.freelancerId as any).email : "No email")}
                                        </p>
                                     </div>
                                     <Badge variant={
                                         bid.status === "accepted" ? "default" : 
                                         bid.status === "rejected" ? "destructive" : "secondary"
                                     } className="capitalize ml-2">
                                         {bid.status}
                                     </Badge>
                                  </div>
                                  
                                  <div className="pl-13 md:pl-0">
                                     <div className="flex items-center gap-4 mb-3 text-sm">
                                        <span className="font-medium bg-secondary/50 px-2 py-1 rounded text-secondary-foreground">Bid: ${bid.amount}</span>
                                        {((bid.freelancer?.hourlyRate) || (bid.freelancerId as any)?.hourlyRate) && (
                                            <span className="text-muted-foreground">Rate: ${bid.freelancer?.hourlyRate || (bid.freelancerId as any)?.hourlyRate}/hr</span>
                                        )}
                                     </div>
                                     <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 p-3 rounded-lg border border-transparent group-hover:border-border/60 transition-colors">
                                        {bid.proposal}
                                     </p>
                                  </div>
                               </div>
                               
                               <div className="flex md:flex-col gap-2 md:min-w-[120px] justify-start md:justify-center">
                                  {bid.status === "pending" && (
                                    <>
                                        {bid.resumeUrl && (
                                          <Button 
                                            size="sm" 
                                            variant="outline" 
                                            onClick={() => window.open(bid.resumeUrl, "_blank")}
                                            className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                                          >
                                            <span className="mr-1">📄</span> Resume
                                          </Button>
                                        )}
                                        <Button size="sm" onClick={() => bidId && handleAcceptBid(bidId)} className="w-full bg-green-600 hover:bg-green-700 text-white">Accept</Button>
                                        <Button size="sm" variant="outline" onClick={() => bidId && handleRejectBid(bidId)} className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">Reject</Button>
                                    </>
                                  )}
                                   {bid.status === "accepted" && (
                                       <div className="flex flex-col gap-2 w-full">
                                          {bid.resumeUrl && (
                                            <Button 
                                              size="sm" 
                                              variant="outline" 
                                              onClick={() => window.open(bid.resumeUrl, "_blank")}
                                              className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                                            >
                                              <span className="mr-1">📄</span> Resume
                                            </Button>
                                          )}
                                          <div className="flex flex-col items-center justify-center h-full text-green-600 bg-green-500/10 rounded-lg p-2">
                                              <span className="text-xl mb-1">✓</span>
                                              <span className="text-xs font-semibold">Selection</span>
                                          </div>
                                       </div>
                                   )}
                               </div>
                            </div>
                         </div>
                       )
                    })
                 )}
               </CardContent>
             </Card>
           </motion.div>
        )}
        {activeTab === "submissions" && (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
             <Card className="border-none bg-transparent shadow-none">
                <CardHeader className="px-0 pt-0 flex flex-row justify-between items-center">
                     <div>
                        <CardTitle>Work Submissions</CardTitle>
                        <CardDescription>Review work submitted for sprints.</CardDescription>
                     </div>
                     <Button variant="outline" size="sm" onClick={fetchProjectDetails} disabled={loading}>
                        Refresh
                     </Button>
                </CardHeader>
                <CardContent className="px-0 space-y-4">
                  {workSubmissions.length === 0 ? (
                     <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl bg-muted/20">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                           <span className="text-xl">🛠️</span>
                        </div>
                        <h3 className="text-lg font-medium">No work submitted yet</h3>
                        <p className="text-muted-foreground max-w-sm mt-2">Freelancers will submit their completed sprint work here for your review.</p>
                     </div>
                  ) : (
                     workSubmissions.map((submission) => (
                        <div key={submission._id} className="p-5 border rounded-xl bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
                           <div className="flex justify-between items-start mb-4">
                              <div>
                                 <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-lg text-foreground">
                                        {submission.sprint ? submission.sprint.title : (submission.sprintId && typeof submission.sprintId === 'object' ? (submission.sprintId as any)?.title : "Sprint Work")}
                                    </h3>
                                    <Badge className={
                                       submission.status === "approved" ? "bg-green-500 hover:bg-green-600" :
                                       submission.status === "pending" ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-500 hover:bg-blue-600"
                                    }>{submission.status}</Badge>
                                 </div>
                                 <p className="text-xs text-muted-foreground">Submitted on {new Date(submission.createdAt).toLocaleDateString()}</p>
                              </div>
                              <div className="flex gap-2">
                                  {submission.status !== "approved" && (
                                     <Button size="sm" onClick={() => handleApproveWork(submission._id)} className="bg-green-600 hover:bg-green-700">Approve</Button>
                                  )}
                                  <Button size="sm" variant="outline" onClick={() => handleRequestMeeting(submission._id)}>Request Meeting</Button>
                              </div>
                           </div>

                           <div className="grid md:grid-cols-2 gap-4 mt-4 bg-muted/30 p-4 rounded-lg">
                              <div>
                                 <h4 className="text-xs uppercase font-semibold text-muted-foreground mb-2">Deliverables</h4>
                                 <ul className="space-y-1">
                                    {submission.githubLink && (
                                       <li>
                                          <a href={submission.githubLink} target="_blank" rel="noreferrer" className="text-sm text-purple-600 hover:underline flex items-center gap-1">
                                             Github Repository ↗
                                          </a>
                                       </li>
                                    )}
                                    {submission.liveLink && (
                                       <li>
                                          <a href={submission.liveLink} target="_blank" rel="noreferrer" className="text-sm text-purple-600 hover:underline flex items-center gap-1">
                                             Live Demo ↗
                                          </a>
                                       </li>
                                    )}
                                 </ul>
                              </div>
                              <div>
                                 <h4 className="text-xs uppercase font-semibold text-muted-foreground mb-2">Notes</h4>
                                 <p className="text-sm text-foreground/80">{submission.notes || "No notes provided."}</p>
                              </div>
                           </div>
                        </div>
                     ))
                  )}
                </CardContent>
             </Card>
           </motion.div>
        )}
        {activeTab === "messages" && (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="pt-2">
               <RealtimeMessaging projectId={id} />
           </motion.div>
        )}

        {activeTab === "reviews" && (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
               <ClientReviews />
           </motion.div>
        )}

      </div>
      <MeetingRequestModal
        isOpen={meetingModalOpen}
        onClose={() => setMeetingModalOpen(false)}
        onSubmit={submitMeetingRequest}
        loading={loading}
      />
    </div>
  );
}
