"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  CheckCircle,
  ChevronLeft,
  Clock,
  FileText,
  MessageSquare,
  Pause,
  Play,
  Plus,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function ProjectDashboardPage() {
  // Mock project data
  const project = {
    id: "1",
    title: "E-commerce Website Redesign",
    description:
      "Complete redesign of the company website including UI/UX improvements, mobile responsiveness, and integration with payment systems.",
    status: "active",
    budget: "$12,500",
    deadline: "Dec 15, 2025",
    progress: 67,
    client: {
      name: "Acme Corporation",
      avatar: "AC",
    },
    freelancer: {
      name: "Alex Morgan",
      avatar: "AM",
    },
    startDate: "Oct 1, 2025",
    milestones: [
      {
        id: "1",
        title: "Project Kickoff & Requirements Gathering",
        status: "completed",
        dueDate: "Oct 5, 2025",
        description:
          "Initial meeting with stakeholders to define project scope and requirements.",
      },
      {
        id: "2",
        title: "Wireframes & Design Mockups",
        status: "completed",
        dueDate: "Oct 20, 2025",
        description:
          "Creation of wireframes and high-fidelity design mockups for all pages.",
      },
      {
        id: "3",
        title: "Frontend Development",
        status: "in-progress",
        dueDate: "Nov 15, 2025",
        description:
          "Implementation of the frontend using React and Tailwind CSS.",
      },
      {
        id: "4",
        title: "Backend Integration",
        status: "pending",
        dueDate: "Nov 30, 2025",
        description: "Integration with backend APIs and payment systems.",
      },
      {
        id: "5",
        title: "Testing & QA",
        status: "pending",
        dueDate: "Dec 10, 2025",
        description: "Comprehensive testing and quality assurance.",
      },
      {
        id: "6",
        title: "Deployment & Handover",
        status: "pending",
        dueDate: "Dec 15, 2025",
        description: "Final deployment and project handover to client.",
      },
    ],
    team: [
      {
        id: "1",
        name: "Alex Morgan",
        role: "UI/UX Designer",
        avatar: "AM",
      },
      {
        id: "2",
        name: "Jamie Smith",
        role: "Frontend Developer",
        avatar: "JS",
      },
      {
        id: "3",
        name: "Taylor Kim",
        role: "Backend Developer",
        avatar: "TK",
      },
    ],
    activityFeed: [
      {
        id: "1",
        user: "Alex Morgan",
        action: "uploaded",
        target: "new design mockups",
        time: "2 hours ago",
      },
      {
        id: "2",
        user: "Jamie Smith",
        action: "completed",
        target: "homepage component",
        time: "5 hours ago",
      },
      {
        id: "3",
        user: "Taylor Kim",
        action: "commented on",
        target: "API documentation",
        time: "1 day ago",
      },
    ],
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "in-progress":
        return "bg-skillsync-cyan/10 text-skillsync-cyan-dark border-skillsync-cyan/20";
      case "pending":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (project.status === "not-found") {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project not found</h1>
          <p className="text-body mb-6">
            The project you're looking for doesn't exist or you don't have
            access to it.
          </p>
          <Button asChild>
            <Link href="/projects">Back to Projects</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (project.status === "unauthorized") {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-body mb-6">
            You don't have permission to view this project.
          </p>
          <Button asChild>
            <Link href="/projects">Back to Projects</Link>
          </Button>
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
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        <div className="max-w-7xl mx-auto">
          {/* Project Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary-heading mb-2">
                {project.title}
              </h1>
              <p className="text-body">{project.description}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
              <Button size="sm">
                <Play className="w-4 h-4 mr-2" />
                Resume
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-gray-200 bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-primary-heading">
                  Budget
                </CardTitle>
                <FileText className="w-4 h-4 text-skillsync-cyan-dark" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary-heading">
                  {project.budget}
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-primary-heading">
                  Deadline
                </CardTitle>
                <Calendar className="w-4 h-4 text-skillsync-cyan-dark" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary-heading">
                  {project.deadline}
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-primary-heading">
                  Progress
                </CardTitle>
                <CheckCircle className="w-4 h-4 text-skillsync-cyan-dark" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary-heading">
                  {project.progress}%
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-primary-heading">
                  Team
                </CardTitle>
                <Users className="w-4 h-4 text-skillsync-cyan-dark" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary-heading">
                  {project.team.length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          <Card className="border-gray-200 bg-white mb-8">
            <CardHeader>
              <CardTitle className="text-primary-heading">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-body">Overall Progress</span>
                  <span className="font-medium text-primary-heading">
                    {project.progress}%
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-skillsync-cyan-dark rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Milestones */}
              <Card className="border-gray-200 bg-white">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-primary-heading">
                    Milestones
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Milestone
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {project.milestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-medium text-primary-heading">
                            {milestone.title}
                          </h3>
                          <Badge
                            className={getStatusBadgeClass(milestone.status)}
                          >
                            {milestone.status.replace("-", " ")}
                          </Badge>
                        </div>
                        <p className="text-body mb-4">
                          {milestone.description}
                        </p>
                        <div className="flex items-center text-sm text-body">
                          <Clock className="w-4 h-4 mr-1" />
                          Due: {milestone.dueDate}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Team Members */}
              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-primary-heading">
                    Team Members
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.team.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-primary-heading font-medium">
                            {member.avatar}
                          </div>
                          <div>
                            <div className="font-medium text-primary-heading">
                              {member.name}
                            </div>
                            <div className="text-sm text-body">
                              {member.role}
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Message
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Project Info */}
              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-primary-heading">
                    Project Info
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-primary-heading mb-1">
                        Client
                      </h4>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-primary-heading font-medium text-sm">
                          {project.client.avatar}
                        </div>
                        <span className="text-body">{project.client.name}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-primary-heading mb-1">
                        Freelancer
                      </h4>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-primary-heading font-medium text-sm">
                          {project.freelancer.avatar}
                        </div>
                        <span className="text-body">
                          {project.freelancer.name}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-primary-heading mb-1">
                        Start Date
                      </h4>
                      <p className="text-body">{project.startDate}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-primary-heading mb-1">
                        Deadline
                      </h4>
                      <p className="text-body">{project.deadline}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Activity Feed */}
              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-primary-heading">
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.activityFeed.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <MessageSquare className="w-5 h-5 text-skillsync-cyan-dark mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-body">
                            <span className="font-medium text-primary-heading">
                              {activity.user}
                            </span>{" "}
                            {activity.action}{" "}
                            <span className="font-medium text-primary-heading">
                              {activity.target}
                            </span>
                          </p>
                          <p className="text-xs text-muted mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
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
