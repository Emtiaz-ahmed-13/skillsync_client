"use client";

import { ClientProposals } from "@/components/features/dashboard/client-proposals";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  getWorkSubmissionsByProject,
  WorkSubmission,
} from "@/lib/api/work-submission-api";
import { useNotifications } from "@/lib/hooks/notifications";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Project {
  _id: string;
  id?: string;
  title: string;
  description: string;
  status: string;
  budget: number;
  minimumBid: number;
  deadline?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  technology?: string[];
}

export default function ClientDashboardClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { notifications } = useNotifications();
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalSpent: 0,
    pendingReviews: 0,
  });
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [minimumBid, setMinimumBid] = useState("");
  const [budget, setBudget] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  const [bids, setBids] = useState([]);
  const [bidsLoading, setBidsLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const user = session.user as { role?: string };
      if (user.role !== "client") {
        switch (user.role) {
          case "freelancer":
            router.push("/dashboard/freelancer");
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
  }, [session, status, router]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (status === "authenticated" && session?.user) {
        try {
          const user = session.user as { id?: string; accessToken?: string };
          const accessToken = user.accessToken;
          const userId = user.id;

          console.log("Fetching projects for user:", userId);
          console.log("Access token available:", !!accessToken);

          if (!accessToken || !userId) {
            console.error("No access token or user ID available");
            setProjectsLoading(false);
            return;
          }

          const response = await fetch(`/api/v1/projects/owner/${userId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          console.log("Projects API response status:", response.status);

          if (response.ok) {
            const data = await response.json();
            console.log("Projects API response data:", data);

            if (data.success && data.data && Array.isArray(data.data)) {
              console.log("Setting projects:", data.data);
              setProjects(data.data);

              const totalProjects = data.data.length;
              const activeProjects = data.data.filter(
                (p) => p.status !== "completed"
              ).length;
              const totalSpent = data.data.reduce(
                (sum, project) =>
                  sum + (project.budget || project.minimumBid || 0),
                0
              );

              const projectIds = data.data.map((p) => p._id || p.id);

              let pendingReviews = 0;
              for (const projectId of projectIds) {
                try {
                  const workSubmissionsResponse =
                    await getWorkSubmissionsByProject(projectId, accessToken);

                  if (
                    workSubmissionsResponse.success &&
                    workSubmissionsResponse.data &&
                    Array.isArray(workSubmissionsResponse.data)
                  ) {
                    const pendingSubmissions = (
                      workSubmissionsResponse.data as WorkSubmission[]
                    ).filter(
                      (sub) =>
                        sub.status === "pending" || sub.status === "review"
                    );
                    pendingReviews += pendingSubmissions.length;
                  }
                } catch (workSubmissionsErr) {
                  console.error(
                    "Error fetching work submissions for project:",
                    projectId,
                    workSubmissionsErr
                  );
                }
              }

              console.log("Setting stats:", {
                totalProjects,
                activeProjects,
                totalSpent,
                pendingReviews,
              });
              setStats({
                totalProjects,
                activeProjects,
                totalSpent,
                pendingReviews,
              });

              try {
                const allBids = [];
                for (const project of data.data) {
                  const projectId = project._id || project.id;

                  const bidsResponse = await fetch(
                    `/api/v1/bids/project/${projectId}`,
                    {
                      headers: {
                        Authorization: `Bearer ${accessToken}`,
                      },
                    }
                  );

                  if (bidsResponse.ok) {
                    const bidsData = await bidsResponse.json();
                    if (
                      bidsData.success &&
                      bidsData.data &&
                      Array.isArray(bidsData.data)
                    ) {
                      allBids.push(...bidsData.data);
                    }
                  }
                }

                console.log("Setting bids:", allBids);
                setBids(allBids);
                setBidsLoading(false);
              } catch (bidsErr) {
                console.error("Error fetching bids:", bidsErr);
                setBidsLoading(false);
              }
            } else {
              console.error("Projects API response format invalid:", data);
            }
          } else {
            console.error("Failed to fetch projects:", response.status);
            setProjectsLoading(false);
          }
        } catch (err) {
          console.error("Error in fetchProjects:", err);
          setProjectsLoading(false);
        } finally {
          setProjectsLoading(false);
        }
      } else {
        console.log(
          "Status or session not ready, skipping fetch. Status:",
          status,
          "Session:",
          session
        );
        setProjectsLoading(false);
      }
    };
    if (status === "authenticated" && session) {
      console.log("Starting project fetch");
      setProjectsLoading(true);
      setBidsLoading(true);
      fetchProjects();
    }
    if (status === "authenticated") {
      // Stats will be updated in the fetchProjects effect
    }
  }, [status, session]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = session?.user as { accessToken?: string };
      const accessToken = user?.accessToken;

      if (!accessToken) {
        setError("Authentication token not available. Please log in again.");
        return;
      }
      const title = projectTitle?.trim() || "";
      const description = projectDescription?.trim() || "";
      const minBid = minimumBid ? parseInt(minimumBid, 10) : 0;
      const projBudget = budget ? parseInt(budget, 10) : 0;
      const techList = technologies
        ? technologies
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t)
        : [];
      if (!title) {
        setError("Project title is required");
        return;
      }
      if (!description) {
        setError("Project description is required");
        return;
      }
      if (minBid <= 0) {
        setError("Minimum bid must be greater than 0");
        return;
      }
      if (projBudget <= 0) {
        setError("Budget must be greater than 0");
        return;
      }
      if (techList.length === 0) {
        setError("At least one technology is required");
        return;
      }

      const projectData = {
        title,
        description,
        minimumBid: minBid,
        budget: projBudget,
        technology: techList,
      };

      const response = await fetch("/api/v1/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(projectData),
      });

      let projectResponseData = null;

      if (response.ok) {
        projectResponseData = await response.json();
        toast.success("Project created successfully!");

        if (file) {
          const createdProject = projectResponseData.data;
          const formData = new FormData();
          formData.append("file", file);
          formData.append("projectId", createdProject._id || createdProject.id);

          const fileResponse = await fetch("/api/v1/files", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
          });

          if (!fileResponse.ok) {
            console.error("File upload failed:", await fileResponse.text());
          }
        }
      }

      if (response.ok) {
        // Project created successfully
        setIsCreateProjectOpen(false);
        // Reset form
        setProjectTitle("");
        setProjectDescription("");
        setMinimumBid("");
        setBudget("");
        setTechnologies("");
        setFile(null);
        const fetchProjects = async () => {
          if (status === "authenticated" && session?.user) {
            try {
              const user = session.user as {
                id?: string;
                accessToken?: string;
              };
              const accessToken = user.accessToken;
              const userId = user.id;

              if (!accessToken || !userId) {
                console.error("No access token or user ID available");
                return;
              }

              const projectsResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/projects/owner/${userId}` ||
                  `localhost:5001/api/v1/projects/owner/${userId}`,
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              );

              if (projectsResponse.ok) {
                const data = await projectsResponse.json();
                if (data.success && data.data && Array.isArray(data.data)) {
                  setProjects(data.data);

                  // Calculate stats from the projects data
                  const totalProjects = data.data.length;
                  const activeProjects = data.data.filter(
                    (p) => p.status !== "completed"
                  ).length;

                  // Calculate total spent (sum of budgets)
                  const totalSpent = data.data.reduce(
                    (sum, project) =>
                      sum + (project.budget || project.minimumBid || 0),
                    0
                  );

                  const projectIds = data.data.map((p) => p._id || p.id);
                  let pendingReviews = 0;
                  for (const projectId of projectIds) {
                    try {
                      const workSubmissionsResponse =
                        await getWorkSubmissionsByProject(
                          projectId,
                          accessToken
                        );

                      if (
                        workSubmissionsResponse.success &&
                        workSubmissionsResponse.data &&
                        Array.isArray(workSubmissionsResponse.data)
                      ) {
                        const pendingSubmissions = (
                          workSubmissionsResponse.data as WorkSubmission[]
                        ).filter(
                          (sub) =>
                            sub.status === "pending" || sub.status === "review"
                        );
                        pendingReviews += pendingSubmissions.length;
                      }
                    } catch (workSubmissionsErr) {
                      console.error(
                        "Error fetching work submissions for project:",
                        projectId,
                        workSubmissionsErr
                      );
                    }
                  }

                  setStats((prevStats) => ({
                    totalProjects,
                    activeProjects,
                    totalSpent,
                    pendingReviews,
                  }));
                }
              } else {
                console.error(
                  "Failed to fetch projects:",
                  projectsResponse.status
                );
              }
            } catch (err) {
              console.error("Error fetching projects:", err);
            }
          }
        };

        fetchProjects();
        try {
          const user = session?.user as { id?: string; accessToken?: string };
          const accessToken = user?.accessToken;

          if (accessToken) {
            console.log(
              "Project created successfully, admin notification should be handled by backend"
            );
          }
        } catch (notificationErr) {
          console.error("Error creating notification:", notificationErr);
        }
      } else {
        let errorData;
        let errorText = "";

        try {
          const responseText = await response.text();

          if (
            responseText.includes("<!DOCTYPE") ||
            responseText.includes("<html")
          ) {
            // It's an HTML error page, extract any meaningful error or just use the status
            errorText = responseText;
          } else {
            // Try to parse as JSON
            try {
              errorData = JSON.parse(responseText);
            } catch (parseError) {
              // If it's not JSON, use the text as the error
              errorData = { message: responseText };
            }
          }

          // If errorData is still undefined or empty, use errorText
          if (!errorData || Object.keys(errorData).length === 0) {
            errorData = {
              message: errorText || `HTTP Error: ${response.status}`,
            };
          }
        } catch (e) {
          // If all else fails, use status text
          errorData = {
            message: `Failed to create project: ${response.status} ${response.statusText}`,
          };
        }

        setError(
          errorData.message ||
            `Failed to create project: ${response.status} ${response.statusText}`
        );
        console.error("Project creation error:", errorData);
      }
    } catch (err) {
      setError("An error occurred while creating the project");
      console.error("Error creating project:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBid = async (bidId: string) => {
    if (!bidId) {
      console.error("Invalid bid ID");
      return;
    }

    try {
      const user = session?.user as { accessToken?: string };
      const accessToken = user?.accessToken;

      if (!accessToken) {
        console.error("Authentication token not available");
        return;
      }

      const response = await fetch(`/api/v1/bids/${bidId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status: "accepted" }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Update the bid status in the local state
          setBids((prevBids) =>
            prevBids.map((bid) =>
              bid._id === bidId || bid.id === bidId
                ? { ...bid, status: "accepted" }
                : bid
            )
          );
          console.log("Bid accepted successfully!");

          // Refresh projects to show the updated project status
          await refreshProjects();
        } else {
          console.error(result.message || "Failed to accept bid");
        }
      } else {
        const errorData = await response.json();
        console.error(errorData.message || "Failed to accept bid");
      }
    } catch (error) {
      console.error("Error accepting bid:", error);
    }
  };

  // Separate function to refresh projects
  const refreshProjects = async () => {
    if (status === "authenticated" && session?.user) {
      try {
        const user = session.user as { id?: string; accessToken?: string };
        const accessToken = user.accessToken;
        const userId = user.id;

        console.log("Refreshing projects for user:", userId);
        console.log("Access token available:", !!accessToken);

        if (!accessToken || !userId) {
          console.error("No access token or user ID available");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/projects/owner/${userId}` ||
            `localhost:5001/api/v1/projects/owner/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        console.log("Projects API response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("Projects API response data:", data);

          if (data.success && data.data && Array.isArray(data.data)) {
            console.log("Setting projects:", data.data);
            setProjects(data.data);

            // Calculate stats from the projects data
            const totalProjects = data.data.length;
            const activeProjects = data.data.filter(
              (p) => p.status !== "completed"
            ).length;

            // Calculate total spent (sum of budgets)
            const totalSpent = data.data.reduce(
              (sum, project) =>
                sum + (project.budget || project.minimumBid || 0),
              0
            );

            const projectIds = data.data.map((p) => p._id || p.id);

            let pendingReviews = 0;
            for (const projectId of projectIds) {
              try {
                const workSubmissionsResponse =
                  await getWorkSubmissionsByProject(projectId, accessToken);

                if (
                  workSubmissionsResponse.success &&
                  workSubmissionsResponse.data &&
                  Array.isArray(workSubmissionsResponse.data)
                ) {
                  const pendingSubmissions = (
                    workSubmissionsResponse.data as WorkSubmission[]
                  ).filter(
                    (sub) => sub.status === "pending" || sub.status === "review"
                  );
                  pendingReviews += pendingSubmissions.length;
                }
              } catch (workSubmissionsErr) {
                console.error(
                  "Error fetching work submissions for project:",
                  projectId,
                  workSubmissionsErr
                );
              }
            }

            console.log("Setting stats:", {
              totalProjects,
              activeProjects,
              totalSpent,
              pendingReviews,
            });
            setStats({
              totalProjects,
              activeProjects,
              totalSpent,
              pendingReviews,
            });

            try {
              const allBids = [];
              for (const project of data.data) {
                const projectId = project._id || project.id;

                const bidsResponse = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/bids/project/${projectId}` ||
                    `localhost:5001/api/v1/bids/project/${projectId}`,
                  {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  }
                );

                if (bidsResponse.ok) {
                  const bidsData = await bidsResponse.json();
                  if (
                    bidsData.success &&
                    bidsData.data &&
                    Array.isArray(bidsData.data)
                  ) {
                    allBids.push(...bidsData.data);
                  }
                }
              }

              console.log("Setting bids:", allBids);
              setBids(allBids);
              setBidsLoading(false);
            } catch (bidsErr) {
              console.error("Error fetching bids:", bidsErr);
              setBidsLoading(false);
            }
          } else {
            console.error("Projects API response format invalid:", data);
          }
        } else {
          console.error("Failed to fetch projects:", response.status);
        }
      } catch (err) {
        console.error("Error in refreshProjects:", err);
      }
    }
  };

  const handleRejectBid = async (bidId: string) => {
    if (!bidId) {
      console.error("Invalid bid ID");
      return;
    }

    try {
      const user = session?.user as { accessToken?: string };
      const accessToken = user?.accessToken;

      if (!accessToken) {
        console.error("Authentication token not available");
        return;
      }

      const response = await fetch(`/api/v1/bids/${bidId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status: "rejected" }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Update the bid status in the local state
          setBids((prevBids) =>
            prevBids.map((bid) =>
              bid._id === bidId || bid.id === bidId
                ? { ...bid, status: "rejected" }
                : bid
            )
          );
          console.log("Bid rejected successfully!");

          // Refresh projects to show the updated project status
          await refreshProjects();
        } else {
          console.error(result.message || "Failed to reject bid");
        }
      } else {
        const errorData = await response.json();
        console.error(errorData.message || "Failed to reject bid");
      }
    } catch (error) {
      console.error("Error rejecting bid:", error);
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

  // Filter work submission notifications for the client
  const workSubmissionNotifications = notifications.filter((notification) =>
    notification.title.includes("Work Submitted")
  );

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <div className="relative z-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        {/* Notification Banner for Work Submissions */}
        {workSubmissionNotifications.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-blue-800">
                    {workSubmissionNotifications.length} Work Submission
                    {workSubmissionNotifications.length > 1 ? "s" : ""} for
                    Review
                  </h3>
                  <p className="text-blue-600">
                    You have new work submissions that need your review
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/client/projects")}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300"
              >
                View Submissions
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-8 py-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-foreground"
            >
              Client Dashboard
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground mt-2 text-lg"
            >
              Welcome back, {session?.user?.name || "Client"}
            </motion.p>
          </div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Projects
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-muted-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M16 13H8" />
                  <path d="M16 17H8" />
                  <path d="M10 9H8" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProjects}</div>
                <p className="text-xs text-muted-foreground">
                  +{Math.max(1, Math.floor(stats.totalProjects * 0.1))} from
                  last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Projects
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-muted-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13.5 2H6a2 2 0 0 0-2 2v3" />
                  <path d="M16 12h4" />
                  <path d="M16 8h4" />
                  <path d="M16 16h4" />
                  <rect width="8" height="8" x="2" y="14" rx="2" />
                  <path d="M10 18h.01" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeProjects}</div>
                <p className="text-xs text-muted-foreground">
                  +{Math.max(1, Math.floor(stats.activeProjects * 0.1))} from
                  last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Spent
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-muted-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${stats.totalSpent.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +
                  {stats.totalSpent > 0
                    ? Math.floor(
                        (stats.totalSpent /
                          Math.max(1, stats.totalSpent - 100)) *
                          100
                      )
                    : 0}
                  % from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Reviews
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-muted-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingReviews}</div>
                <div className="text-xs text-muted-foreground">
                  {stats.pendingReviews > 0 ? stats.pendingReviews : "0"}{" "}
                  completed today
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* My Projects Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 gap-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>My Projects</CardTitle>
                <CardDescription>
                  You have {stats.totalProjects} projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectsLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          Loading projects...
                        </TableCell>
                      </TableRow>
                    ) : projects.length > 0 ? (
                      projects.map((project) => (
                        <TableRow key={project._id || project.id}>
                          <TableCell className="font-medium">
                            {project.title}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                project.status === "in-progress"
                                  ? "default"
                                  : project.status === "pending"
                                  ? "secondary"
                                  : project.status === "completed"
                                  ? "outline"
                                  : "destructive"
                              }
                            >
                              {project.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            ${project.budget || project.minimumBid}
                          </TableCell>
                          <TableCell>
                            {project.createdAt
                              ? new Date(project.createdAt).toLocaleDateString()
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                router.push(
                                  `/dashboard/client/projects/${
                                    project._id || project.id
                                  }`
                                )
                              }
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          No projects found. Create your first project!
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>

          {/* Proposal Management Section */}
          <ClientProposals onProposalUpdate={refreshProjects} />

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Create Project</CardTitle>
                <CardDescription>
                  Post a new project for freelancers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog
                  open={isCreateProjectOpen}
                  onOpenChange={setIsCreateProjectOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="w-full">Create Project</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-6">
                    <DialogHeader>
                      <DialogTitle>Create New Project</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateProject}>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Project Title</Label>
                          <Input
                            id="title"
                            value={projectTitle}
                            onChange={(e) => setProjectTitle(e.target.value)}
                            placeholder="e.g. E-commerce Website Development"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={projectDescription}
                            onChange={(e) =>
                              setProjectDescription(e.target.value)
                            }
                            placeholder="Describe your project requirements..."
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="minBid">Minimum Bid ($)</Label>
                            <Input
                              id="minBid"
                              type="number"
                              value={minimumBid}
                              onChange={(e) => setMinimumBid(e.target.value)}
                              placeholder="100"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="budget">Budget ($)</Label>
                            <Input
                              id="budget"
                              type="number"
                              value={budget}
                              onChange={(e) => setBudget(e.target.value)}
                              placeholder="1000"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="technologies">
                            Technologies (comma-separated)
                          </Label>
                          <Input
                            id="technologies"
                            value={technologies}
                            onChange={(e) => setTechnologies(e.target.value)}
                            placeholder="React, Node.js, MongoDB"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="file">
                            Upload Project File (Optional)
                          </Label>
                          <Input
                            id="file"
                            type="file"
                            onChange={(e) =>
                              setFile(e.target.files?.[0] || null)
                            }
                            accept=".pdf,.doc,.docx,.txt,.zip,.rar,.jpg,.jpeg,.png"
                          />
                          {file && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Selected: {file.name} (
                              {(file.size / 1024).toFixed(2)} KB)
                            </p>
                          )}
                        </div>
                        {error && (
                          <div className="text-red-500 text-sm">{error}</div>
                        )}
                        <div className="flex justify-end space-x-2 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsCreateProjectOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Project"}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Manage Team</CardTitle>
                <CardDescription>Manage your freelancer team</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Manage Team</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reviews & Feedback</CardTitle>
                <CardDescription>View and submit reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  onClick={() => router.push("/dashboard/client/reviews")}
                >
                  Manage Reviews
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>View your payment history</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">View Payments</Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
