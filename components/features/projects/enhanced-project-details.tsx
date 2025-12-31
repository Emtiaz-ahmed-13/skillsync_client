"use client";

import { Navbar } from "@/components/shared/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import RealtimeMessaging from "../common/realtime-messaging";
import WorkSubmission from "../tasks/work-submission";
import SprintPlan from "./sprint-planning";

interface Project {
  id: string;
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

interface FreelancerUser {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  role?: string;
  accessToken?: string;
}

interface Bid {
  id: string;
  projectId: string;
  freelancerId: string;
  amount: number;
  proposal: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function EnhancedProjectDetailsClient({
  user,
  projectId,
}: {
  user: FreelancerUser;
  projectId: string;
}) {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState<number | string>("");
  const [bidMessage, setBidMessage] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [bidSubmitting, setBidSubmitting] = useState(false);
  const [bidSuccess, setBidSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [bids, setBids] = useState<Bid[]>([]);
  const [freelancerBid, setFreelancerBid] = useState<Bid | null>(null);

  // Set the active tab based on URL parameter
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (
      tab &&
      [
        "overview",
        "sprint-plan",
        "work-submission",
        "work-submission",
        "messaging",
      ].includes(tab)
    ) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (status === "authenticated") {
      if (user?.role !== "freelancer") {
        // Redirect to correct dashboard if user is not a freelancer
        switch (user?.role) {
          case "client":
            router.push("/dashboard/client");
            break;
          case "admin":
            router.push("/dashboard/admin");
            break;
          default:
            router.push("/dashboard");
        }
      }
    } else if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, user, router]);

  useEffect(() => {
    const fetchProjectAndBids = async () => {
      try {
        // Fetch project details
        const projectResponse = await fetch(
          `/api/v1/projects/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${user?.accessToken || ""}`,
            },
          }
        );

        if (projectResponse.ok) {
          const projectData = await projectResponse.json();
          if (projectData.success && projectData.data) {
            setProject(projectData.data);
          } else {
            setError("Project not found");
          }
        } else {
          setError("Failed to fetch project");
        }

        const bidsResponse = await fetch(
          `/api/v1/bids/project/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${user?.accessToken || ""}`,
            },
          }
        );

        if (bidsResponse.ok) {
          const bidsData = await bidsResponse.json();
          if (bidsData.success && bidsData.data && bidsData.data.bids) {
            setBids(bidsData.data.bids);

            // Find the freelancer's bid if it exists
            const userBid = bidsData.data.bids.find(
              (bid: Bid) => bid.freelancerId === user?.id
            );
            setFreelancerBid(userBid || null);
          }
        }
      } catch (err) {
        setError("Error fetching project or bids");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectAndBids();
  }, [projectId, user?.id, user?.accessToken]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();

    if (freelancerBid) {
      toast.error("You have already placed a bid on this project");
      return;
    }

    if (!bidAmount || !bidMessage || !user?.accessToken || !user?.id) {
      toast.error("Please fill all required fields");
      return;
    }
    if (bidMessage.length < 10) {
      toast.error("Proposal must be at least 10 characters long");
      return;
    }

    // Validate amount is positive
    if (Number(bidAmount) <= 0) {
      toast.error("Bid amount must be a positive number");
      return;
    }

    if (project && Number(bidAmount) < project.minimumBid) {
      toast.error(`Bid amount must be at least $${project.minimumBid}`);
      return;
    }

    setBidSubmitting(true);

    try {
      // Upload resume if provided
      if (resumeFile) {
        const resumeFormData = new FormData();
        resumeFormData.append("file", resumeFile);
        resumeFormData.append("fileType", "resume");
        // Use the project ID for the resume upload
        resumeFormData.append("projectId", project!._id);

        const resumeUploadResponse = await fetch(
          "/api/v1/files",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
            body: resumeFormData,
          }
        );

        if (!resumeUploadResponse.ok) {
          const resumeUploadError = await resumeUploadResponse.json();
          console.error("Resume upload error response:", resumeUploadError);
          toast.error(
            resumeUploadError.message ||
              `Resume upload failed with status ${resumeUploadResponse.status}`
          );
          return;
        }

        const resumeUploadResult = await resumeUploadResponse.json();
        console.log("Resume upload result:", resumeUploadResult);
      }
      const bidData = {
        projectId: project!._id,
        amount: Number(bidAmount),
        proposal: bidMessage,
      };

