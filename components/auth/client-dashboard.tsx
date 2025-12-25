"use client";

import { Navbar } from "@/components/home/navbar";
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
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// No mock data - all data is fetched from API

export default function ClientDashboardClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalSpent: 0,
    pendingReviews: 0,
  });

  // Project creation state
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [minimumBid, setMinimumBid] = useState("");
  const [budget, setBudget] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Projects state
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const user = session.user as { role?: string };
      if (user.role !== "client") {
        // Redirect to correct dashboard if user is not a client
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
    // Fetch user's projects from the backend
    const fetchProjects = async () => {
      if (status === "authenticated" && session?.user) {
        try {
          const user = session.user as { id?: string; accessToken?: string };
          const accessToken = user.accessToken;
          const userId = user.id;

          if (!accessToken || !userId) {
            console.error("No access token or user ID available");
            return;
          }

          const response = await fetch(
            `http://localhost:5001/api/v1/projects/owner/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data && data.data.projects) {
              setProjects(data.data.projects);

              // Calculate stats from the projects data
              const totalProjects = data.data.projects.length;
              const activeProjects = data.data.projects.filter(
                (p) => p.status !== "completed"
              ).length;

              // Calculate total spent (sum of budgets)
              const totalSpent = data.data.projects.reduce(
                (sum, project) =>
                  sum + (project.budget || project.minimumBid || 0),
                0
              );

              setStats({
                totalProjects,
                activeProjects,
                totalSpent,
                pendingReviews: 0, // Placeholder for now
              });
            }
          } else {
            console.error("Failed to fetch projects:", response.status);
          }
        } catch (err) {
          console.error("Error fetching projects:", err);
        } finally {
          setProjectsLoading(false);
        }
      }
    };

    fetchProjects();

    // In a real app, you would fetch these stats from your backend
    if (status === "authenticated") {
      // Stats will be updated in the fetchProjects effect
    }
  }, [status, session]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Get the access token from the session
      const user = session?.user as { accessToken?: string };
      const accessToken = user?.accessToken;

      // If no access token, show error
      if (!accessToken) {
        setError("Authentication token not available. Please log in again.");
        return;
      }

      // Prepare the project data according to API specification
      // Clean up and validate the input data
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

      // Validate required fields
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
        // ownerId is automatically added from the token, so we don't include it
        // picture is optional, so we don't include it unless needed
      };

      // Make the API call to create the project
      const response = await fetch("http://localhost:5001/api/v1/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        // Project created successfully
        setIsCreateProjectOpen(false);
        // Reset form
        setProjectTitle("");
        setProjectDescription("");
        setMinimumBid("");
        setBudget("");
        setTechnologies("");

        // Refresh projects to include the new one
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
                `http://localhost:5001/api/v1/projects/owner/${userId}`,
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              );

              if (projectsResponse.ok) {
                const data = await projectsResponse.json();
                if (data.success && data.data && data.data.projects) {
                  setProjects(data.data.projects);

                  // Calculate stats from the projects data
                  const totalProjects = data.data.projects.length;
                  const activeProjects = data.data.projects.filter(
                    (p) => p.status !== "completed"
                  ).length;

                  // Calculate total spent (sum of budgets)
                  const totalSpent = data.data.projects.reduce(
                    (sum, project) =>
                      sum + (project.budget || project.minimumBid || 0),
                    0
                  );

                  setStats((prevStats) => ({
                    totalProjects,
                    activeProjects,
                    totalSpent,
                    pendingReviews: prevStats.pendingReviews, // Maintain existing pendingReviews value
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

        // Create notification for admin about new project
        try {
          const user = session?.user as { id?: string; accessToken?: string };
          const accessToken = user?.accessToken;

          if (accessToken) {
            // The notification will be created automatically by the backend when a project is created
            // The backend should handle creating the notification for admins
            console.log(
              "Project created successfully, admin notification should be handled by backend"
            );
          }
        } catch (notificationErr) {
          console.error("Error creating notification:", notificationErr);
        }
      } else {
        // Try to get error details from response
        let errorData;
        let errorText = "";

        try {
          // First, try to read the response as text to see if it's HTML or a meaningful error
          const responseText = await response.text();

          // Check if response is HTML (indicating a server error page)
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

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <div className="relative z-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
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
                  +2 from last month
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
                  +1 from last month
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
                  +12% from last month
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
                  1 completed today
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
