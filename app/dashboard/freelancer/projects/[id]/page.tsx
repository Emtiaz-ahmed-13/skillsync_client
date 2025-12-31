import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import EnhancedProjectDetailsClient from "@/components/features/projects/enhanced-project-details";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

interface User {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  role?: string;
  accessToken?: string;
}

interface Session {
  user?: User;
}

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>; // params is a Promise in App Router
}) {
  const { id } = await params;
  const session = (await getServerSession(authOptions)) as Session | null;

  if (!session || session.user?.role !== "freelancer") {
    redirect("/auth/login");
  }

  return (
    <EnhancedProjectDetailsClient user={session.user || {}} projectId={id} />
  );
}
