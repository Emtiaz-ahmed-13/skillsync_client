/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Textarea } from "@/components/ui/textarea";
import {
  WorkSubmission as ApiWorkSubmission,
  createWorkSubmission,
  createWorkSubmissionNotification,
  getProjectSprints,
  getWorkSubmissionsBySprint,
} from "@/lib/api/work-submission-api";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Feature {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
}

interface Sprint {
  _id: string;
  title: string;
  description: string;
  features: Feature[];
  startDate: string;
  endDate: string;
  status: "planning" | "in-progress" | "completed";
}

interface Project {
  _id: string;
  title: string;
  description: string;
  technology: string[];
  status: string;
}

interface WorkSubmissionProps {
  projectId: string;
  project: Project;
}

export default function WorkSubmission({
  projectId,
  project,
}: WorkSubmissionProps) {
  const { data: session } = useSession();

  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [selectedSprint, setSelectedSprint] = useState<string | null>(null);
  const [completedFeatures, setCompletedFeatures] = useState<string[]>([]);
  const [remainingFeatures, setRemainingFeatures] = useState<string[]>([]);
  const [githubLink, setGithubLink] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [workSubmissions, setWorkSubmissions] = useState<ApiWorkSubmission[]>(
    []
  );
  useEffect(() => {
    const loadSprints = async () => {
      try {
        const token = (session?.user as any)?.accessToken;
        if (!token) return;

        const res = await getProjectSprints(projectId, token);
        if (res.success) {
          setSprints(res.data || []);
          if (res.data?.length) {
            const active =
              res.data.find((s: Sprint) => s.status !== "completed") ??
              res.data[0];
            setSelectedSprint(active._id);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadSprints();
  }, [projectId, session]);
  useEffect(() => {
    if (!selectedSprint) return;

    const sprint = sprints.find((s) => s._id === selectedSprint);
    if (!sprint) return;

    setCompletedFeatures(
      sprint.features
        .filter((f) => f.status === "completed")
        .map((f) => f.title)
    );

    setRemainingFeatures(
      sprint.features
        .filter((f) => f.status !== "completed")
        .map((f) => f.title)
    );

    loadSubmissions(selectedSprint);
  }, [selectedSprint, sprints]);

  const loadSubmissions = async (sprintId: string) => {
    const token = (session?.user as any)?.accessToken;
    if (!token) return;

    const res = await getWorkSubmissionsBySprint(sprintId, token);
    setWorkSubmissions(res.success ? res.data || [] : []);
  };
  const validateForm = () => {
    if (!githubLink.trim()) {
      toast.error("GitHub repository link is required");
      return false;
    }

    try {
      const url = new URL(githubLink);
      if (!url.hostname.includes("github.com")) throw new Error();
    } catch {
      toast.error("Invalid GitHub repository URL");
      return false;
    }

    if (liveLink) {
      try {
        new URL(liveLink);
      } catch {
        toast.error("Invalid live demo URL");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!selectedSprint) return;

    const sprint = sprints.find((s) => s._id === selectedSprint);
    if (!sprint) return;

    if (
      sprint.features.length > 0 &&
      !sprint.features.every((f) => f.status === "completed")
    )
      if (workSubmissions.some((s) => s.sprintId === selectedSprint)) {
        toast.error("You already submitted work for this sprint.");
        return;
      }

    if (!validateForm()) return;

    const promise = async () => {
      const user = session?.user as any;
      const token = user?.accessToken;

      const res = await createWorkSubmission(
        {
          projectId,
          sprintId: selectedSprint,
          freelancerId: user.id,
          completedFeatures,
          remainingFeatures,
          githubLink,
          liveLink,
          notes,
          status: "pending",
        },
        token
      );

      if (!res.success) {
        throw new Error(res.message || "Submission failed");
      }

      await createWorkSubmissionNotification(
        projectId,
        project.title,
        user.id,
        token
      );

      setGithubLink("");
      setLiveLink("");
      setNotes("");
      loadSubmissions(selectedSprint);
      return "Work submitted successfully!";
    };

    setSubmitting(true);
    toast.promise(promise(), {
      loading: "Submitting work...",
      success: (data) => {
        setSubmitting(false);
        return data;
      },
      error: (err) => {
        setSubmitting(false);
        return err.message;
      },
    });
  };

  if (loading) return <p>Loading...</p>;

  const selectedSprintData = sprints.find((s) => s._id === selectedSprint);

  const totalSprints = sprints.length;
  const completedSprintsCount = sprints.filter(
    (s) => s.status === "completed"
  ).length;
  const totalFeaturesCount = sprints.reduce(
    (sum, s) => sum + s.features.length,
    0
  );
  const completedFeaturesCount = sprints.reduce(
    (sum, s) => sum + s.features.filter((f) => f.status === "completed").length,
    0
  );
  const inProgressFeaturesCount = sprints.reduce(
    (sum, s) =>
      sum + s.features.filter((f) => f.status === "in-progress").length,
    0
  );
  const pendingFeaturesCount = sprints.reduce(
    (sum, s) => sum + s.features.filter((f) => f.status === "pending").length,
    0
  );
  const overallProgress =
    totalFeaturesCount > 0
      ? Math.round((completedFeaturesCount / totalFeaturesCount) * 100)
      : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-100px)]">
      {/* SIDEBAR: SPRINT LIST */}
      <Card className="lg:col-span-1 h-full overflow-hidden flex flex-col border-r shadow-none rounded-none lg:rounded-l-xl lg:border-y lg:border-l">
        <CardHeader className="bg-muted/30 pb-4 border-b">
          <CardTitle className="text-lg flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M12 13v6" />
              <path d="M9 16l3 3 3-3" />
            </svg>
            Sprints
          </CardTitle>
          <CardDescription>Select a sprint to submit</CardDescription>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-y-auto">
          <div className="flex flex-col">
            {sprints.map((s) => (
              <button
                key={s._id}
                onClick={() => setSelectedSprint(s._id)}
                className={`flex items-start justify-between p-4 border-b text-left transition-colors hover:bg-muted/50 ${
                  selectedSprint === s._id
                    ? "bg-primary/5 border-l-4 border-l-primary"
                    : "border-l-4 border-l-transparent"
                }`}
              >
                <div>
                  <h4
                    className={`font-semibold text-sm ${
                      selectedSprint === s._id ? "text-primary" : ""
                    }`}
                  >
                    {s.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {s.description}
                  </p>
                </div>
                <Badge
                  variant={
                    s.status === "completed"
                      ? "default"
                      : s.status === "in-progress"
                      ? "secondary"
                      : "outline"
                  }
                  className="text-[10px] uppercase h-5 px-1.5"
                >
                  {s.status === "in-progress" ? "Active" : s.status}
                </Badge>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* MAIN CONTENT: DETAILS & FORM */}
      <div className="lg:col-span-3 space-y-6 h-full overflow-y-auto pr-1">
        {selectedSprintData ? (
          <>
            {/* Sprint Header & Stats */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">
                      {selectedSprintData.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {selectedSprintData.description}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-muted-foreground">
                      Sprint Status
                    </div>
                    <Badge
                      className={`mt-1 text-sm ${
                        selectedSprintData.status === "completed"
                          ? "bg-green-500 hover:bg-green-600"
                          : selectedSprintData.status === "in-progress"
                          ? "bg-blue-500 hover:bg-blue-600"
                          : ""
                      }`}
                    >
                      {selectedSprintData.status
                        .toUpperCase()
                        .replace("-", " ")}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="border-t pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Features Completion
                    </p>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold text-primary">
                        {completedFeatures.length}
                        <span className="text-lg text-muted-foreground font-normal">
                          /{selectedSprintData.features.length}
                        </span>
                      </span>
                    </div>
                    <Progress
                      value={
                        selectedSprintData.features.length > 0
                          ? (completedFeatures.length /
                              selectedSprintData.features.length) *
                            100
                          : 0
                      }
                      className="h-2 mt-2"
                    />
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Start Date</span>
                      <span className="font-mono">
                        {new Date(
                          selectedSprintData.startDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">End Date</span>
                      <span className="font-mono">
                        {new Date(
                          selectedSprintData.endDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center bg-muted/30 rounded-lg p-2">
                    <div className="text-center">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Remaining
                      </p>
                      <p className="text-xl font-bold">
                        {remainingFeatures.length} Features
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submission View or Form */}
            {workSubmissions.some((s) => {
              const sId =
                typeof s.sprintId === "object" && s.sprintId !== null
                  ? (s.sprintId as any)._id
                  : s.sprintId;
              return sId === selectedSprint;
            }) ? (
              /* ALREADY SUBMITTED VIEW */
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-green-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Submission History
                </h3>
                {workSubmissions
                  .filter((sub) => {
                    const sprintId =
                      typeof sub.sprintId === "object" && sub.sprintId !== null
                        ? (sub.sprintId as any)._id
                        : sub.sprintId;
                    return sprintId === selectedSprint;
                  })
                  .map((submission) => (
                    <Card
                      key={submission._id}
                      className="border-green-200 bg-green-50/10 dark:border-green-900/50"
                    >
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <div className="space-y-1">
                            <CardTitle className="text-base flex items-center gap-2">
                              Submitted on{" "}
                              {new Date(
                                submission.createdAt
                              ).toLocaleDateString()}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              Status:{" "}
                              <span className="font-semibold text-foreground">
                                {submission.status.toUpperCase()}
                              </span>
                            </p>
                          </div>
                          {submission.status === "pending" && (
                            <Badge
                              variant="outline"
                              className="border-yellow-500 text-yellow-600 bg-yellow-50"
                            >
                              Pending Review
                            </Badge>
                          )}
                          {submission.status === "approved" && (
                            <Badge className="bg-green-600">Approved</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                          <a
                            href={submission.githubLink}
                            target="_blank"
                            className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            <span className="text-sm font-medium">
                              Repository Link
                            </span>
                          </a>
                          {submission.liveLink && (
                            <a
                              href={submission.liveLink}
                              target="_blank"
                              className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                              <span className="text-sm font-medium">
                                Live Output
                              </span>
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              /* CREATION FORM */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-primary/20 shadow-md">
                  <CardHeader className="bg-primary/5">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-primary"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                        <path d="M12 12v9" />
                        <path d="m16 16-4-4-4 4" />
                      </svg>
                      Submit Work for {selectedSprintData.title}
                    </CardTitle>
                    <CardDescription>
                      Ensure your code is pushed to GitHub and deployed before
                      submitting.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    {/* Feature Checklist */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-foreground">
                        Features Included
                      </label>
                      <div className="grid grid-cols-1 gap-3">
                        {selectedSprintData.features.map((f, idx) => (
                          <div
                            key={f.id}
                            className={`flex items-center justify-between gap-3 p-3 rounded-lg border transition-all ${
                              f.status === "completed"
                                ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
                                : f.status === "in-progress"
                                ? "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800"
                                : "bg-muted/50 border-border"
                            }`}
                          >
                            <div className="flex items-start gap-3 flex-1">
                              <div
                                className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                                  f.status === "completed"
                                    ? "border-green-600 bg-green-600 text-white"
                                    : f.status === "in-progress"
                                    ? "border-blue-600 bg-blue-600 text-white"
                                    : "border-muted-foreground"
                                }`}
                              >
                                {f.status === "completed" && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-3 h-3"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                )}
                                {f.status === "in-progress" && (
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                              </div>
                              <div className="flex-1">
                                <span
                                  className={`text-sm font-medium block ${
                                    f.status === "completed"
                                      ? "line-through text-muted-foreground"
                                      : ""
                                  }`}
                                >
                                  {f.title}
                                </span>
                                {f.description && (
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {f.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-1.5">
                              <button
                                onClick={async () => {
                                  const updatedSprints = [...sprints];
                                  const sprintIdx = updatedSprints.findIndex(
                                    (s) => s._id === selectedSprint
                                  );
                                  if (sprintIdx !== -1) {
                                    updatedSprints[sprintIdx].features[
                                      idx
                                    ].status = "pending";
                                    setSprints(updatedSprints);
                                    toast.success("Feature marked as pending");
                                  }
                                }}
                                className={`w-7 h-7 rounded-full ring-2 ring-offset-2 transition-all hover:scale-110 ${
                                  f.status === "pending"
                                    ? "bg-yellow-400 ring-yellow-400 shadow-md"
                                    : "bg-muted ring-transparent hover:bg-yellow-200 hover:ring-yellow-300"
                                }`}
                                title="Mark as Pending"
                              />
                              <button
                                onClick={async () => {
                                  const updatedSprints = [...sprints];
                                  const sprintIdx = updatedSprints.findIndex(
                                    (s) => s._id === selectedSprint
                                  );
                                  if (sprintIdx !== -1) {
                                    updatedSprints[sprintIdx].features[
                                      idx
                                    ].status = "in-progress";
                                    setSprints(updatedSprints);
                                    toast.success(
                                      "Feature marked as in progress"
                                    );
                                  }
                                }}
                                className={`w-7 h-7 rounded-full ring-2 ring-offset-2 transition-all hover:scale-110 ${
                                  f.status === "in-progress"
                                    ? "bg-blue-400 ring-blue-400 shadow-md"
                                    : "bg-muted ring-transparent hover:bg-blue-200 hover:ring-blue-300"
                                }`}
                                title="Mark as In Progress"
                              />
                              <button
                                onClick={async () => {
                                  const updatedSprints = [...sprints];
                                  const sprintIdx = updatedSprints.findIndex(
                                    (s) => s._id === selectedSprint
                                  );
                                  if (sprintIdx !== -1) {
                                    updatedSprints[sprintIdx].features[
                                      idx
                                    ].status = "completed";
                                    setSprints(updatedSprints);
                                    toast.success(
                                      "Feature marked as completed! ✓"
                                    );
                                  }
                                }}
                                className={`w-7 h-7 rounded-full ring-2 ring-offset-2 transition-all hover:scale-110 ${
                                  f.status === "completed"
                                    ? "bg-green-400 ring-green-400 shadow-md"
                                    : "bg-muted ring-transparent hover:bg-green-200 hover:ring-green-300"
                                }`}
                                title="Mark as Completed"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      {remainingFeatures.length > 0 && (
                        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg text-xs">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                          Warning: {remainingFeatures.length} features are not
                          marked as completed. You can still submit, but
                          approval may be pending via discussion.
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        GitHub Repository URL{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        <Input
                          className="pl-9"
                          placeholder="https://github.com/username/repo"
                          value={githubLink}
                          onChange={(e) => setGithubLink(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Live Demo URL
                      </label>
                      <div className="relative">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        <Input
                          className="pl-9"
                          placeholder="https://my-project-demo.com"
                          value={liveLink}
                          onChange={(e) => setLiveLink(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Additional Notes
                      </label>
                      <Textarea
                        placeholder="Note any challenges, library decisions, or pending items..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                    <Button
                      className="w-full h-11 text-base shadow-lg hover:shadow-primary/25 transition-all"
                      disabled={submitting}
                      onClick={handleSubmit}
                    >
                      {submitting ? (
                        <>
                          <span className="animate-spin mr-2">⟳</span>
                          Submitting...
                        </>
                      ) : (
                        "Submit Sprint Work"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p>Select a Sprint from the sidebar to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
