import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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

export default async function FreelancerSprintPlanningPage({
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

  // This page will be implemented to show a list of projects the freelancer can plan sprints for
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Sprint Planning</h1>
        <p className="text-muted-foreground mb-6">
          {projectId
            ? `Plan sprints manually for project ID: ${projectId}`
            : "Select a project to plan your sprints manually."}
        </p>
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <p className="text-lg mb-4">Sprint Planning Coming Soon</p>
          <p className="text-muted-foreground mb-4">
            This feature is currently being developed.
          </p>
          <p className="text-muted-foreground">
            Please use the Enhanced Project Details page to plan sprints for
            now.
          </p>
        </div>
      </div>
    </div>
  );
}
