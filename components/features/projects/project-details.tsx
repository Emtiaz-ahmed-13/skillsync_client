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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
  amount: number;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectDetailsClient({
  user,
  projectId,
}: {
  user: FreelancerUser;
  projectId: string;
}) {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState<number | string>("");
  const [bidMessage, setBidMessage] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [bidSubmitting, setBidSubmitting] = useState(false);
  const [bidSuccess, setBidSuccess] = useState(false);

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
    const fetchProject = async () => {
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1"
          }/projects/${projectId}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setProject(data.data);
          } else {
            setError("Project not found");
          }
        } else {
          setError("Failed to fetch project");
        }
      } catch (err) {
        setError("Error fetching project");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bidAmount || !bidMessage || !user?.accessToken || !user?.id) {
      toast.error("Please fill all required fields");
      return;
    }

    if (project && Number(bidAmount) < project.minimumBid) {
      toast.error(`Bid amount must be at least $${project.minimumBid}`);
      return;
    }

    setBidSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("projectId", project!._id);
      formData.append("amount", bidAmount.toString());
      formData.append("message", bidMessage);

      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1"}/bids`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setBidSuccess(true);
          toast.success("Bid submitted successfully!");

          // Reset form after success
          setBidAmount("");
          setBidMessage("");
          setResumeFile(null);

          // Reset after 3 seconds
          setTimeout(() => {
            setBidSuccess(false);
          }, 3000);
        } else {
          toast.error(data.message || "Failed to submit bid");
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to submit bid");
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
    return null; // Redirect effect will handle this
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background overflow-hidden relative">
        <Navbar />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
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
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
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
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="space-y-8 py-8">
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

          {/* Project Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
                <CardDescription>
                  Detailed information about the project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Budget</Label>
                    <p className="text-2xl font-semibold">${project?.budget}</p>
                  </div>
                  <div>
                    <Label>Minimum Bid</Label>
                    <p className="text-xl">${project?.minimumBid}</p>
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <p className="text-muted-foreground mt-1">
                    {project?.description}
                  </p>
                </div>

                <div>
                  <Label>Technologies</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project?.technology.map((tech, index) => (
                      <Badge key={index} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Status</Label>
                    <Badge variant="outline" className="ml-2">
                      {project?.status}
                    </Badge>
                  </div>
                  <div>
                    <Label>Created</Label>
                    <p className="text-muted-foreground">
                      {new Date(project?.createdAt || "").toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bid Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Submit Your Bid</CardTitle>
                <CardDescription>
                  Submit your bid and resume for this project
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmitBid}>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="bid-amount">
                      Bid Amount ($) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="bid-amount"
                      type="number"
                      min={project?.minimumBid}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder={`Minimum: $${project?.minimumBid}`}
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum bid: ${project?.minimumBid}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="bid-message">
                      Cover Letter <span className="text-red-500">*</span>
                    </Label>
                    <textarea
                      id="bid-message"
                      value={bidMessage}
                      onChange={(e) => setBidMessage(e.target.value)}
                      placeholder="Describe your experience and approach to this project..."
                      className="w-full p-2 border rounded-md min-h-[100px]"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="resume">Upload Resume (Optional)</Label>
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, DOC, or DOCX format (max 5MB)
                    </p>
                  </div>

                  {bidSuccess && (
                    <div className="p-3 bg-green-100 text-green-700 rounded-md">
                      Your bid has been submitted successfully! The client will
                      be notified.
                    </div>
                  )}
                </CardContent>

                <div className="p-6 pt-0">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={bidSubmitting}
                  >
                    {bidSubmitting ? "Submitting..." : "Submit Bid"}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
