import { redirect } from "next/navigation";

export default async function FreelancerAISprintDistributionPage({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string }>;
}) {
  const params = await searchParams;
  if (params.projectId) {
    redirect(`/dashboard/freelancer/projects/${params.projectId}`);
  }
  redirect("/dashboard/freelancer/projects");
}
