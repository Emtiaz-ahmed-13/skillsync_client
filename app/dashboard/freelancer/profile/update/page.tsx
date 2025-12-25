import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import FreelancerProfileUpdateClient from "@/components/auth/freelancer-profile-update";
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

export default async function FreelancerProfileUpdatePage() {
  const session = (await getServerSession(authOptions)) as Session | null;

  if (!session || !session.user || session.user.role !== "freelancer") {
    redirect("/auth/login");
  }

  return <FreelancerProfileUpdateClient user={session.user} />;
}
