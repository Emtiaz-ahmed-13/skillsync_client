"use client";

import SprintPlan from "@/components/features/projects/sprint-planning";
import { Navbar } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Project {
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

export default function SprintPlanPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const id = params.id as string;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated" && session?.user) {
      const sessionUser = session.user as { role?: string };
      if (sessionUser.role !== "freelancer") {
        router.push("/dashboard");
      } else {
        fetchProjectDetails();
      }
    }
  }, [status, session, router, id]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const sessionUser = session?.user as {
        accessToken?: string;
        role?: string;
      };
      const accessToken = sessionUser?.accessToken;

      if (!accessToken) {
        setError("Authentication token not available");
        return;
      }

      // Fetch project details
      const projectResponse = await fetch(
        `http://localhost:5001/api/v1/projects/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!projectResponse.ok) {
        throw new Error("Failed to fetch project");
      }

      const projectData = await projectResponse.json();
      if (projectData.success && projectData.data) {
        setProject(projectData.data);
      } else {
        throw new Error("Project not found");
      }
    } catch (err) {
      console.error("Error fetching project details:", err);
      setError("Failed to load project details");
      toast.error("Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background overflow-hidden relative">
        <Navbar />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
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
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
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

  if (!project) {
    return (
      <div className="min-h-screen bg-background overflow-hidden relative">
        <Navbar />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="text-center py-8">
            <p>Project not found</p>
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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="space-y-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-foreground">
              Sprint Planning
            </h1>
            <p className="text-muted-foreground mt-2">
              Plan your project in 3 sprints with 4 features each
            </p>
          </motion.div>

          <SprintPlan projectId={id} project={project} />

          <div className="flex justify-center mt-8">
            <Button
              onClick={() =>
                router.push(`/dashboard/freelancer/projects/${id}`)
              }
              variant="outline"
            >
              Back to Project
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
