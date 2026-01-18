import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const role = session.user.role;

  switch (role) {
    case "admin":
      redirect("/dashboard/admin");
    case "freelancer":
      redirect("/dashboard/freelancer");
    case "client":
      redirect("/dashboard/client");
    default:
      redirect("/auth/login");
  }
}
