"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  MessageSquare,
  User,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function ProjectDetailsPage() {
  const project = {
    id: 1,
    title: "E-Commerce Website Redesign",
    description:
      "Complete redesign of existing e-commerce platform with modern UI/UX, improved performance, and mobile responsiveness.",
    budget: 12500,
    duration: "6 weeks",
    progress: 67,
    status: "active",
    client: {
      name: "Tech Solutions Inc",
      avatar: "TS",
    },
    freelancer: {
      name: "Sarah Johnson",
      avatar: "SJ",
      rate: "$85/hr",
    },
    startDate: "Jan 15, 2025",
    endDate: "Feb 28, 2025",
    milestones: [
      {
        id: 1,
        title: "Initial Design Mockups",
        amount: 2500,
        status: "completed",
        dueDate: "Jan 22, 2025",
      },
      {
        id: 2,
        title: "Frontend Development",
        amount: 5000,
        status: "in-progress",
        dueDate: "Feb 10, 2025",
      },
      {
        id: 3,
        title: "Backend Integration",
        amount: 3000,
        status: "pending",
        dueDate: "Feb 20, 2025",
      },
      {
        id: 4,
        title: "Testing & Deployment",
        amount: 2000,
        status: "pending",
        dueDate: "Feb 28, 2025",
      },
    ],
    requirements: [
      "Responsive design for mobile, tablet, and desktop",
      "Integration with existing payment gateway",
      "Product catalog with search and filtering",
      "User authentication and profile management",
      "Admin dashboard for inventory management",
    ],
  };

  const getMilestoneColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-500 border-green-200 dark:border-green-500/20";
      case "in-progress":
        return "bg-[#64FFDA]/10 text-[#0A8B8B] dark:text-[#64FFDA] border-[#64FFDA]/20";
      case "pending":
        return "bg-gray-100 dark:bg-gray-500/10 text-gray-700 dark:text-gray-500 border-gray-200 dark:border-gray-500/20";
      default:
        return "bg-gray-100 dark:bg-gray-500/10 text-gray-700 dark:text-gray-500 border-gray-200 dark:border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A192F] text-gray-900 dark:text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0A192F]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#64FFDA] rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#0A192F]" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-[#0A192F] to-[#0A192F]/70 dark:from-white dark:to-white/70 bg-clip-text text-transparent">
                  SkillSync
                </span>
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#0A8B8B] dark:hover:text-[#64FFDA] transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/projects"
                  className="text-sm font-medium text-[#0A8B8B] dark:text-[#64FFDA]"
                >
                  Projects
                </Link>
                <Link
                  href="/profile"
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#0A8B8B] dark:hover:text-[#64FFDA] transition-colors"
                >
                  Profile
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10 cursor-pointer"
              >
                <User className="w-4 h-4 mr-2" />
                John Doe
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        {/* Project Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-8">
          <div className="flex-1 mb-4 md:mb-0">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{project.title}</h1>
              <Badge className="bg-[#64FFDA]/10 text-[#0A8B8B] dark:text-[#64FFDA] border-[#64FFDA]/20">
                {project.status.charAt(0).toUpperCase() +
                  project.status.slice(1)}
              </Badge>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {project.description}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Message
            </Button>
            <Button className="bg-[#64FFDA] text-[#0A192F] hover:bg-[#64FFDA]/90 font-semibold cursor-pointer">
              <FileText className="w-4 h-4 mr-2" />
              View Files
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress */}
            <Card className="border-gray-200 dark:border-white/10 bg-white dark:bg-[#112240]">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Project Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Overall Progress
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#64FFDA] rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        2/4
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Milestones
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        $
                        {(project.budget * (project.progress / 100)).toFixed(0)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Paid Out
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        3 weeks
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Remaining
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Milestones */}
            <Card className="border-gray-200 dark:border-white/10 bg-white dark:bg-[#112240]">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.milestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="p-4 border border-gray-200 dark:border-white/10 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {milestone.title}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              <span>${milestone.amount.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{milestone.dueDate}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className={getMilestoneColor(milestone.status)}>
                          {milestone.status === "in-progress"
                            ? "In Progress"
                            : milestone.status.charAt(0).toUpperCase() +
                              milestone.status.slice(1)}
                        </Badge>
                      </div>
                      {milestone.status === "in-progress" && (
                        <div className="mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                          >
                            Submit Deliverable
                          </Button>
                        </div>
                      )}
                      {milestone.status === "completed" && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-green-700 dark:text-green-500">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approved & Paid</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card className="border-gray-200 dark:border-white/10 bg-white dark:bg-[#112240]">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Project Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {project.requirements.map((req, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-gray-900 dark:text-white"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[#0A8B8B] dark:text-[#64FFDA] flex-shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <Card className="border-gray-200 dark:border-white/10 bg-white dark:bg-[#112240]">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Budget
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${project.budget.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Duration
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {project.duration}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Start Date
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {project.startDate}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    End Date
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {project.endDate}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Team */}
            <Card className="border-gray-200 dark:border-white/10 bg-white dark:bg-[#112240]">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#64FFDA] to-[#64FFDA]/60 flex items-center justify-center text-[#0A192F] font-semibold">
                    {project.client.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {project.client.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Client
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#64FFDA] to-[#64FFDA]/60 flex items-center justify-center text-[#0A192F] font-semibold">
                    {project.freelancer.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {project.freelancer.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Freelancer • {project.freelancer.rate}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-gray-200 dark:border-white/10 bg-gradient-to-br from-blue-50 to-cyan-50 dark:bg-[#112240]">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Log Work Hours
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Upload Files
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
