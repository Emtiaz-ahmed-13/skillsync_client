"use client";

import { ActivityItem } from "@/components/dashboard/activity-item";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Project } from "@/types/dashboard";
import { DollarSign, FileText, Layers, Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ClientDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      console.log(
        "Client dashboard: User is authenticated, session data:",
        session
      );
      console.log(
        "Client dashboard: Full session structure:",
        JSON.stringify(session, null, 2)
      );

      // Try to get role from different possible locations
      const role =
        (session.user as any).role ||
        (session.user as any).user?.role ||
        (session as any).user?.role;

      console.log("Client dashboard: User role:", role);
      console.log("Client dashboard: Role type:", typeof role);

      // Redirect users with a role that's not client to the main dashboard for proper routing
      if (role && role !== "client") {
        console.log(
          "Client dashboard: User is not a client, redirecting to main dashboard"
        );
        router.push("/dashboard");
      }
      // For users without a role, redirect to login to enforce proper authentication
      else if (!role) {
        console.log("Client dashboard: No role found, redirecting to login");
        router.push("/auth/login");
      }
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A192F] text-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#64FFDA] mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  // Sample data - in a real app this would come from an API
  const statsData = [
    {
      title: "Active Projects",
      value: "3",
      icon: <FileText className="w-6 h-6 text-[#0A8B8B] dark:text-[#64FFDA]" />,
    },
    {
      title: "Total Spent",
      value: "$4,250",
      icon: (
        <DollarSign className="w-6 h-6 text-[#0A8B8B] dark:text-[#64FFDA]" />
      ),
    },
    {
      title: "Ongoing Tasks",
      value: "12",
      icon: <Layers className="w-6 h-6 text-[#0A8B8B] dark:text-[#64FFDA]" />,
    },
    {
      title: "Avg. Rating",
      value: "4.9",
      icon: <Star className="w-6 h-6 text-[#0A8B8B] dark:text-[#64FFDA]" />,
    },
  ];

  const projectsData: Project[] = [
    {
      id: 1,
      title: "Mobile App Redesign",
      budget: "$5,000 - $7,000",
      skills: ["UI/UX", "Figma", "Mobile Design"],
      posted: "2 weeks ago",
      bids: 0,
      status: "In Progress",
    },
    {
      id: 2,
      title: "E-commerce Website",
      budget: "$8,000 - $12,000",
      skills: ["React", "Node.js", "MongoDB"],
      posted: "1 week ago",
      bids: 0,
      status: "Pending",
    },
    {
      id: 3,
      title: "Brand Identity Design",
      budget: "$2,000 - $3,500",
      skills: ["Branding", "Illustration", "Logo Design"],
      posted: "3 days ago",
      bids: 0,
      status: "Completed",
    },
  ];

  const activitiesData: Activity[] = [
    {
      id: 1,
      client: "You",
      action: "posted a project",
      project: "Mobile App Redesign",
      time: "2 weeks ago",
    },
    {
      id: 2,
      client: "You",
      action: "approved milestone payment",
      project: "E-commerce Website",
      time: "1 week ago",
    },
    {
      id: 3,
      client: "You",
      action: "posted a project",
      project: "Brand Identity Design",
      time: "3 days ago",
    },
  ];

  return (
    <DashboardLayout
      title="Client Dashboard"
      subtitle={`Welcome back, ${session?.user?.name || "Client"}`}
      user={{
        name: session?.user?.name,
        image: session?.user?.image,
      }}
      actionButton={{
        label: "Post a New Project",
        onClick: () => console.log("Post a new project"),
      }}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Projects & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-white dark:bg-[#112240] border-gray-200 dark:border-white/10">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-gray-900 dark:text-white">
                  Your Projects
                </CardTitle>
                <button className="text-xs font-medium text-[#0A8B8B] dark:text-[#64FFDA] hover:underline">
                  View All
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectsData.map((project) => (
                  <div
                    key={project.id}
                    className="p-4 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {project.title}
                      </h3>
                      <span className="text-sm font-medium text-[#64FFDA]">
                        {project.budget}
                      </span>
                    </div>
                    {project.skills && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-500"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-500">
                        {project.status}
                      </span>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Posted {project.posted}
                        </span>
                        <button className="text-xs font-medium text-[#0A8B8B] dark:text-[#64FFDA] hover:underline">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Milestones */}
        <div>
          <Card className="bg-white dark:bg-[#112240] border-gray-200 dark:border-white/10">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activitiesData.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Milestones */}
          <Card className="bg-white dark:bg-[#112240] border-gray-200 dark:border-white/10 mt-8">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                Upcoming Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border border-gray-200 dark:border-white/10 rounded-lg">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      UI Design Completion
                    </h4>
                    <span className="text-sm font-medium text-[#64FFDA]">
                      $1,500
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Mobile App Redesign
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Due in 3 days
                    </span>
                    <button className="text-xs font-medium text-[#0A8B8B] dark:text-[#64FFDA] hover:underline">
                      Review
                    </button>
                  </div>
                </div>
                <div className="p-3 border border-gray-200 dark:border-white/10 rounded-lg">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Homepage Development
                    </h4>
                    <span className="text-sm font-medium text-[#64FFDA]">
                      $2,000
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    E-commerce Website
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Due in 1 week
                    </span>
                    <button className="text-xs font-medium text-[#0A8B8B] dark:text-[#64FFDA] hover:underline">
                      Review
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
