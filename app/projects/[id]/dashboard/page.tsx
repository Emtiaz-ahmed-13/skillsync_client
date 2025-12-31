"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  owner: string;
}

export default function ProjectDashboardPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { data: session, status } = useSession();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }

    // Fetch project details
    const fetchProject = async () => {
      try {
        // In a real implementation, this would call the API to get project details
        // For now, we'll create a mock project
        const mockProject: Project = {
          id,
          title: `Project ${id}`,
          description: "This is a sample project description.",
          status: "active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          owner: session?.user?.name || "Unknown",
        };
        setProject(mockProject);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchProject();
    }
  }, [status, router, id, session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-foreground">Loading project dashboard...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-4">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Project Not Found
          </h2>
          <p className="text-muted-foreground mb-4">
            The project you're looking for doesn't exist or you don't have
            access to it.
          </p>
          <Button onClick={() => router.push("/projects")}>
            Go to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">{project.title}</h1>
        <p className="text-muted-foreground mt-2">Project ID: {project.id}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {project.status}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Current status of the project
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Created</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {new Date(project.createdAt).toLocaleDateString()}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Project creation date
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Owner</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {project.owner}
            </div>
            <p className="text-sm text-muted-foreground mt-2">Project owner</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground">{project.description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
