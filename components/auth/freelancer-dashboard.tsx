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

// Define types for our data
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
  progress?: number; // Optional progress field
}

interface Bid {
  id: string;
  _id: string;
  projectId: string;
  projectTitle: string;
  amount: number;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
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
          // Fetch freelancer's assigned projects
          const projectsResponse = await fetch(
            `http://localhost:5001/api/v1/projects/assigned/${user.id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (projectsResponse.ok) {
            const projectsData = await projectsResponse.json();
            if (
              projectsData.success &&
              projectsData.data &&
              projectsData.data.projects
            ) {
              const projects = projectsData.data.projects;
              setActiveProjects(projects);

              setStats((prev) => ({
                ...prev,
                totalProjects: projects.length,
                activeProjects: projects.filter(
                  (p: Project) => p.status !== "completed"
                ).length,
              }));
            }
          }

          // Fetch freelancer's bids
          const bidsResponse = await fetch(
            `http://localhost:5001/api/v1/bids/freelancer/${user.id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (bidsResponse.ok) {
            const bidsData = await bidsResponse.json();
            if (bidsData.success && bidsData.data && bidsData.data.bids) {
              const bids = bidsData.data.bids;
              setBids(bids);

              setStats((prev) => ({
                ...prev,
                pendingBids: bids.filter((b: Bid) => b.status === "pending")
                  .length,
              }));
            }
          }

          // Fetch approved projects
          const approvedResponse = await fetch(
            `http://localhost:5001/api/v1/projects/approved`
          );

          if (approvedResponse.ok) {
            const approvedData = await approvedResponse.json();
            if (
              approvedData.success &&
              approvedData.data &&
              approvedData.data.projects
            ) {
              // Get the latest 3 approved projects
              const sortedProjects = approvedData.data.projects
                .sort(
                  (a: Project, b: Project) =>
                    new Date(b.updatedAt).getTime() -
                    new Date(a.updatedAt).getTime()
                )
                .slice(0, 3);
              setApprovedProjects(sortedProjects);
            }
          }

          setLoadingProjects(false);
          setLoadingBids(false);
        } catch (err) {
          console.error("Error fetching freelancer stats:", err);
          // Set default values
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
  }, [status, session]);

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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="space-y-8 py-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-foreground"
            >
              Freelancer Dashboard
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground mt-2 text-lg"
            >
              Welcome back, {session?.user?.name || "Freelancer"}
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
                  +3 from last month
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
                  +2 from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Earnings
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
                  ${stats.totalEarnings.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +18% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Bids
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
                <div className="text-2xl font-bold">{stats.pendingBids}</div>
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
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Active Projects */}
            <Card>
              <CardHeader>
                <CardTitle>Active Projects</CardTitle>
                <CardDescription>
                  You have{" "}
                  {
                    activeProjects.filter((p) => p.status !== "completed")
                      .length
                  }{" "}
                  active projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeProjects
                      .filter((p) => p.status !== "completed")
                      .map((project) => (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium">
                            {project.title}
                          </TableCell>
                          <TableCell>Client</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                project.status === "in-progress"
                                  ? "default"
                                  : project.status === "pending"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {project.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress
                                value={project.progress || 0}
                                className="h-2 w-24"
                              />
                              <span className="text-sm">
                                {project.progress || 0}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Recent Bids */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Bids</CardTitle>
                <CardDescription>Your recent project bids</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bids.map((bid) => (
                      <TableRow key={bid.id}>
                        <TableCell className="font-medium">
                          {bid.projectTitle}
                        </TableCell>
                        <TableCell>Client</TableCell>
                        <TableCell>${bid.amount}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              bid.status === "accepted"
                                ? "default"
                                : bid.status === "pending"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {bid.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>

          {/* Latest Approved Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 gap-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Latest Approved Projects</CardTitle>
                <CardDescription>
                  Recently approved projects for freelancers
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingProjects ? (
                  <div className="flex justify-center items-center h-32">
                    <p>Loading projects...</p>
                  </div>
                ) : approvedProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {approvedProjects.map((project) => (
                      <div
                        key={project.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <h3 className="font-semibold text-lg">
                          {project.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-sm font-medium">
                            Budget: ${project.budget}
                          </span>
                          <Badge variant="outline">{project.status}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-3">
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
                          className="mt-4 w-full"
                          variant="outline"
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
                  <p>No approved projects available.</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Find Projects</CardTitle>
                <CardDescription>Browse available projects</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  onClick={() => router.push("/dashboard/freelancer/projects")}
                >
                  Browse Projects
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Submit Work</CardTitle>
                <CardDescription>Submit completed project work</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Submit Work</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Update Profile</CardTitle>
                <CardDescription>
                  Manage your freelancer profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  onClick={() =>
                    router.push("/dashboard/freelancer/profile/update")
                  }
                >
                  Update Profile
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
