import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ActiveProjectsClient from "@/components/features/dashboard/active-projects-client";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function ActiveProjectsPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any)?.role !== "freelancer") {
    redirect("/auth/login");
  }

  return <ActiveProjectsClient />;
}
