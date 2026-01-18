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
}

interface Bid {
  id: string;
  _id: string;
  projectId: string | { _id: string; title?: string; ownerId?: any };
  projectTitle?: string;
  amount: number;
  proposal: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function ActiveProjectsClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (status === "authenticated" && session?.user) {
        const user = session.user as any;
        const accessToken = user.accessToken;

        try {
          // Fetch freelancer's bids to find active projects
          const bidsResponse = await fetch("/api/v1/bids/my", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          let bids = [];
          if (bidsResponse.ok) {
            const bidsData = await bidsResponse.json();
            if (bidsData.success && bidsData.data) {
              bids = bidsData.data;
            }
          }

          const acceptedBids = bids.filter((b: Bid) => b.status === "accepted");

          const activeProjectsFromBids = await Promise.all(
            acceptedBids.map(async (bid: Bid) => {
              try {
                const projectIdStr =
                  typeof bid.projectId === "object" && bid.projectId !== null
                    ? (bid.projectId as any)._id || (bid.projectId as any).id
                    : bid.projectId;

                const projectResponse = await fetch(
                  `/api/v1/projects/${projectIdStr}`,
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
                          ? `${
                              typeof bid.projectId === "object"
                                ? (bid.projectId as any)._id
                                : bid.projectId
                            }-${bid._id}`
                          : bid._id
                          ? `bid-${bid._id}`
                          : bid.id,
                      _id: `${
                        typeof bid.projectId === "object"
                          ? (bid.projectId as any)._id
                          : bid.projectId
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
                    };
                  }
                }
              } catch (error) {
                console.error("Error fetching project:", error);
              }

              // Fallback
              const fallbackTitle =
                bid.projectId &&
                typeof bid.projectId === "object" &&
                (bid.projectId as any).title
                  ? (bid.projectId as any).title
                  : bid.projectTitle || "Unknown Project";

              return {
                id:
                  bid.projectId && bid._id
                    ? `${
                        typeof bid.projectId === "object"
                          ? (bid.projectId as any)._id
                          : bid.projectId
                      }-${bid._id}`
                    : bid._id
                    ? `bid-${bid._id}`
                    : bid.id,
                _id: `${
                  typeof bid.projectId === "object"
                    ? (bid.projectId as any)._id
                    : bid.projectId
                }-${bid._id || "bid"}`,
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
              };
            })
          );
          const uniqueProjectsMap = new Map();
          activeProjectsFromBids.forEach((project) => {
            if (
              project &&
              project.title &&
              project.title !== "Unknown Project"
            ) {
              uniqueProjectsMap.set(project._id, project);
            }
          });

          setActiveProjects(Array.from(uniqueProjectsMap.values()));
          setLoading(false);
        } catch (error) {
          console.error("Error fetching projects:", error);
          setLoading(false);
        }
      }
    };

    fetchProjects();
  }, [status, session]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Active Projects
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage all your ongoing projects and track progress.
              </p>
            </div>
            <Button onClick={() => router.back()} variant="outline">
              Back to Dashboard
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Active Projects</CardTitle>
              <CardDescription>
                You have {activeProjects.length} active projects in progress.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeProjects.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No active projects found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeProjects.map((project) => (
                        <TableRow
                          key={project._id}
                          className="hover:bg-muted/50"
                        >
                          <TableCell className="font-medium">
                            {project.title}
                          </TableCell>
                          <TableCell>
                            <span className="text-muted-foreground">
                              {typeof project.ownerId === "object" &&
                              project.ownerId !== null
                                ? (project.ownerId as any).name
                                : "Unknown Client"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                project.status === "in-progress"
                                  ? "default"
                                  : "secondary"
                              }
                              className="capitalize"
                            >
                              {project.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-24 bg-secondary rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary"
                                  style={{ width: `${project.progress || 0}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {project.progress || 0}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                router.push(
                                  `/dashboard/freelancer/active-projects/${project.id}`
                                )
                              }
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
