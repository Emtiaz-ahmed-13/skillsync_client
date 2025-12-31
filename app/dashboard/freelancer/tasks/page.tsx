import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import FreelancerTasksClient from "@/components/features/tasks/freelancer-tasks";
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

export default async function FreelancerTasksPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = (await getServerSession(authOptions)) as Session | null;

  if (!session || session.user?.role !== "freelancer") {
    redirect("/auth/login");
  }

  const projectId =
    typeof searchParams.projectId === "string"
      ? searchParams.projectId
      : undefined;

  return (
    <FreelancerTasksClient user={session.user || {}} projectId={projectId} />
  );
}
