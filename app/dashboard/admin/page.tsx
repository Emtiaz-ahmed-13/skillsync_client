"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, FileText, Star, Users, Zap } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface UserRole {
  id: number;
  name: string;
  email: string;
  role: string;
  joined: string;
}

interface Report {
  id: number;
  title: string;
  status: string;
  time: string;
}

export default function AdminDashboardPage() {
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

      // If user is not an admin, redirect to main dashboard for proper role routing
      if (role && role !== "admin") {
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
      title: "Total Users",
      value: "1,248",
      icon: <Users className="w-6 h-6 text-[#0A8B8B] dark:text-[#64FFDA]" />,
    },
    {
      title: "Active Projects",
      value: "342",
      icon: <FileText className="w-6 h-6 text-[#0A8B8B] dark:text-[#64FFDA]" />,
    },
    {
      title: "Platform Revenue",
      value: "$42,850",
      icon: (
        <DollarSign className="w-6 h-6 text-[#0A8B8B] dark:text-[#64FFDA]" />
      ),
    },
    {
      title: "Pending Reviews",
      value: "16",
      icon: <Star className="w-6 h-6 text-[#0A8B8B] dark:text-[#64FFDA]" />,
    },
  ];

  const usersData: UserRole[] = [
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex@example.com",
      role: "Client",
      joined: "2 hours ago",
    },
    {
      id: 2,
      name: "Sarah Miller",
      email: "sarah@example.com",
      role: "Freelancer",
      joined: "5 hours ago",
    },
    {
      id: 3,
      name: "Mike Chen",
      email: "mike@example.com",
      role: "Freelancer",
      joined: "1 day ago",
    },
    {
      id: 4,
      name: "Emma Wilson",
      email: "emma@example.com",
      role: "Client",
      joined: "2 days ago",
    },
  ];

  const reportsData: Report[] = [
    {
      id: 1,
      title: "Weekly User Growth",
      status: "Completed",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "Revenue Analysis",
      status: "In Progress",
      time: "1 day ago",
    },
    {
      id: 3,
      title: "Platform Performance",
      status: "Pending",
      time: "2 days ago",
    },
  ];

  return (
    <DashboardLayout
      title="Admin Dashboard"
      subtitle={`Welcome back, ${session?.user?.name || "Admin"}`}
      user={{
        name: session?.user?.name,
        image: session?.user?.image,
      }}
      actionButton={{
        label: "Generate Report",
        onClick: () => console.log("Generate report"),
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

      {/* User Management & Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-white dark:bg-[#112240] border-gray-200 dark:border-white/10">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-gray-900 dark:text-white">
                  User Management
                </CardTitle>
                <button className="text-xs font-medium text-[#0A8B8B] dark:text-[#64FFDA] hover:underline">
                  View All
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usersData.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#64FFDA]/10 flex items-center justify-center">
                        <span className="text-[#0A8B8B] dark:text-[#64FFDA] font-bold">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-500">
                        {user.role}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {user.joined}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Reports & Disputes */}
        <div>
          <Card className="bg-white dark:bg-[#112240] border-gray-200 dark:border-white/10">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                System Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportsData.map((report) => (
                  <div key={report.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#64FFDA]/10 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-[#0A8B8B] dark:text-[#64FFDA]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {report.title}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-500">
                          {report.status}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {report.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Disputes */}
          <Card className="bg-white dark:bg-[#112240] border-gray-200 dark:border-white/10 mt-8">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                Pending Disputes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border border-gray-200 dark:border-white/10 rounded-lg">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Payment Dispute
                    </h4>
                    <span className="text-xs text-red-500">High</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Mobile App Development
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      2 hours ago
                    </span>
                    <button className="text-xs font-medium text-[#0A8B8B] dark:text-[#64FFDA] hover:underline">
                      Review
                    </button>
                  </div>
                </div>
                <div className="p-3 border border-gray-200 dark:border-white/10 rounded-lg">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Project Requirements
                    </h4>
                    <span className="text-xs text-yellow-500">Medium</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    E-commerce Website
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      1 day ago
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
