"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

interface Sprint {
  _id?: string;
  projectId: string;
  title: string;
  description: string;
  features: Feature[];
  startDate: string;
  endDate: string;
  status: "planning" | "in-progress" | "completed";
}

interface CreateSprint {
  title: string;
  description: string;
  features: Feature[];
  startDate: string;
  endDate: string;
  status: "planning" | "in-progress" | "completed";
  projectId: string;
}

interface Feature {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
}

interface SprintFormData {
  title: string;
  description: string;
  projectId: string;
  startDate: string;
  endDate: string;
  status?: "planning" | "in-progress" | "completed";
}

interface SprintPlanResponse {
  success: boolean;
  message: string;
  data: {
    sprints: Sprint[];
    tasks: unknown[]; // Task interface would be defined separately
  };
}

const sprintValidationSchema = z.object({
  title: z
    .string()
    .min(1, "Sprint title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z.string().min(1, "Sprint description is required"),
  projectId: z.string().min(1, "Project ID is required"),
  startDate: z
    .string()
    .datetime({ message: "Start date must be a valid date" }),
  endDate: z.string().datetime({ message: "End date must be a valid date" }),
  status: z
    .enum(["planning", "in-progress", "completed"], {
      errorMap: () => ({
        message: "Status must be planning, in-progress, or completed",
      }),
    })
    .optional()
    .default("planning"),
  features: z
    .array(
      z.object({
        id: z.string().min(1, "Feature ID is required"),
        title: z.string().min(1, "Feature title is required"),
        description: z.string().min(1, "Feature description is required"),
        status: z.enum(["pending", "in-progress", "completed"]).optional(),
      })
    )
    .optional()
    .default([]),
});

interface Project {
  _id: string;
  title: string;
  description: string;
  technology: string[];
  status: string;
}

interface SprintPlanProps {
  projectId: string;
  project: Project;
}

export default function SprintPlan({ projectId, project }: SprintPlanProps) {
  const { data: session } = useSession();
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [isPlanning, setIsPlanning] = useState(false);
  const [currentSprintIndex, setCurrentSprintIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editingFeature, setEditingFeature] = useState<{
    sprintIndex: number;
    featureIndex: number;
  } | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");

  // Form state for adding new sprints and features
  const [newSprintTitle, setNewSprintTitle] = useState("");
  const [newSprintDescription, setNewSprintDescription] = useState("");
  const [newSprintStartDate, setNewSprintStartDate] = useState("");
  const [newSprintEndDate, setNewSprintEndDate] = useState("");

  const [newFeatureTitle, setNewFeatureTitle] = useState("");
  const [newFeatureDescription, setNewFeatureDescription] = useState("");
  const [selectedSprintForFeature, setSelectedSprintForFeature] = useState<
    number | null
  >(null);

  useEffect(() => {
    // Load existing sprint plan if available
    const loadSprintPlan = async () => {
      try {
        setLoading(true);

        // Get the access token from the session
        const sessionUser = session?.user as {
          accessToken?: string;
        };
        const accessToken = sessionUser?.accessToken;

        if (!accessToken) {
          console.error("No access token available");
          initializeSprints();
          return;
        }

        // Try to get existing sprints, but handle 404 gracefully
        try {
          // Use the correct endpoint for sprint planning
          const response = await fetch(`/api/v1/sprint-planning/${projectId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data && result.data.sprints) {
              setSprints(result.data.sprints);
            } else {
              initializeSprints();
            }
          } else {
            initializeSprints();
          }
        } catch (error) {
          console.warn(
            "Failed to load existing sprints, initializing default sprints:",
            error
          );
          initializeSprints();
        }
      } catch (error) {
        console.error("Unexpected error in loadSprintPlan:", error);
        initializeSprints();
      } finally {
        setLoading(false);
      }
    };

    loadSprintPlan();
  }, [projectId, session]);

  const initializeSprints = () => {
    const today = new Date();
    const newSprints: Sprint[] = [];

    for (let i = 0; i < 3; i++) {
      const startDate = new Date(today);
      startDate.setDate(today.getDate() + i * 14);

      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 14);

      newSprints.push({
        _id: `sprint-${i + 1}`,
        projectId: projectId,
        title: `Sprint ${i + 1}`,
        description: `Development sprint ${i + 1} for ${project.title}`,
        features: Array(4)
          .fill(null)
          .map((_, idx) => ({
            id: `feature-${i + 1}-${idx + 1}`,
            title: `Feature ${idx + 1}`,
            description: `Feature description for sprint ${i + 1}, feature ${
              idx + 1
            }`,
            status: "pending",
          })),
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        status: i === 0 ? "in-progress" : "planning",
      });
    }

    setSprints(newSprints);
  };

  const updateFeatureStatus = (
    sprintIndex: number,
    featureIndex: number,
    status: "pending" | "in-progress" | "completed"
  ) => {
    const updatedSprints = [...sprints];
    updatedSprints[sprintIndex].features[featureIndex].status = status;

    // Auto-update sprint status based on feature completion
    const sprint = updatedSprints[sprintIndex];
    const allCompleted =
      sprint.features.length > 0 &&
      sprint.features.every((f) => f.status === "completed");
    const anyInProgress = sprint.features.some(
      (f) => f.status === "in-progress"
    );

    if (allCompleted) {
      updatedSprints[sprintIndex].status = "completed";
    } else if (anyInProgress) {
      updatedSprints[sprintIndex].status = "in-progress";
    } else if (sprint.status === "completed") {
      // If it was completed but now has non-completed features, set to in-progress
      updatedSprints[sprintIndex].status = "in-progress";
    }

    setSprints(updatedSprints);
  };

  const startEditingFeature = (sprintIndex: number, featureIndex: number) => {
    setEditingFeature({ sprintIndex, featureIndex });
    setEditingTitle(sprints[sprintIndex].features[featureIndex].title);
    setEditingDescription(
      sprints[sprintIndex].features[featureIndex].description
    );
  };

  const saveEditedFeature = () => {
    if (editingFeature) {
      const { sprintIndex, featureIndex } = editingFeature;
      const updatedSprints = [...sprints];
      updatedSprints[sprintIndex].features[featureIndex].title = editingTitle;
      updatedSprints[sprintIndex].features[featureIndex].description =
        editingDescription;
      setSprints(updatedSprints);
      setEditingFeature(null);
      setEditingTitle("");
      setEditingDescription("");
    }
  };

  const cancelEditingFeature = () => {
    setEditingFeature(null);
    setEditingTitle("");
    setEditingDescription("");
  };

  const addNewSprint = () => {
    if (!newSprintTitle.trim()) {
      toast.error("Please enter a sprint title");
      return;
    }

    if (!newSprintStartDate || !newSprintEndDate) {
      toast.error("Please enter both start and end dates");
      return;
    }

    const newSprint: Sprint = {
      _id: `sprint-${Date.now()}`,
      projectId: projectId,
      title: newSprintTitle,
      description: newSprintDescription,
      startDate: newSprintStartDate,
      endDate: newSprintEndDate,
      status: "planning",
      features: [],
    };

    setSprints([...sprints, newSprint]);
    setNewSprintTitle("");
    setNewSprintDescription("");
    setNewSprintStartDate("");
    setNewSprintEndDate("");
  };

  const addNewFeature = () => {
    if (selectedSprintForFeature === null) {
      toast.error("Please select a sprint to add the feature to");
      return;
    }

    if (!newFeatureTitle.trim()) {
      toast.error("Please enter a feature title");
      return;
    }

    const updatedSprints = [...sprints];
    const featureId = `feature-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    updatedSprints[selectedSprintForFeature].features.push({
      id: featureId,
      title: newFeatureTitle,
      description: newFeatureDescription,
      status: "pending",
    });

    setSprints(updatedSprints);
    setNewFeatureTitle("");
    setNewFeatureDescription("");
    setSelectedSprintForFeature(null);
  };

  const generateManualPlan = async () => {
    try {
      const sessionUser = session?.user as {
        accessToken?: string;
      };
      const accessToken = sessionUser?.accessToken;

      if (!accessToken) {
        toast.error("Authentication required. Please log in.");
        return;
      }
      const response = await fetch(
        `/api/v1/sprint-planning/generate/${projectId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ method: "manual" }),
        }
      );

      const result = await response.json();

      if (result.success && result.data && result.data.sprints) {
        setSprints(result.data.sprints);
        toast.success("Manual sprint plan generated successfully!");
      } else {
        toast.error(result.message || "Failed to generate manual sprint plan");
      }
    } catch (error) {
      console.error("Error generating manual sprint plan:", error);
      toast.error("An error occurred while generating the manual sprint plan");
    }
  };

  const updateSprintStatus = (
    sprintIndex: number,
    status: "planning" | "in-progress" | "completed"
  ) => {
    const updatedSprints = [...sprints];
    updatedSprints[sprintIndex].status = status;
    setSprints(updatedSprints);
  };

  const saveSprintPlan = async () => {
    try {
      // Get the access token from the session
      const sessionUser = session?.user as {
        accessToken?: string;
      };
      const accessToken = sessionUser?.accessToken;

      if (!accessToken) {
        toast.error("Authentication required. Please log in.");
        return;
      }

      // Convert local sprints to the format expected by the API
      const sprintsForAPI = sprints.map((sprint) => ({
        title: sprint.title,
        description: sprint.description,
        features: sprint.features.map((feature) => ({
          ...feature,
          status: feature.status || "pending", // Ensure status is always defined
        })),
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        status: sprint.status,
        projectId: projectId,
      }));

      // Use the endpoint for creating sprint plan
      const response = await fetch(
        `/api/v1/sprint-planning/generate/${projectId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            method: "manual",
            customData: {
              sprints: sprintsForAPI,
              tasks: [],
            },
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success("Sprint plan saved successfully!");
      } else {
        toast.error(result.message || "Failed to save sprint plan");
      }
    } catch (error) {
      console.error("Error saving sprint plan:", error);
      toast.error("An error occurred while saving the sprint plan");
    }
  };

  const getFeatureStatusCount = (sprint: Sprint) => {
    const total = sprint.features.length;
    const completed = sprint.features.filter(
      (f) => f.status === "completed"
    ).length;
    const inProgress = sprint.features.filter(
      (f) => f.status === "in-progress"
    ).length;
    const pending = sprint.features.filter(
      (f) => f.status === "pending"
    ).length;

    return { total, completed, inProgress, pending };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <p>Loading sprint plan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sprint Planning</h2>
          <p className="text-muted-foreground mt-1">
            Manage development cycles for{" "}
            <span className="font-medium text-foreground">{project.title}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={generateManualPlan}
            variant="outline"
            className="gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
            Auto-Generate Plan
          </Button>
          <Button onClick={saveSprintPlan} className="gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form to add new sprint */}
        <Card className="hover:shadow-md transition-all duration-300 border-l-4 border-l-purple-500">
          <CardHeader className="bg-muted/10 pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New Sprint
            </CardTitle>
            <CardDescription>
              Create a new 14-day development cycle
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Sprint Title
              </label>
              <Input
                value={newSprintTitle}
                onChange={(e) => setNewSprintTitle(e.target.value)}
                placeholder="e.g., Sprint 1: Core Authentication"
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Goals & Objectives
              </label>
              <Input
                value={newSprintDescription}
                onChange={(e) => setNewSprintDescription(e.target.value)}
                placeholder="What will be achieved in this sprint?"
                className="bg-background"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={newSprintStartDate}
                  onChange={(e) => setNewSprintStartDate(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  End Date
                </label>
                <Input
                  type="date"
                  value={newSprintEndDate}
                  onChange={(e) => setNewSprintEndDate(e.target.value)}
                  className="bg-background"
                />
              </div>
            </div>
            <Button onClick={addNewSprint} className="w-full mt-2">
              Create Sprint
            </Button>
          </CardContent>
        </Card>

        {/* Form to add new feature */}
        <Card className="hover:shadow-md transition-all duration-300 border-l-4 border-l-blue-500">
          <CardHeader className="bg-muted/10 pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Add Feature
            </CardTitle>
            <CardDescription>
              Assign tasks to a specific sprint cycle
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Target Sprint
              </label>
              <select
                value={selectedSprintForFeature ?? ""}
                onChange={(e) =>
                  setSelectedSprintForFeature(
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-10"
              >
                <option value="">Select a sprint...</option>
                {sprints.map((sprint, index) => (
                  <option key={sprint._id} value={index}>
                    {sprint.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Feature Name
              </label>
              <Input
                value={newFeatureTitle}
                onChange={(e) => setNewFeatureTitle(e.target.value)}
                placeholder="e.g., Implement OAuth Logic"
                disabled={selectedSprintForFeature === null}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Description
              </label>
              <Input
                value={newFeatureDescription}
                onChange={(e) => setNewFeatureDescription(e.target.value)}
                placeholder="Technical details..."
                disabled={selectedSprintForFeature === null}
                className="bg-background"
              />
            </div>
            <Button
              onClick={addNewFeature}
              className="w-full mt-2"
              variant="outline"
              disabled={
                selectedSprintForFeature === null || !newFeatureTitle.trim()
              }
            >
              Add Feature to Sprint
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sprints.map((sprint, sprintIndex) => {
          const { total, completed, inProgress, pending } =
            getFeatureStatusCount(sprint);
          const progress =
            total > 0 ? Math.round((completed / total) * 100) : 0;

          return (
            <motion.div
              key={sprint._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sprintIndex * 0.1 }}
            >
              <Card
                className={`hover:shadow-lg transition-shadow duration-300 ${
                  sprint.status === "completed"
                    ? "border-green-500"
                    : sprint.status === "in-progress"
                    ? "border-blue-500"
                    : "border-gray-500"
                }`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{sprint.title}</CardTitle>
                      <CardDescription>
                        {sprint.startDate} to {sprint.endDate}
                      </CardDescription>
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
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-6">
                    {sprint.description}
                  </p>

                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="space-y-4">
                    {sprint.features.map((feature, featureIndex) => {
                      const isEditing =
                        editingFeature?.sprintIndex === sprintIndex &&
                        editingFeature?.featureIndex === featureIndex;

                      return (
                        <div
                          key={feature.id}
                          className={`p-4 border rounded-lg transition-all duration-200 ${
                            feature.status === "completed"
                              ? "bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800"
                              : feature.status === "in-progress"
                              ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
                              : "bg-card hover:border-primary/30"
                          }`}
                        >
                          {isEditing ? (
                            <div className="space-y-3">
                              <Input
                                value={editingTitle}
                                onChange={(e) =>
                                  setEditingTitle(e.target.value)
                                }
                                className="font-medium"
                                placeholder="Feature title"
                              />
                              <Input
                                value={editingDescription}
                                onChange={(e) =>
                                  setEditingDescription(e.target.value)
                                }
                                className="text-xs"
                                placeholder="Feature description"
                              />
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={saveEditedFeature}
                                  className="text-xs h-7"
                                >
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={cancelEditingFeature}
                                  className="text-xs h-7"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-3">
                              <div className="flex justify-between items-start gap-2">
                                <div>
                                  <h4
                                    className={`font-medium text-sm ${
                                      feature.status === "completed"
                                        ? "line-through text-muted-foreground"
                                        : ""
                                    }`}
                                  >
                                    {feature.title}
                                  </h4>
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {feature.description}
                                  </p>
                                </div>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() =>
                                    startEditingFeature(
                                      sprintIndex,
                                      featureIndex
                                    )
                                  }
                                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                  </svg>
                                </Button>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      updateFeatureStatus(
                                        sprintIndex,
                                        featureIndex,
                                        "pending"
                                      )
                                    }
                                    className={`w-6 h-6 rounded-full ring-2 ring-offset-2 transition-all hover:scale-110 ${
                                      feature.status === "pending"
                                        ? "bg-yellow-400 ring-yellow-400 shadow-md"
                                        : "bg-muted ring-transparent hover:bg-yellow-200 hover:ring-yellow-300"
                                    }`}
                                    title="Mark as Pending"
                                  />
                                  <button
                                    onClick={() =>
                                      updateFeatureStatus(
                                        sprintIndex,
                                        featureIndex,
                                        "in-progress"
                                      )
                                    }
                                    className={`w-6 h-6 rounded-full ring-2 ring-offset-2 transition-all hover:scale-110 ${
                                      feature.status === "in-progress"
                                        ? "bg-blue-400 ring-blue-400 shadow-md"
                                        : "bg-muted ring-transparent hover:bg-blue-200 hover:ring-blue-300"
                                    }`}
                                    title="Mark as In Progress"
                                  />
                                  <button
                                    onClick={() =>
                                      updateFeatureStatus(
                                        sprintIndex,
                                        featureIndex,
                                        "completed"
                                      )
                                    }
                                    className={`w-6 h-6 rounded-full ring-2 ring-offset-2 transition-all hover:scale-110 ${
                                      feature.status === "completed"
                                        ? "bg-green-400 ring-green-400 shadow-md"
                                        : "bg-muted ring-transparent hover:bg-green-200 hover:ring-green-300"
                                    }`}
                                    title="Mark as Completed"
                                  />
                                </div>
                                <span
                                  className={`text-[10px] uppercase font-bold tracking-wider ${
                                    feature.status === "completed"
                                      ? "text-green-600"
                                      : feature.status === "in-progress"
                                      ? "text-blue-600"
                                      : "text-yellow-600"
                                  }`}
                                >
                                  {feature.status.replace("-", " ")}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 pt-6 border-t flex justify-between text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    <span>
                      <span className="text-foreground">{completed}</span> Done
                    </span>
                    <span>
                      <span className="text-foreground">{inProgress}</span>{" "}
                      Active
                    </span>
                    <span>
                      <span className="font-medium">{pending}</span> pending
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
