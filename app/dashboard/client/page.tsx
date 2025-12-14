"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projectService, type Project } from "@/lib/project-service";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Layers,
  Plus,
  Star,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ClientDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Load projects on component mount
  useEffect(() => {
    console.log(
      "[Client Dashboard] Client dashboard mounting, loading initial projects"
    );
    loadProjects();

    // Set up polling to refresh projects every 10 seconds
    const interval = setInterval(() => {
      console.log(
        "[Client Dashboard] Polling for projects in client dashboard"
      );
      loadProjects();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      // In a real app, we would filter by the current client's ID
      // For now, we'll show all projects as a demo
      const fetchedProjects = await projectService.getAllProjects();
      console.log("[Client Dashboard] Projects loaded:", fetchedProjects);
      setProjects(fetchedProjects);
    } catch (error) {
      console.error("[Client Dashboard] Error loading projects:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats based on projects
  const stats = [
    {
      title: "Active Projects",
      value: projects.filter((p) => p.status === "active").length.toString(),
      description: "+2 from last week",
      icon: FileText,
    },
    {
      title: "Total Spent",
      value: "$12,480",
      description: "+15% from last month",
      icon: DollarSign,
    },
    {
      title: "Ongoing Tasks",
      value: "24",
      description: "Across all projects",
      icon: Layers,
    },
    {
      title: "Avg. Rating",
      value: "4.8",
      description: "From 32 reviews",
      icon: Star,
    },
  ];

  const recentProjects = projects.slice(0, 3); // Show first 3 projects

  const upcomingDeadlines = [
    {
      id: "1",
      title: "E-commerce Website Redesign",
      deadline: "Dec 15, 2025",
      timeLeft: "3 days",
    },
    {
      id: "2",
      title: "Mobile App Development",
      deadline: "Jan 5, 2026",
      timeLeft: "23 days",
    },
    {
      id: "4",
      title: "Marketing Campaign",
      deadline: "Dec 22, 2025",
      timeLeft: "10 days",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4">
      <div className="max-w-7xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-heading mb-2">
            Client Dashboard
          </h1>
          <p className="text-body">
            Manage your projects and collaborate with freelancers
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-primary-heading">
                    {stat.title}
                  </CardTitle>
                  <Icon className="w-6 h-6 text-skillsync-cyan-dark" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary-heading">
                    {stat.value}
                  </div>
                  <p className="text-sm text-body">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-gray-900">My Projects</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/projects">
                    View All <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-skillsync-cyan-dark"></div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {recentProjects.map((project) => (
                      <div
                        key={project.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-medium text-primary-heading">
                            {project.title}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              project.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : project.status === "review"
                                ? "bg-yellow-100 text-yellow-800"
                                : project.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {project.status === "pending"
                              ? "Pending Approval"
                              : project.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div>
                            <p className="text-gray-600">Budget</p>
                            <p className="font-medium text-primary-heading">
                              {project.budget}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Deadline</p>
                            <p className="font-medium text-primary-heading">
                              {project.createdAt}
                            </p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-body">Progress</span>
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

                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-2">
                            {project.technologies
                              .slice(0, 3)
                              .map((tech, idx) => (
                                <div
                                  key={idx}
                                  className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-primary-heading"
                                  title={tech}
                                >
                                  {tech.charAt(0)}
                                </div>
                              ))}
                            {project.technologies.length > 3 && (
                              <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium text-primary-heading">
                                +{project.technologies.length - 3}
                              </div>
                            )}
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/projects/${project.id}`}>View</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">
                  Upcoming Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-primary-heading">
                        Design Review
                      </h4>
                      <p className="text-gray-600 mb-4">
                        E-commerce Website Redesign
                      </p>
                      <div className="flex items-center text-sm text-body">
                        <Calendar className="w-4 h-4 mr-1" />
                        Dec 12, 2025
                      </div>
                    </div>
                    <Button size="sm">Review</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-primary-heading">
                        Final Delivery
                      </h4>
                      <p className="text-gray-600 mb-4">
                        Mobile App Development
                      </p>
                      <div className="flex items-center text-sm text-body">
                        <Calendar className="w-4 h-4 mr-1" />
                        Jan 5, 2026
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Prepare
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" asChild>
                  <Link href="/projects/new">
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/freelancers">
                    <User className="w-4 h-4 mr-2" />
                    Browse Freelancers
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingDeadlines.map((deadline) => (
                    <div
                      key={deadline.id}
                      className="p-3 border border-gray-200 rounded-lg"
                    >
                      <h4 className="text-sm font-medium text-primary-heading">
                        {deadline.title}
                      </h4>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-500">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {deadline.deadline}
                        </p>
                        <span className="text-xs text-gray-500">
                          {deadline.timeLeft}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 mt-8">
              <CardHeader>
                <CardTitle className="text-gray-900">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="mt-0.5 mr-3 p-2 border border-gray-200 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-skillsync-cyan-dark" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary-heading">
                        Payment Released
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        $2,000 released for Brand Identity Package
                      </p>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mt-0.5 mr-3 p-2 border border-gray-200 rounded-lg">
                      <Clock className="w-4 h-4 text-skillsync-cyan-dark" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary-heading">
                        Deadline Approaching
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        E-commerce Website Redesign due in 3 days
                      </p>
                      <button className="text-xs font-medium text-skillsync-cyan-dark hover:underline">
                        View Project
                      </button>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mt-0.5 mr-3 p-2 border border-gray-200 rounded-lg">
                      <User className="w-4 h-4 text-skillsync-cyan-dark" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary-heading">
                        New Proposal
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Taylor Kim submitted a proposal for Marketing Campaign
                      </p>
                      <button className="text-xs font-medium text-skillsync-cyan-dark hover:underline">
                        Review Proposal
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
