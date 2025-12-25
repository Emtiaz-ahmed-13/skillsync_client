import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import FreelancerDashboardClient from "@/components/auth/freelancer-dashboard";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function FreelancerProjectsPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any)?.role !== "freelancer") {
    redirect("/auth/login");
  }

  return <FreelancerDashboardClient />;
}
