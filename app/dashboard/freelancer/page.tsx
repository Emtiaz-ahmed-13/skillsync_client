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

export default function FreelancerDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Try to get role from different possible locations
      const role =
        (session.user as any).role ||
        (session.user as any).user?.role ||
        (session as any).user?.role;

      // If user is not a freelancer, redirect to main dashboard for proper role routing
      if (role && role !== "freelancer") {
        router.push("/dashboard");
      }
      // For users without a role, redirect to login to enforce proper authentication
      else if (!role) {
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
      title: "Active Bids",
      value: "7",
      icon: <FileText className="w-6 h-6 text-[#0A8B8B] dark:text-[#64FFDA]" />,
    },
    {
      title: "Total Earned",
      value: "$8,250",
      icon: (
        <DollarSign className="w-6 h-6 text-[#0A8B8B] dark:text-[#64FFDA]" />
      ),
    },
    {
      title: "Completed Projects",
      value: "24",
      icon: <Layers className="w-6 h-6 text-[#0A8B8B] dark:text-[#64FFDA]" />,
    },
    {
      title: "Rating",
      value: "4.8",
      icon: <Star className="w-6 h-6 text-[#0A8B8B] dark:text-[#64FFDA]" />,
    },
  ];

  const projectsData: Project[] = [
    {
      id: 1,
      title: "Logo Design for Tech Startup",
      budget: "$500 - $1,000",
      skills: ["Logo Design", "Branding", "Illustration"],
      posted: "2 hours ago",
      bids: 12,
      status: "Open",
    },
    {
      id: 2,
      title: "WordPress Website Development",
      budget: "$1,500 - $2,500",
      skills: ["WordPress", "PHP", "CSS"],
      posted: "5 hours ago",
      bids: 8,
      status: "Open",
    },
    {
      id: 3,
      title: "Mobile App UI/UX Design",
      budget: "$3,000 - $5,000",
      skills: ["UI/UX", "Figma", "Mobile Design"],
      posted: "1 day ago",
      bids: 15,
      status: "Open",
    },
  ];

  const activitiesData: Activity[] = [
    {
      id: 1,
      client: "TechCorp Inc.",
      action: "accepted your bid",
      project: "Logo Design",
      time: "30 minutes ago",
    },
    {
      id: 2,
      client: "Digital Solutions",
      action: "sent a message",
      project: "Website Redesign",
      time: "2 hours ago",
    },
    {
      id: 3,
      client: "StartupXYZ",
      action: "released payment",
      project: "Mobile App",
      time: "1 day ago",
    },
  ];

  return (
    <DashboardLayout
      title="Freelancer Dashboard"
      subtitle={`Welcome back, ${session?.user?.name || "Freelancer"}`}
      user={{
        name: session?.user?.name,
        image: session?.user?.image,
      }}
      actionButton={{
        label: "Browse Projects",
        onClick: () => console.log("Browse projects"),
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

      {/* Available Projects & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-white dark:bg-[#112240] border-gray-200 dark:border-white/10">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-gray-900 dark:text-white">
                  Available Projects
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
                          {project.bids} bids
                        </span>
                        <button className="text-xs font-medium text-[#0A8B8B] dark:text-[#64FFDA] hover:underline">
                          Place Bid
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Time Tracking */}
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

          {/* Active Tasks */}
          <Card className="bg-white dark:bg-[#112240] border-gray-200 dark:border-white/10 mt-8">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                Active Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border border-gray-200 dark:border-white/10 rounded-lg">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Homepage Wireframes
                    </h4>
                    <span className="text-xs text-[#64FFDA]">In Progress</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Mobile App UI/UX Design
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      2h 30m logged
                    </span>
                    <button className="text-xs font-medium text-[#0A8B8B] dark:text-[#64FFDA] hover:underline">
                      Log Time
                    </button>
                  </div>
                </div>
                <div className="p-3 border border-gray-200 dark:border-white/10 rounded-lg">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Logo Revisions
                    </h4>
                    <span className="text-xs text-green-500">Completed</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Tech Startup Logo
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Ready for review
                    </span>
                    <button className="text-xs font-medium text-[#0A8B8B] dark:text-[#64FFDA] hover:underline">
                      Submit
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
