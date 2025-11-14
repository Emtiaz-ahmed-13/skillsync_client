"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      console.log("User is unauthenticated, redirecting to login");
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      console.log("User is authenticated, session data:", session);
      console.log("Full session structure:", JSON.stringify(session, null, 2));

      // Log individual properties to help debug
      console.log("Session user:", session.user);
      console.log("Session user role:", (session.user as any).role);
      console.log("Session user user role:", (session.user as any).user?.role);
      console.log(
        "Session user role (alternative):",
        (session as any).user?.role
      );

      // Try to get role from different possible locations
      const role =
        (session.user as any).role ||
        (session.user as any).user?.role ||
        (session as any).user?.role;

      console.log("User role:", role);
      console.log("Role type:", typeof role);
      console.log("Role value:", JSON.stringify(role));

      if (role) {
        switch (role) {
          case "client":
            console.log("Redirecting to client dashboard");
            router.push("/dashboard/client");
            break;
          case "freelancer":
            console.log("Redirecting to freelancer dashboard");
            router.push("/dashboard/freelancer");
            break;
          case "admin":
            console.log("Redirecting to admin dashboard");
            router.push("/dashboard/admin");
            break;
          default:
            console.log("Unknown role, redirecting to login");
            router.push("/auth/login");
        }
      } else {
        // No role found - redirect to login as per project requirements
        console.log("No role found, redirecting to login page");
        router.push("/auth/login");
      }
    } else {
      console.log("User not authenticated or no session:", { status, session });
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A192F] text-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#64FFDA] mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return null;
}
