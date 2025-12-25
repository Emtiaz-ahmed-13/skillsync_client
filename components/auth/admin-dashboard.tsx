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

// Types for our data
interface User {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  createdAt?: string;
  created_at?: string;
}

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

export default function AdminDashboardClient() {
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
    totalUsers: 0,
    activeProjects: 0,
    totalRevenue: 0,
    pendingTasks: 0,
  });
  const [pendingProjects, setPendingProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Stats cards with icons
  const statsCards = [
    {
      title: "Total Users",
      value: stats.totalUsers > 0 ? stats.totalUsers : 124,
      change: "+12% from last month",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Active Projects",
      value: stats.activeProjects > 0 ? stats.activeProjects : 24,
      change: "+3 from last month",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-green-500"
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
      ),
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Total Revenue",
      value: `$${(stats.totalRevenue > 0
        ? stats.totalRevenue
        : 12450
      ).toLocaleString()}`,
      change: "+18% from last month",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-purple-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Pending Tasks",
      value: stats.pendingTasks > 0 ? stats.pendingTasks : 8,
      change: "2 resolved today",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-orange-500"
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
      ),
      color: "bg-orange-100 text-orange-600",
    },
  ];

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const user = session.user as SessionUser;
      if (user.role !== "admin") {
        // Redirect to correct dashboard if user is not an admin
        switch (user.role) {
          case "client":
            router.push("/dashboard/client");
            break;
          case "freelancer":
            router.push("/dashboard/freelancer");
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
    // Fetch stats and pending projects from backend
    const fetchStatsAndProjects = async () => {
      if (status === "authenticated" && session?.user) {
        const user = session.user as SessionUser;

        // Check if user is admin before making API calls
        if (user.role !== "admin") {
          console.error("Access denied: User is not an admin");
          // Redirect to correct dashboard if user is not an admin
          switch (user.role) {
            case "client":
              router.push("/dashboard/client");
              break;
            case "freelancer":
              router.push("/dashboard/freelancer");
              break;
            default:
              router.push("/dashboard");
          }
          return;
        }

        const accessToken = user.accessToken;

        if (!accessToken) {
          console.error("No access token available");
          return;
        }

        try {
          // Fetch admin dashboard stats
          const statsResponse = await fetch(
            `http://localhost:5001/api/v1/admin/analytics`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (statsResponse.ok) {
            const statsData = await statsResponse.json();

            // Define type for stats object
            interface StatsResponse {
              totalUsers?: number;
              activeProjects?: number;
              totalRevenue?: number;
              pendingTasks?: number;
              total_users?: number;
              active_projects?: number;
              total_revenue?: number;
              pending_tasks?: number;
            }

            // Handle different possible response structures for stats
            let statsObj: StatsResponse = {};

            if (statsData.success && statsData.data) {
              // Standard API response format: { success: true, data: { ... } }
              statsObj = statsData.data;
            } else if (statsData.totalUsers !== undefined) {
              // Direct stats object response
              statsObj = statsData;
            } else {
              console.error("Unexpected stats API response format:", statsData);
              statsObj = {
                totalUsers: 0,
                activeProjects: 0,
                totalRevenue: 0,
                pendingTasks: 0,
              };
            }

            setStats({
              totalUsers: statsObj.totalUsers || statsObj.total_users || 0,
              activeProjects:
                statsObj.activeProjects || statsObj.active_projects || 0,
              totalRevenue:
                statsObj.totalRevenue || statsObj.total_revenue || 0,
              pendingTasks:
                statsObj.pendingTasks || statsObj.pending_tasks || 0,
            });
          } else {
            console.error(
              "Failed to fetch stats:",
              statsResponse.status,
              await statsResponse.text()
            );
            // Set default values on error
            setStats({
              totalUsers: 0,
              activeProjects: 0,
              totalRevenue: 0,
              pendingTasks: 0,
            });
          }

          // Fetch pending projects
          const projectsResponse = await fetch(
            `http://localhost:5001/api/v1/projects/pending`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          console.log("Pending projects API status:", projectsResponse.status); // Debug log

          if (projectsResponse.ok) {
            const projectsData = await projectsResponse.json();
            console.log("Pending projects API response:", projectsData); // Debug log
            if (
              projectsData.success &&
              projectsData.data &&
              projectsData.data.projects
            ) {
              setPendingProjects(projectsData.data.projects);
            } else {
              // If projectsData.data is not structured as expected, try to access projects directly
              if (Array.isArray(projectsData)) {
                setPendingProjects(projectsData);
              } else if (
                projectsData.data &&
                Array.isArray(projectsData.data)
              ) {
                setPendingProjects(projectsData.data);
              } else {
                setPendingProjects([]);
              }
            }
          } else {
            console.error(
              "Failed to fetch pending projects:",
              projectsResponse.status,
              await projectsResponse.text()
            ); // Debug log
            setPendingProjects([]);
          }
        } catch (err) {
          console.error("Error fetching stats or projects:", err);
          // Set default values
          setStats({
            totalUsers: 0,
            activeProjects: 0,
            totalRevenue: 0,
            pendingTasks: 0,
          });

          // Set empty array for pending projects
          setPendingProjects([]);
        } finally {
          // Fetch recent users and active projects
          const fetchUsersAndProjects = async () => {
            if (status === "authenticated" && session?.user) {
              const user = session.user as SessionUser;
              const accessToken = user.accessToken;

              if (!accessToken) {
                console.error("No access token available");
                return;
              }

              try {
                // Fetch recent users
                const usersResponse = await fetch(
                  `http://localhost:5001/api/v1/admin/users`,
                  {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  }
                );

                if (usersResponse.ok) {
                  const usersData = await usersResponse.json();

                  // Handle different possible response structures
                  let usersArray = [];

                  if (usersData.success && Array.isArray(usersData.data)) {
                    // Standard API response format: { success: true, data: [...] }
                    usersArray = usersData.data;
                  } else if (Array.isArray(usersData)) {
                    // Direct array response
                    usersArray = usersData;
                  } else if (
                    usersData.data &&
                    Array.isArray(usersData.data.users)
                  ) {
                    // Alternative format: { data: { users: [...] } }
                    usersArray = usersData.data.users;
                  } else {
                    console.error(
                      "Unexpected users API response format:",
                      usersData
                    );
                    usersArray = [];
                  }

                  if (usersArray.length > 0) {
                    // Get top 5 most recent users
                    const sortedUsers = usersArray
                      .sort(
                        (a, b) =>
                          new Date(
                            b.createdAt ||
                              b.created_at ||
                              b._id?.substring(0, 8)
                          ).getTime() -
                          new Date(
                            a.createdAt ||
                              a.created_at ||
                              a._id?.substring(0, 8)
                          ).getTime()
                      )
                      .slice(0, 5);
                    setRecentUsers(sortedUsers);
                  } else {
                    setRecentUsers([]);
                  }
                } else {
                  console.error("Failed to fetch users:", usersResponse.status);
                  setRecentUsers([]);
                }
              } catch (err) {
                console.error("Error fetching users or projects:", err);
                setRecentUsers([]);
              } finally {
                setLoadingUsers(false);
              }
            }
          };

          fetchUsersAndProjects();
          setLoadingProjects(false);
        }
      }
    };

    fetchStatsAndProjects();
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

  const handleApproveProject = async (
    projectId: string,
    status: "approved" | "rejected"
  ) => {
    if (!session?.user) return;

    const user = session.user as SessionUser;
    const accessToken = user.accessToken;

    if (!accessToken) {
      console.error("No access token available");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5001/api/v1/projects/${projectId}/approve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        // Update the local state to remove the approved/rejected project
        setPendingProjects((prev) => prev.filter((p) => p._id !== projectId));

        // Show success message
        alert(`Project ${status} successfully!`);
      } else {
        const errorData = await response.json();
        alert(
          `Failed to ${status} project: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (err) {
      console.error(`Error ${status}ing project:`, err);
      alert(`Error ${status}ing project: ${err}`);
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="space-y-8 py-4">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-foreground"
            >
              Admin Dashboard
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground mt-2 text-lg"
            >
              Welcome back, {session?.user?.name || "Admin"}
            </motion.p>
          </div>

          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Platform Overview
              </h2>
              <p className="text-sm text-muted-foreground">
                Monitor key metrics and activities
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.refresh()}>
                Refresh
              </Button>
              <Button onClick={() => router.push("/dashboard/admin/users")}>
                Manage Users
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {statsCards.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-sm font-medium">
                        {stat.title}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.change}
                      </p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-full`}>
                      {stat.icon}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Content Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 gap-6"
          >
            {/* Recent Users */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>
                  Top 5 most recently registered users
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingUsers ? (
                  <div className="text-center py-4">Loading users...</div>
                ) : recentUsers.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No users found
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentUsers.map((user) => (
                        <TableRow
                          key={user.id || user._id || Math.random().toString()}
                        >
                          <TableCell className="font-medium">
                            {user.name || "N/A"}
                          </TableCell>
                          <TableCell>{user.email || "N/A"}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.role === "admin"
                                  ? "default"
                                  : user.role === "client"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {user.role || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.status === "active"
                                  ? "default"
                                  : user.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {user.status || "N/A"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Pending Projects for Approval */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Pending Projects for Approval</CardTitle>
                  <CardDescription>
                    {pendingProjects.length} project(s) waiting for approval
                  </CardDescription>
                </div>
                <Badge variant="outline">
                  {pendingProjects.length} pending
                </Badge>
              </CardHeader>
              <CardContent>
                {loadingProjects ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary mb-2"></div>
                    <p>Loading pending projects...</p>
                  </div>
                ) : pendingProjects.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending projects for approval
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingProjects.map((project) => (
                      <div
                        key={project._id}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-card"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">
                                {project.title}
                              </h3>
                              <Badge variant="outline">Project</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {project.description}
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-muted-foreground">
                                  Budget:{" "}
                                </span>
                                <span>${project.budget}</span>
                              </div>
                              <div>
                                <span className="font-medium text-muted-foreground">
                                  Min Bid:{" "}
                                </span>
                                <span>${project.minimumBid}</span>
                              </div>
                              <div>
                                <span className="font-medium text-muted-foreground">
                                  Owner:{" "}
                                </span>
                                <span>{project.ownerId}</span>
                              </div>
                              <div>
                                <span className="font-medium text-muted-foreground">
                                  Technologies:{" "}
                                </span>
                                <span>{project.technology.join(", ")}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleApproveProject(project._id, "approved")
                              }
                            >
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                handleApproveProject(project._id, "rejected")
                              }
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
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
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <CardTitle>Manage Users</CardTitle>
                </div>
                <CardDescription>View and manage all users</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  onClick={() => router.push("/dashboard/admin/users")}
                >
                  View All Users
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-600"
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
                  </div>
                  <CardTitle>Manage Projects</CardTitle>
                </div>
                <CardDescription>Review and approve projects</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  onClick={() => router.push("/dashboard/admin/projects")}
                >
                  View All Projects
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <CardTitle>System Settings</CardTitle>
                </div>
                <CardDescription>Configure system settings</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Configure Settings
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
