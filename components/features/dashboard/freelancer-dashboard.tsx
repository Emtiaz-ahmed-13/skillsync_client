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
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


interface Project {
  id: string;
  _id: string; 
  title: string;
  description: string;
  minimumBid: number;
  budget: number;
  technology: string[];
  status: string;
  ownerId: string | { name: string; email: string }; 
  createdAt: string;
  updatedAt: string;
  progress?: number;
  realProjectId?: string;
}

interface Bid {
  id: string;
  _id: string;
  projectId: string | {_id: string, title?: string, ownerId?: any};
  projectTitle?: string;
  clientName?: string;
  amount: number;
  proposal: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  freelancerId?: {
    _id: string;
    name: string;
    email: string;
  };
  freelancer?: {
    name: string;
  };
  freelancerName?: string;
}

interface FreelancerProfile {
  id: string;
  name: string;
  email: string;
  bio: string;
  skills: string[];
  location: string;
  experience: string;
  portfolio: string[];
  hourlyRate: number;
  rating: number;
  completedProjects: number;
}

export default function FreelancerDashboardClient() {
  // Define type for session user with role
  type SessionUser = {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
    role?: string;
    accessToken?: string;
  };

  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalEarnings: 0,
    pendingBids: 0,
  });
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [approvedProjects, setApprovedProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingBids, setLoadingBids] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0); 



  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const user = session.user as SessionUser;
      if (user.role !== "freelancer") {
        // Redirect to correct dashboard if user is not a freelancer
        switch (user.role) {
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
  }, [session, status, router]);

  useEffect(() => {
    // Fetch freelancer stats from backend
    const fetchFreelancerStats = async () => {
      if (status === "authenticated" && session?.user) {
        const user = session.user as SessionUser;
        const accessToken = user.accessToken;

        if (!accessToken) {
          console.error("No access token available");
          return;
        }

        try {
          // Fetch freelancer's profile to get their ID
          const profileResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/profile/me`
            ||
            `localhost:5001/api/v1/profile/me`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          let freelancerId = user.id;
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            if (profileData.success && profileData.data) {
              freelancerId =
                profileData.data._id || profileData.data.id || user.id;
            }
          }

          // Fetch freelancer's bids first (needed for earnings calculation)
          const bidsResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/bids/my`
            ||
            `localhost:5001/api/v1/bids/my`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          let bids = [];
          let bidsWithProjectTitles = [];
          if (bidsResponse.ok) {
            const bidsData = await bidsResponse.json();
            if (
              bidsData.success &&
              bidsData.data &&
              Array.isArray(bidsData.data)
            ) {
              bids = bidsData.data;
              bidsWithProjectTitles = await Promise.all(
                bids.map(async (bid: Bid) => {
                  try {
                  
                    const projectIdStr = typeof bid.projectId === 'object' && bid.projectId !== null 
                      ? (bid.projectId as any)._id || (bid.projectId as any).id
                      : bid.projectId;

                    if (typeof bid.projectId === 'object' && bid.projectId !== null) {
                       const projectObj = bid.projectId as any;
                 
                       let clientName = "Unknown Client";
                       if (projectObj.ownerId) {
                          if (typeof projectObj.ownerId === 'object') {
                             clientName = projectObj.ownerId.name || "Unknown Client";
                          } else {
                             
                          }
                       }
                    }

                    const projectResponse = await fetch(
                      `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectIdStr}`
                      ||
                      `localhost:5001/api/v1/projects/${projectIdStr}`,
                      {
                        headers: {
                          Authorization: `Bearer ${accessToken}`,
                        },
                      }
                    );

                    if (projectResponse.ok) {
                      const projectData = await projectResponse.json();
                      if (projectData.success && projectData.data) {
                        return {
                          ...bid,
                          projectTitle: projectData.data.title,
                            clientName: 
                            projectData.data.ownerId && typeof projectData.data.ownerId === 'object'
                              ? (projectData.data.ownerId as any).name
                              : "Unknown Client",
                        };
                      }
                    }
                  } catch (error) {
                    console.error("Error fetching project for bid:", error);
                  }
                  const fallbackTitle = (bid.projectId && typeof bid.projectId === 'object' && (bid.projectId as any).title) 
                    ? (bid.projectId as any).title 
                    : "Unknown Project";

                  return {
                    ...bid,
                    projectTitle: fallbackTitle,
                  };
                })
              );

              setBids(bidsWithProjectTitles);

           
              const pendingBidsCount = bidsWithProjectTitles.filter(
                (b: Bid) => b.status === "pending"
              ).length;
              setStats((prev) => ({ ...prev, pendingBids: pendingBidsCount }));
            }
          }
          const acceptedBids = bidsWithProjectTitles.filter(
            (b: Bid) => b.status === "accepted"
          );
          const activeProjectsCount = acceptedBids.length;

        
          const totalEarnings = bidsWithProjectTitles.reduce((sum, bid) => {
            if (bid.status === "accepted") {
              return sum + bid.amount;
            }
            return sum;
          }, 0);

          const activeProjectsFromBids = await Promise.all(
            acceptedBids.map(async (bid) => {
              try {
                const projectIdStr = typeof bid.projectId === 'object' && bid.projectId !== null 
                  ? (bid.projectId as any)._id || (bid.projectId as any).id
                  : bid.projectId;

                const projectResponse = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectIdStr}`
                  ||
                  `localhost:5001/api/v1/projects/${projectIdStr}`,
                  {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  }
                );

                if (projectResponse.ok) {
                  const projectData = await projectResponse.json();
                  if (projectData.success && projectData.data) {
                    return {
                      id:
                        bid.projectId && bid._id
                          ? `${bid.projectId}-${bid._id}`
                          : bid._id
                          ? `bid-${bid._id}`
                          : bid.id,
                      _id: `${
                        projectData.data._id ||
                        projectData.data.id ||
                        bid.projectId
                      }-${bid._id || "bid"}`,
                      title: projectData.data.title || "Project Title",
                      description:
                        projectData.data.description || "Project description",
                      minimumBid: projectData.data.minimumBid || 0,
                      budget: projectData.data.budget || 0,
                      technology: projectData.data.technology || [],
                      status: projectData.data.status || "in-progress", 
                      ownerId: projectData.data.ownerId || "",
                      createdAt: projectData.data.createdAt || bid.createdAt,
                      updatedAt: projectData.data.updatedAt || bid.updatedAt,
                      progress: projectData.data.progress || 0,
                      realProjectId: projectData.data._id || projectData.data.id,
                    };
                  }
                }
              } catch (error) {
                console.error(
                  "Error fetching project for active project:",
                  error
                );
              }

              const fallbackTitle = (bid.projectId && typeof bid.projectId === 'object' && (bid.projectId as any).title) 
                ? (bid.projectId as any).title 
                : bid.projectTitle || "Unknown Project";
              return {
                id:
                  bid.projectId && bid._id
                    ? `${typeof bid.projectId === 'object' ? (bid.projectId as any)._id : bid.projectId}-${bid._id}`
                    : bid._id
                    ? `bid-${bid._id}`
                    : bid.id,
                _id: `${typeof bid.projectId === 'object' ? (bid.projectId as any)._id : bid.projectId}-${
                  bid._id || "bid"
                }`,
                title: fallbackTitle,
                description: "Project description",
                minimumBid: 0,
                budget: 0,
                technology: [],
                status: "in-progress", 
                ownerId: "",
                createdAt: bid.createdAt,
                updatedAt: bid.updatedAt,
                progress: 0,
                realProjectId: typeof bid.projectId === 'string' ? bid.projectId : (bid.projectId as any)._id,
              };
            })
          );

          let assignedProjects = [];
          try {
            const assignedProjectsResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/projects/freelancer/${freelancerId}`
              ||
              `localhost:5001/api/v1/projects/freelancer/${freelancerId}`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );

            if (assignedProjectsResponse.ok) {
              const assignedProjectsData =
                await assignedProjectsResponse.json();
              if (
                assignedProjectsData.success &&
                assignedProjectsData.data &&
                Array.isArray(assignedProjectsData.data)
              ) {
                assignedProjects = assignedProjectsData.data.map(
                  (project: Project) => ({
                    id: project._id || project.id,
                    _id: `${
                      project._id || project.id
                    }-${Date.now()}-${Math.random()}`,
                    title: project.title || "Project Title",
                    description: project.description || "Project description",
                    minimumBid: project.minimumBid || 0,
                    budget: project.budget || 0,
                    technology: project.technology || [],
                    status: project.status || "in-progress",
                    ownerId: project.ownerId || "",
                    createdAt: project.createdAt,
                    updatedAt: project.updatedAt,
                    progress: project.progress || 0,
                    realProjectId: project._id || project.id,
                  })
                );
              }
            }
          } catch (error) {
            console.error("Error fetching assigned projects:", error);
          }

          const allActiveProjects = [
            ...activeProjectsFromBids,
            ...assignedProjects,
          ].filter(
            (project) => project && project.title && project.title !== ""
          );
          const uniqueProjectsMap = new Map();
          allActiveProjects.forEach((project) => {
            if (project && project._id) {
              uniqueProjectsMap.set(project._id, project);
            }
          });
          const uniqueProjects = Array.from(uniqueProjectsMap.values());

     
          const enhancedProjects = await Promise.all(
            uniqueProjects.map(async (project) => {
              try {
          
                if (!project.realProjectId) return project;

                const submissionsResponse = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/work-submissions/project/${project.realProjectId}`
                  ||
                  `localhost:5001/api/v1/work-submissions/project/${project.realProjectId}`,
                  {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  }
                );

                if (submissionsResponse.ok) {
                  const submissionsData = await submissionsResponse.json();
                  if (submissionsData.success && submissionsData.data) {
                    const submissions = submissionsData.data;
                    const approvedSprints = submissions.filter(
                      (sub: any) => sub.status === "approved"
                    ).length;

                  
                    if (approvedSprints >= 3) {
                      return {
                        ...project,
                        status: "completed",
                        progress: 100,
                      };
                    } else if (approvedSprints > 0) {
                    
                      const calculatedProgress = Math.round(
                        (approvedSprints / 3) * 100
                      );
                      return {
                        ...project,
                        progress: Math.max(
                          project.progress || 0,
                          calculatedProgress
                        ),
                      };
                    }
                  }
                }
              } catch (err) {
                console.error(
                  `Error checking sprints for project ${project.realProjectId}:`,
                  err
                );
              }
              return project;
            })
          );
          const sortedActiveProjects = enhancedProjects.sort((a, b) => {
            const dateA = new Date(a.updatedAt || a.createdAt);
            const dateB = new Date(b.updatedAt || b.createdAt);
            return dateB.getTime() - dateA.getTime();
          });

          setActiveProjects(sortedActiveProjects);

          setStats((prev) => ({
            ...prev,
            totalProjects: activeProjectsCount,
            activeProjects: activeProjectsCount,
            totalEarnings: totalEarnings,
          }));

          const approvedResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/projects/approved`
            ||
            `localhost:5001/api/v1/projects/approved`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (approvedResponse.ok) {
            const approvedData = await approvedResponse.json();
            if (
              approvedData.success &&
              approvedData.data &&
              approvedData.data.projects &&
              Array.isArray(approvedData.data.projects)
            ) {
        
              const allApprovedProjects = approvedData.data.projects;

              const sortedProjects = allApprovedProjects
                .sort(
                  (a: Project, b: Project) =>
                    new Date(b.updatedAt).getTime() -
                    new Date(a.updatedAt).getTime()
                )
                .slice(0, 4);
              setApprovedProjects(sortedProjects);
            }
          }

          setLoadingProjects(false);
          setLoadingBids(false);
        } catch (err) {
          console.error("Error fetching freelancer stats:", err);
     
          setStats({
            totalProjects: 0,
            activeProjects: 0,
            totalEarnings: 0,
            pendingBids: 0,
          });
          setLoadingProjects(false);
          setLoadingBids(false);
        }
      }
    };

    fetchFreelancerStats();
  }, [status, session, refreshTrigger]);

  // Function to refresh data
  const refreshData = () => {
    setRefreshTrigger((prev) => prev + 1);
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

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="space-y-6 py-6">
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-foreground mb-2"
            >
              Freelancer Dashboard
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground"
            >
              Welcome back, {session?.user?.name || "Freelancer"}
            </motion.p>
          </div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Projects
                  </CardTitle>
                  <div className="text-3xl font-bold mt-2">
                    {stats.totalProjects}
                  </div>
                </div>
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600 dark:text-blue-400"
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
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  +3 from last month
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Projects
                  </CardTitle>
                  <div className="text-3xl font-bold mt-2">
                    {stats.activeProjects}
                  </div>
                </div>
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-600 dark:text-green-400"
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
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Earnings
                  </CardTitle>
                  <div className="text-3xl font-bold mt-2">
                    ${stats.totalEarnings.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-600 dark:text-purple-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  +18% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Pending Bids
                  </CardTitle>
                  <div className="text-3xl font-bold mt-2">
                    {stats.pendingBids}
                  </div>
                </div>
                <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-orange-600 dark:text-orange-400"
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
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  2 accepted today
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          >
            {/* Active Projects */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl font-semibold">
                      Active Projects
                    </CardTitle>
                    <CardDescription className="text-sm mt-1">
                      You have {activeProjects.length} active projects
                      {activeProjects.length > 4 && " (showing latest 4)"}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {activeProjects.length > 4 && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push("/dashboard/freelancer/active-projects")}
                      >
                        View All
                      </Button>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={refreshData}
                        className="text-sm"
                    >
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                        </svg>
                        Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">Project</TableHead>
                        <TableHead className="font-semibold">Client</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">
                          Progress
                        </TableHead>
                        <TableHead className="font-semibold">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeProjects
                        .slice(0, 4) // Show only the latest 4 projects
                        .map((project) => (
                          <TableRow
                            key={
                              typeof project._id === "string"
                                ? project._id
                                : typeof project.id === "string"
                                ? project.id
                                : `project-${
                                    project.title || "unknown"
                                  }-${Date.now()}-${Math.random()}`
                            }
                            className="hover:bg-muted/50"
                          >
                            <TableCell className="font-medium">
                              {project.title}
                            </TableCell>
                            <TableCell>
                              <span className="text-muted-foreground">
                                {typeof project.ownerId === 'object' && project.ownerId !== null 
                                  ? (project.ownerId as any).name 
                                  : "Unknown Client"}
                              </span>
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
                                className="text-xs"
                              >
                                {project.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Progress
                                  value={project.progress || 0}
                                  className="h-2 w-20"
                                />
                                <span className="text-sm font-medium">
                                  {project.progress || 0}%
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  router.push(
                                    `/dashboard/freelancer/projects/${
                                      project.realProjectId ||
                                      (typeof project._id === "string" && !project._id.includes("-")
                                        ? project._id
                                        : "")
                                    }`
                                  )
                                }
                              >
                                Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
                {activeProjects.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No active projects yet.</p>
                    <p className="text-sm mt-1">
                      Your accepted projects will appear here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Bids */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                    <CardTitle className="text-xl font-semibold">
                        Recent Bids
                    </CardTitle>
                    <CardDescription className="text-sm mt-1">
                        Your recent project bids
                        {bids.length > 4 && " (showing latest 4)"}
                    </CardDescription>
                    </div>
                    {bids.length > 4 && (
                        <Button 
                        variant="outline"
                        size="sm" 
                        onClick={() => router.push("/dashboard/freelancer/bids")}
                        >
                        View All
                        </Button>
                    )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">Project</TableHead>
                        <TableHead className="font-semibold">Client</TableHead>
                        <TableHead className="font-semibold">Amount</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bids.slice(0, 4).map((bid) => (
                        <TableRow
                          key={
                            typeof bid._id === "string"
                              ? bid._id
                              : typeof bid.id === "string"
                              ? bid.id
                              : `bid-${
                                  bid.projectTitle || "unknown"
                                }-${Date.now()}-${Math.random()}`
                          }
                          className="hover:bg-muted/50"
                        >
                          <TableCell className="font-medium">
                            {bid.projectTitle || "Unknown Project"}
                          </TableCell>
                          <TableCell>
                            <span className="text-muted-foreground">
                              {bid.clientName || "Unknown Client"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">${bid.amount}</span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                bid.status === "accepted"
                                  ? "default"
                                  : bid.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                              }
                              className="text-xs"
                            >
                              {bid.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {bids.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No recent bids yet.</p>
                    <p className="text-sm mt-1">
                      Your submitted bids will appear here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Latest Approved Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 gap-6 mb-8"
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Latest Approved Projects
                </CardTitle>
                <CardDescription className="text-sm mt-1">
                  Recently approved projects for freelancers
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingProjects ? (
                  <div className="flex justify-center items-center h-32">
                    <p className="text-muted-foreground">Loading projects...</p>
                  </div>
                ) : approvedProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {approvedProjects.map((project) => (
                      <div
                        key={project.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-card"
                      >
                        <h3 className="font-semibold text-lg mb-2">
                          {project.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-medium">
                            Budget: ${project.budget}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {project.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technology.slice(0, 3).map((tech, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          className="w-full py-2"
                          onClick={() =>
                            router.push(
                              `/dashboard/freelancer/projects/${project._id}`
                            )
                          }
                        >
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No approved projects available.</p>
                    <p className="text-sm mt-1">
                      Projects will appear here when approved by admins.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>



          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Find Projects
                </CardTitle>
                <CardDescription className="text-sm mt-1">
                  Browse available projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full py-6 text-base"
                  onClick={() => router.push("/dashboard/freelancer/projects")}
                >
                  Browse Projects
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Sprint Planning
                </CardTitle>
                <CardDescription className="text-sm mt-1">
                  Plan your project in 3 sprints with 4 features each
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full py-6 text-base"
                  onClick={() => router.push("/dashboard/freelancer/tasks")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
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
                  View Tasks
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Reviews & Feedback
                </CardTitle>
                <CardDescription className="text-sm mt-1">
                  View client reviews and ratings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full py-6 text-base"
                  onClick={() => router.push("/dashboard/freelancer/reviews")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  View Reviews
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Submit Work
                </CardTitle>
                <CardDescription className="text-sm mt-1">
                  Submit completed project work
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full py-6 text-base"
                  onClick={() => router.push("/dashboard/freelancer/projects")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Submit Work
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
