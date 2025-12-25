"use client";

import { Navbar } from "@/components/home/navbar";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { Badge } from "@/components/ui/badge";
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

export default function AllProjectsPage() {
  const { data: session, status } = useSession();

  // Define type for session user with role
  type SessionUser = {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
    role?: string;
    accessToken?: string;
  };

  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

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
      } else {
        // Fetch all projects
        fetchProjects();
      }
    } else if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [session, status, router]);

  const fetchProjects = async () => {
    if (status === "authenticated" && session?.user) {
      const user = session.user as SessionUser;
      const accessToken = user.accessToken;

      if (!accessToken) {
        console.error("No access token available");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5001/api/v1/projects`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data && Array.isArray(data.data.projects)) {
            setProjects(data.data.projects);
          } else {
            setProjects([]);
          }
        } else {
          console.error("Failed to fetch projects:", response.status);
          setProjects([]);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    } else {
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

      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0 pt-16">
        <BackgroundRippleEffect />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="space-y-8 py-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-foreground"
            >
              All Projects
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground mt-2"
            >
              Manage all projects on the platform
            </motion.p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Projects Management</CardTitle>
              <CardDescription>
                {projects.length} project(s) on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading projects...</div>
              ) : projects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No projects found
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project</TableHead>
                        <TableHead>Owner ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Technologies</TableHead>
                        <TableHead>Created At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects.map((project) => (
                        <TableRow key={project._id}>
                          <TableCell className="font-medium">
                            {project.title}
                          </TableCell>
                          <TableCell>{project.ownerId}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                project.status === "completed"
                                  ? "default"
                                  : project.status === "in-progress"
                                  ? "secondary"
                                  : project.status === "pending"
                                  ? "outline"
                                  : "destructive"
                              }
                            >
                              {project.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress
                                value={
                                  project.progress ||
                                  (project.status === "completed" ? 100 : 50)
                                }
                                className="h-2 w-24"
                              />
                              <span className="text-sm">
                                {project.progress
                                  ? `${project.progress}%`
                                  : project.status === "completed"
                                  ? "100%"
                                  : "50%"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>${project.budget}</TableCell>
                          <TableCell>{project.technology.join(", ")}</TableCell>
                          <TableCell>
                            {new Date(project.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
