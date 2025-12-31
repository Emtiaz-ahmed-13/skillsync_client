import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import FreelancerProjectsClient from "@/components/features/projects/freelancer-projects";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function FreelancerProjectsPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any)?.role !== "freelancer") {
    redirect("/auth/login");
  }

  return <FreelancerProjectsClient user={session.user as any} />;
}
