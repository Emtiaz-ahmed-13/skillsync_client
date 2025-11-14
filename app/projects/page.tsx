"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Clock,
  DollarSign,
  Filter,
  Plus,
  Search,
  User,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ProjectsPage() {
  const [userRole] = useState<"freelancer" | "client">("client");
  const [filter, setFilter] = useState<
    "all" | "active" | "completed" | "review"
  >("all");

  const projects = [
    {
      id: 1,
      title: "E-Commerce Website Redesign",
      description: "Full-stack development with modern UI/UX",
      budget: 12500,
      duration: "6 weeks",
      progress: 67,
      status: "active",
      client: "Tech Solutions Inc",
      freelancer: "Sarah Johnson",
    },
    {
      id: 2,
      title: "Mobile App Development",
      description: "React Native iOS & Android app",
      budget: 18000,
      duration: "8 weeks",
      progress: 35,
      status: "active",
      client: "Startup Ventures",
      freelancer: "Mike Chen",
    },
    {
      id: 3,
      title: "Brand Identity Design",
      description: "Logo, colors, and brand guidelines",
      budget: 5500,
      duration: "3 weeks",
      progress: 90,
      status: "review",
      client: "Creative Agency",
      freelancer: "Emma Davis",
    },
    {
      id: 4,
      title: "API Integration Project",
      description: "Third-party API integration and documentation",
      budget: 8000,
      duration: "4 weeks",
      progress: 100,
      status: "completed",
      client: "Enterprise Corp",
      freelancer: "John Doe",
    },
  ];

  const filteredProjects = projects.filter((project) => {
    if (filter === "all") return true;
    return project.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-[#64FFDA]/10 text-[#0A8B8B] dark:text-[#64FFDA] border-[#64FFDA]/20";
      case "review":
        return "bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-500 border-yellow-200 dark:border-yellow-500/20";
      case "completed":
        return "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-500 border-green-200 dark:border-green-500/20";
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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Projects</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {userRole === "client"
                ? "Manage your posted projects"
                : "Browse and manage your active projects"}
            </p>
          </div>
          {userRole === "client" && (
            <Button className="mt-4 md:mt-0 bg-[#64FFDA] text-[#0A192F] hover:bg-[#64FFDA]/90 font-semibold cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              Post New Project
            </Button>
          )}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="Search projects..."
              className="pl-10 bg-gray-50 dark:bg-[#0A192F] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className={
                filter === "all"
                  ? "bg-[#64FFDA] text-[#0A192F] hover:bg-[#64FFDA]/90 cursor-pointer"
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
              }
            >
              All
            </Button>
            <Button
              variant={filter === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("active")}
              className={
                filter === "active"
                  ? "bg-[#64FFDA] text-[#0A192F] hover:bg-[#64FFDA]/90 cursor-pointer"
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
              }
            >
              Active
            </Button>
            <Button
              variant={filter === "review" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("review")}
              className={
                filter === "review"
                  ? "bg-[#64FFDA] text-[#0A192F] hover:bg-[#64FFDA]/90 cursor-pointer"
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
              }
            >
              Review
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("completed")}
              className={
                filter === "completed"
                  ? "bg-[#64FFDA] text-[#0A192F] hover:bg-[#64FFDA]/90 cursor-pointer"
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
              }
            >
              Completed
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="border-gray-200 dark:border-white/10 bg-white dark:bg-[#112240] hover:border-[#64FFDA]/50 transition-all cursor-pointer"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {project.description}
                    </p>
                  </div>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status.charAt(0).toUpperCase() +
                      project.status.slice(1)}
                  </Badge>
                </div>

                {project.status !== "completed" && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        Progress
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#64FFDA] rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <DollarSign className="w-4 h-4" />
                      <span>${project.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{project.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-white/10">
                  <div className="text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {userRole === "client" ? "Freelancer: " : "Client: "}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {userRole === "client"
                        ? project.freelancer
                        : project.client}
                    </span>
                  </div>
                  <Link href={`/projects/${project.id}`}>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-[#0A8B8B] dark:text-[#64FFDA] hover:text-[#0A8B8B]/80 dark:hover:text-[#64FFDA]/80 cursor-pointer"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No projects found matching your criteria
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
