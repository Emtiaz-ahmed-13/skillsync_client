"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projectService, type Project } from "@/lib/project-service";
import {
  Calendar,
  Clock,
  DollarSign,
  FileText,
  MessageCircle,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [projectId, setProjectId] = useState<number | null>(null);

  // Unwrap the params promise
  useEffect(() => {
    const unwrapParams = async () => {
      const unwrappedParams = await params;
      setProjectId(parseInt(unwrappedParams.id));
    };

    unwrapParams();
  }, [params]);

  // Load project data when projectId is available
  useEffect(() => {
    if (projectId !== null) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      // Simulate loading project data
      const projectData = await projectService.getProjectById(projectId!);
      setProject(projectData || null);
    } catch (error) {
      console.error("Error loading project:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-skillsync-cyan-dark mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="max-w-2xl mx-auto border border-gray-200 bg-white">
            <CardContent className="py-12 text-center">
              <h1 className="text-2xl font-bold text-primary-heading mb-2">
                Project Not Found
              </h1>
              <p className="text-body mb-6">
                The project you're looking for doesn't exist or has been
                removed.
              </p>
              <Button asChild>
                <Link href="/projects">Back to Projects</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 text-white"
                >
                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                  <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                  <path d="m10 11 5 3-5 3Z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-skillsync-dark-blue to-skillsync-dark-blue/70 bg-clip-text text-transparent">
                SkillSync
              </span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-secondary hover:text-primary-heading transition-colors"
              >
                Home
              </Link>
              <Link
                href="/projects"
                className="text-secondary hover:text-primary-heading transition-colors"
              >
                Projects
              </Link>
              <Link
                href="/dashboard"
                className="text-secondary hover:text-primary-heading transition-colors"
              >
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            ← Back to Projects
          </Link>
          <div>
            <Badge
              variant={
                project.status === "active"
                  ? "default"
                  : project.status === "pending"
                  ? "secondary"
                  : "outline"
              }
            >
              {project.status === "pending"
                ? "Pending Approval"
                : project.status}
            </Badge>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary-heading mb-4">
              {project.title}
            </h1>
            <p className="text-body text-lg">{project.description}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Project Overview */}
              <Card className="border border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-primary-heading">
                    Project Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-skillsync-cyan-dark mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Budget</p>
                      <p className="font-medium text-primary-heading">
                        {project.budget}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-skillsync-cyan-dark mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Estimated Time</p>
                      <p className="font-medium text-primary-heading">
                        {project.estimatedTime} days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-skillsync-cyan-dark mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Created</p>
                      <p className="font-medium text-primary-heading">
                        {project.createdAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-skillsync-cyan-dark mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Client</p>
                      <p className="font-medium text-primary-heading">
                        Client #{project.clientId}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Technologies */}
              <Card className="border border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-primary-heading">
                    Technologies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-base py-2 px-3"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Milestones */}
              {project.milestones.length > 0 && (
                <Card className="border border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-primary-heading">
                      Milestones
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                        >
                          <div>
                            <h3 className="font-medium text-primary-heading">
                              {milestone.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Due: {milestone.dueDate}
                            </p>
                          </div>
                          <Badge
                            variant={
                              milestone.status === "completed"
                                ? "default"
                                : milestone.status === "in-progress"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {milestone.status.replace("-", " ")}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              {/* Actions */}
              <Card className="border border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-primary-heading">
                    Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    View Proposals
                  </Button>
                </CardContent>
              </Card>

              {/* Freelancer */}
              {project.freelancerId > 0 ? (
                <Card className="border border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-primary-heading">
                      Assigned Freelancer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-primary-heading">
                          Freelancer #{project.freelancerId}
                        </p>
                        <p className="text-sm text-gray-600">
                          Frontend Developer
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-primary-heading">
                      Looking for Freelancer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-body mb-4">
                      This project is awaiting freelancer assignment.
                    </p>
                    <Button className="w-full">Browse Freelancers</Button>
                  </CardContent>
                </Card>
              )}

              {/* Progress */}
              <Card className="border border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-primary-heading">
                    Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-body">Completion</span>
                        <span className="font-medium text-primary-heading">
                          {project.milestones.length > 0
                            ? Math.round(
                                (project.milestones.filter(
                                  (m) => m.status === "completed"
                                ).length /
                                  project.milestones.length) *
                                  100
                              )
                            : project.status === "completed"
                            ? 100
                            : project.status === "active"
                            ? 50
                            : 0}
                          %
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-skillsync-cyan-dark rounded-full"
                          style={{
                            width: `${
                              project.milestones.length > 0
                                ? Math.round(
                                    (project.milestones.filter(
                                      (m) => m.status === "completed"
                                    ).length /
                                      project.milestones.length) *
                                      100
                                  )
                                : project.status === "completed"
                                ? 100
                                : project.status === "active"
                                ? 50
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
