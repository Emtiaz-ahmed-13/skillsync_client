"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Plus,
  Star,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default function FreelancerDashboard() {
  const stats = [
    {
      title: "Active Projects",
      value: "5",
      description: "+1 from last week",
      icon: FileText,
    },
    {
      title: "Total Earned",
      value: "$8,240",
      description: "+22% from last month",
      icon: DollarSign,
    },
    {
      title: "Avg. Rating",
      value: "4.9",
      description: "From 28 reviews",
      icon: Star,
    },
    {
      title: "Success Rate",
      value: "96%",
      description: "Completed projects",
      icon: TrendingUp,
    },
  ];

  const recentProjects = [
    {
      id: "1",
      title: "E-commerce Website Redesign",
      client: "Acme Corp",
      status: "In Progress",
      earnings: "$2,500",
      deadline: "Dec 15, 2025",
      progress: 65,
    },
    {
      id: "2",
      title: "Mobile App Development",
      client: "StartupXYZ",
      status: "Review",
      earnings: "$4,200",
      deadline: "Jan 5, 2026",
      progress: 90,
    },
    {
      id: "3",
      title: "Brand Identity Package",
      client: "Global Solutions",
      status: "Completed",
      earnings: "$1,200",
      deadline: "Nov 28, 2025",
      progress: 100,
    },
  ];

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
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center p-4">
      <div className="max-w-7xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-heading mb-2">
            Freelancer Dashboard
          </h1>
          <p className="text-body">
            Track your projects, earnings, and performance metrics
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
                <CardTitle className="text-gray-900">Recent Projects</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/projects">
                    View All <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentProjects.map((project) => (
                    <div
                      key={project.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-primary-heading">
                            {project.title}
                          </h3>
                          <p className="text-sm text-body">{project.client}</p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            project.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : project.status === "Review"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-gray-600">Earnings</p>
                          <p className="font-medium text-primary-heading">
                            {project.earnings}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Deadline</p>
                          <p className="font-medium text-primary-heading">
                            {project.deadline}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-body">Progress</span>
                          <span className="font-medium text-primary-heading">
                            {project.progress}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-skillsync-cyan-dark rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/projects/${project.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
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
                    <Button size="sm">Submit</Button>
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
                  <Link href="/projects">
                    <Plus className="w-4 h-4 mr-2" />
                    Browse Projects
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/proposals">
                    <FileText className="w-4 h-4 mr-2" />
                    My Proposals
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
                        Payment Received
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        $1,200 received for Brand Identity Package
                      </p>
                      <span className="text-xs text-gray-500">1 day ago</span>
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
                      <Star className="w-4 h-4 text-skillsync-cyan-dark" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary-heading">
                        New Review
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        5-star review received from Acme Corp
                      </p>
                      <button className="text-xs font-medium text-skillsync-cyan-dark hover:underline">
                        View Review
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
