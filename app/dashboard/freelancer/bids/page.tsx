import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import MyBidsClient from "@/components/features/dashboard/my-bids-client";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function MyBidsPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any)?.role !== "freelancer") {
    redirect("/auth/login");
  }

  return <MyBidsClient />;
}
