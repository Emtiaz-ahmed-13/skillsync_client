import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import FreelancerProfileClient from "@/components/features/users/freelancer-profile";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function FreelancerProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "freelancer") {
    redirect("/auth/login");
  }

  return <FreelancerProfileClient user={session.user} />;
}