      // Submit the bid
      const response = await fetch("/api/v1/bids",
         {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify(bidData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
    
          try {
            const notificationResponse = await fetch(
              "/api/v1/notifications",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${user.accessToken}`,
                },
                body: JSON.stringify({
                  recipientId: project?.ownerId,
                  title: "New Bid Received",
                  message: `A freelancer has submitted a bid on your project: ${project?.title}`,
                  type: "bid_submitted",
                  data: {
                    projectId: project?._id,
                    bidId: data.data?._id || data.data?.id,
                    bidderName: user.name,
                  },
                }),
              }
            );

            if (!notificationResponse.ok) {

              const notificationErrorData = await notificationResponse.text();
              console.error(
                "Failed to send notification to project owner:",
                notificationResponse.status,
                notificationErrorData
              );
            }
          } catch (notificationError) {
            console.error("Error sending notification:", notificationError);
          }
          const newBid: Bid = {
            id: data.data?._id || data.data?.id,
            projectId: project!._id,
            freelancerId: user.id!,
            amount: Number(bidAmount),
            proposal: bidMessage,
            status: "pending",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          setBids((prevBids) => [...prevBids, newBid]);
          setFreelancerBid(newBid);

          setBidSuccess(true);
          toast.success("Bid submitted successfully!");
          setBidAmount("");
          setBidMessage("");
          setResumeFile(null);
          setTimeout(() => {
            setBidSuccess(false);
          }, 3000);
        } else {
          toast.error(data.message || "Failed to submit bid");
        }
      } else {
        let errorData;
        let errorText = "Failed to submit bid";

        try {
          const responseText = await response.text();

          if (
            responseText.includes("<!DOCTYPE") ||
            responseText.includes("<html")
          ) {
            errorText = `Server error: ${response.status}`;
          } else {
            try {
              errorData = JSON.parse(responseText);
              errorText = errorData.message || `Error: ${response.status}`;
            } catch (parseError) {
              errorData = { message: responseText };
              errorText = responseText;
            }
          }
        } catch (e) {
          errorText = `Failed to submit bid: ${response.status} ${response.statusText}`;
        }

        toast.error(errorText);
        console.error("Bid submission error:", errorText);
      }
    } catch (err) {
      toast.error("An error occurred while submitting bid");
      console.error(err);
    } finally {
      setBidSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (loading) {
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

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="space-y-12 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-foreground">
              {project?.title}
            </h1>
            <p className="text-muted-foreground mt-2">Project Details</p>
          </motion.div>

          {/* Tabs Navigation */}
          <div className="flex border-b">
            <button
              className={`px-6 py-3 font-medium text-base ${
                activeTab === "overview"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`px-6 py-3 font-medium text-base ${
                activeTab === "sprint-plan"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("sprint-plan")}
            >
              Sprint Plan
            </button>
            <button
              className={`px-6 py-3 font-medium text-base ${
                activeTab === "work-submission"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("work-submission")}
            >
              Submit Work
            </button>

            <button
              className={`px-6 py-3 font-medium text-base ${
                activeTab === "messaging"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("messaging")}
            >
              Messaging
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Project Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                  <CardDescription>
                    Detailed information about the project
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4 p-4 bg-muted/20 rounded-lg border border-border/50">
                        <div className="p-2.5 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Budget</Label>
                          <p className="text-2xl font-bold text-foreground">
                            ${project?.budget?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 p-4 bg-muted/20 rounded-lg border border-border/50">
                         <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                         </div>
                         <div>
                            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Minimum Bid</Label>
                            <p className="text-2xl font-bold text-foreground">${project?.minimumBid?.toLocaleString()}</p>
                         </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center space-x-4 p-4 bg-muted/20 rounded-lg border border-border/50">
                           <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                           </div>
                           <div>
                              <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Status</Label>
                              <div className="mt-1">
                                <Badge variant={
                                   project?.status === 'in-progress' ? 'default' :
                                   project?.status === 'completed' ? 'secondary' :
                                   'outline'
                                } className="px-3 py-1 capitalize">
                                   {project?.status?.replace('-', ' ')}
                                </Badge>
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center space-x-4 p-4 bg-muted/20 rounded-lg border border-border/50">
                           <div className="p-2.5 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600 dark:text-orange-400">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                           </div>
                           <div>
                              <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Posted On</Label>
                              <p className="text-sm font-medium mt-1">
                                {new Date(project?.createdAt || "").toLocaleDateString(undefined, {
                                   year: 'numeric',
                                   month: 'long',
                                   day: 'numeric'
                                })}
                              </p>
                           </div>
                        </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <Label className="text-lg font-semibold">Description</Label>
                    <div className="text-muted-foreground mt-3 leading-relaxed whitespace-pre-line text-sm md:text-base">
                      {project?.description}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Label className="text-lg font-semibold">Required Skills</Label>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {project?.technology.map((tech, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-3 py-1.5 text-sm bg-muted hover:bg-muted/80"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bid Form - Only show if NO bid exists AND project is open for bidding */}
              {!freelancerBid && (project?.status === 'approved' || project?.status === 'pending') && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="border-t-4 border-t-primary shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl">Submit Your Bid</CardTitle>
                        <CardDescription>
                        Submit your proposal and budget for this project
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmitBid}>
                        <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="bid-amount" className="font-semibold">
                                Bid Amount ($) <span className="text-red-500">*</span>
                                </Label>
                                <div className="mt-2 relative">
                                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                    <Input
                                        id="bid-amount"
                                        type="number"
                                        min={project?.minimumBid}
                                        value={bidAmount}
                                        onChange={(e) => setBidAmount(e.target.value)}
                                        placeholder={`${project?.minimumBid}`}
                                        className="pl-7"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1.5 ml-1">
                                Minimum required: ${project?.minimumBid}
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="resume" className="font-semibold">Upload Resume (Optional)</Label>
                                <Input
                                    id="resume"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    className="mt-2 cursor-pointer"
                                />
                                <p className="text-xs text-muted-foreground mt-1.5 ml-1">
                                Max 5MB (PDF, DOC, DOCX)
                                </p>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="bid-proposal" className="font-semibold">
                            Proposal <span className="text-red-500">*</span>
                            </Label>
                            <textarea
                            id="bid-proposal"
                            value={bidMessage}
                            onChange={(e) => setBidMessage(e.target.value)}
                            placeholder="Why are you the right fit for this project? Describe your approach..."
                            className="w-full mt-2 p-4 border rounded-lg min-h-[150px] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-y bg-background"
                            required
                            />
                            <p className="text-xs text-muted-foreground mt-1.5 text-right">
                            {bidMessage.length} / 10 characters minimum
                            </p>
                        </div>

                        {bidSuccess && (
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg flex items-center gap-2 border border-green-200 dark:border-green-800">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Bid submitted successfully!
                            </div>
                        )}
                        </CardContent>

                        <div className="p-6 pt-0">
                        <Button
                            type="submit"
                            className="w-full py-6 text-lg font-medium shadow-md hover:shadow-lg transition-all"
                            disabled={bidSubmitting}
                        >
                            {bidSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                </span>
                            ) : "Submit Proposal"}
                        </Button>
                        </div>
                    </form>
                    </Card>
                </motion.div>
              )}

              {/* Display Freelancer's Bid if exists */}
              {freelancerBid && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card className="border-l-4 border-l-primary shadow-md">
                      <CardHeader className="bg-muted/30 pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                             <CardTitle className="text-xl">Bid Status</CardTitle>
                             <CardDescription>
                                Track the status of your proposal
                             </CardDescription>
                          </div>
                          <Badge
                            variant={
                              freelancerBid.status === "accepted"
                                ? "default"
                                : freelancerBid.status === "pending"
                                ? "secondary"
                                : "destructive"
                            }
                            className="px-4 py-1.5 text-sm capitalize"
                          >
                            {freelancerBid.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6 text-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          
                          <div className="space-y-6">
                             <div>
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Bid Amount</h4>
                                <p className="text-3xl font-bold text-foreground">
                                  ${freelancerBid.amount.toLocaleString()}
                                </p>
                             </div>
                             
                             <div>
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Submitted Date</h4>
                                <p className="font-medium">
                                  {new Date(freelancerBid.createdAt).toLocaleDateString([], { 
                                     weekday: 'long', 
                                     year: 'numeric', 
                                     month: 'long', 
                                     day: 'numeric' 
                                  })}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                   at {new Date(freelancerBid.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                             </div>
                          </div>

                          <div>
                             <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Proposal</h4>
                             <div className="bg-muted/30 p-4 rounded-lg border text-muted-foreground leading-relaxed italic">
                                "{freelancerBid.proposal}"
                             </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
              )}
            </motion.div>
          )}





          {activeTab === "messaging" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <RealtimeMessaging projectId={projectId} />
            </motion.div>
          )}

          {activeTab === "sprint-plan" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <SprintPlan projectId={projectId} project={project} />
            </motion.div>
          )}



          {activeTab === "work-submission" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <WorkSubmission projectId={projectId} project={project} />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
