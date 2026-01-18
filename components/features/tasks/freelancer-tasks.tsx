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

interface Bid {
  id: string;
  _id: string;
  projectId: string;
  amount: number;
  proposal: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Sprint {
  _id: string;
  projectId: string;
  title: string;
  description: string;
  features: Feature[];
  startDate: string;
  endDate: string;
  status: "planning" | "in-progress" | "completed";
}

interface Feature {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
}

interface SessionUser {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  role?: string;
  accessToken?: string;
}

interface FreelancerTasksProps {
  user: SessionUser;
  projectId?: string; // Optional project ID to focus on a specific project
}

export default function FreelancerTasksClient({
  user,
  projectId,
}: FreelancerTasksProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    projectId || null
  );

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
      } else {
        // Fetch freelancer's projects and bids
        fetchFreelancerData();
      }
    } else if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, user, router, selectedProjectId]);

  const fetchFreelancerData = async () => {
    try {
      setLoading(true);
      const accessToken = user?.accessToken;

      if (!accessToken) {
        console.error("No access token available");
        return;
      }

      // Fetch freelancer's accepted bids (projects they're working on)
      const bidsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bids/freelancer/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (bidsResponse.ok) {
        const bidsData = await bidsResponse.json();
        if (bidsData.success && bidsData.data) {
          // Filter for accepted bids
          const acceptedBids = bidsData.data.filter(
            (bid: Bid) => bid.status === "accepted"
          );
          setBids(acceptedBids);

          // Determine which projects to fetch based on selectedProjectId
          let bidsToProcess = acceptedBids;
          if (selectedProjectId) {
            bidsToProcess = acceptedBids.filter(
              (bid: Bid) => bid.projectId === selectedProjectId
            );
          }

          // Fetch project details for each accepted bid
          const projectPromises = bidsToProcess.map(async (bid: Bid) => {
            const projectResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/projects/${bid.projectId}`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );

            if (projectResponse.ok) {
              const projectData = await projectResponse.json();
              if (projectData.success && projectData.data) {
                return projectData.data;
              }
            }
            return null;
          });

          const projectsData = await Promise.all(projectPromises);
          const validProjects = projectsData.filter(
            (project) => project !== null
          );
          setProjects(validProjects);

          // Fetch sprints for each project
          const allSprints: Sprint[] = [];
          for (const project of validProjects) {
            const sprintsResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/sprints/project/${project._id}`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );

            if (sprintsResponse.ok) {
              const sprintsData = await sprintsResponse.json();
              if (sprintsData.success && sprintsData.data) {
                allSprints.push(...sprintsData.data);
              }
            }
          }
          setSprints(allSprints);
        }
      }
    } catch (error) {
      console.error("Error fetching freelancer data:", error);
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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="space-y-8 py-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-foreground"
            >
              {selectedProjectId
                ? "Project Tasks & Planning"
                : "My Tasks & Projects"}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground mt-2 text-lg"
            >
              {selectedProjectId
                ? "Manage tasks and plan sprints for this project"
                : "Manage your projects and plan your sprints"}
            </motion.p>
          </div>

          {/* Project Selection */}
          {!selectedProjectId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Select Project</CardTitle>
                  <CardDescription>
                    Choose a project to manage its tasks and planning
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => (
                      <div
                        key={project._id}
                        className={`border rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors ${
                          selectedProjectId === project._id
                            ? "border-primary bg-primary/5"
                            : ""
                        }`}
                        onClick={() => setSelectedProjectId(project._id)}
                      >
                        <h3 className="font-medium">{project.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex justify-between items-center mt-3">
                          <Badge variant="outline">{project.status}</Badge>
                          <span className="text-sm font-medium">
                            ${project.budget}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Project Tools */}
          {selectedProjectId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 gap-6"
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-2 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Project Timeline Estimator
                  </CardTitle>
                  <CardDescription className="text-sm mt-1">
                    AI will analyze your project requirements and estimate
                    completion time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full py-6 text-base"
                    onClick={() => {
                      toast.info(
                        "Project Timeline Estimation functionality will be implemented here"
                      );
                    }}
                  >
                    Estimate Timeline
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: selectedProjectId ? 0.3 : 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">
                  {selectedProjectId ? "Project" : "Active Projects"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {selectedProjectId ? projects.length : projects.length}
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedProjectId
                    ? "Selected project"
                    : "Projects you're working on"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">Sprints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{sprints.length}</div>
                <p className="text-sm text-muted-foreground">
                  {selectedProjectId
                    ? "Sprints in this project"
                    : "Sprints to complete"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {sprints.reduce(
                    (total, sprint) => total + sprint.features.length,
                    0
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedProjectId
                    ? "Tasks in this project"
                    : "Total features to implement"}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sprint Planning Options - Only show if no project is selected */}
          {!selectedProjectId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 gap-6"
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-2 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Sprint Planning
                  </CardTitle>
                  <CardDescription className="text-sm mt-1">
                    Create and manage your sprints with custom features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full py-6 text-base"
                    onClick={() =>
                      router.push("/dashboard/freelancer/sprint-planning")
                    }
                  >
                    Plan Sprints
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* View My Tasks Button - Show when project is selected */}
          {selectedProjectId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-2 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    View My Tasks
                  </CardTitle>
                  <CardDescription className="text-sm mt-1">
                    View and manage all tasks for this project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full py-6 text-base"
                    onClick={() => {
                      // Navigate to the freelancer project details page
                      router.push(
                        `/dashboard/freelancer/projects/${selectedProjectId}`
                      );
                    }}
                  >
                    View Tasks
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-2 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Submit Work
                  </CardTitle>
                  <CardDescription className="text-sm mt-1">
                    Submit completed work for this project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full py-6 text-base"
                    onClick={() => {
                      // Navigate to the work submission page for this project
                      router.push(
                        `/dashboard/freelancer/work-submission/${selectedProjectId}`
                      );
                    }}
                  >
                    Submit Work
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Active Projects - Only show if no project is selected */}
          {!selectedProjectId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Active Projects</CardTitle>
                  <CardDescription>
                    Projects you're currently working on
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {projects.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      You don't have any active projects yet. Accept a bid to
                      get started.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {projects.map((project) => (
                        <div
                          key={project._id}
                          className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
                        >
                          <h3 className="font-medium">{project.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {project.description}
                          </p>
                          <div className="flex justify-between items-center mt-3">
                            <Badge variant="outline">{project.status}</Badge>
                            <span className="text-sm font-medium">
                              ${project.budget}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Active Sprints */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: selectedProjectId ? 0.4 : 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedProjectId ? "Project Sprints" : "Active Sprints"}
                </CardTitle>
                <CardDescription>
                  {selectedProjectId
                    ? "Your current sprints for this project and their progress"
                    : "Your current sprints and their progress"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sprints.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    {selectedProjectId
                      ? "No sprints for this project. Plan your first sprint to get started."
                      : "No active sprints. Plan your first sprint to get started."}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {sprints.map((sprint) => {
                      const completedFeatures = sprint.features.filter(
                        (f) => f.status === "completed"
                      ).length;
                      const totalFeatures = sprint.features.length;
                      const progress =
                        totalFeatures > 0
                          ? Math.round(
                              (completedFeatures / totalFeatures) * 100
                            )
                          : 0;

                      return (
                        <div key={sprint._id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{sprint.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {sprint.description}
                              </p>
                            </div>
                            <Badge
                              variant={
                                sprint.status === "completed"
                                  ? "default"
                                  : sprint.status === "in-progress"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {sprint.status}
                            </Badge>
                          </div>

                          <div className="mt-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>
                                {completedFeatures}/{totalFeatures} features
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Back to Project List Button - Show when project is selected */}
          {selectedProjectId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center"
            >
              <Button
                variant="outline"
                onClick={() => setSelectedProjectId(null)}
              >
                ← Back to All Projects
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
