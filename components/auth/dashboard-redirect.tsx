"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log("DashboardRedirect - Status:", status, "Session:", session);

    if (status === "authenticated") {
      if (session?.user?.role) {
        // Role is available, redirect immediately
        console.log("Role found in session:", session.user.role);
        switch (session.user.role) {
          case "admin":
            router.replace("/dashboard/admin");
            break;
          case "freelancer":
            router.replace("/dashboard/freelancer");
            break;
          case "client":
            router.replace("/dashboard/client");
            break;
          default:
            router.replace("/dashboard/client");
        }
      } else {
        // Role is not available in session, try to refetch after a brief delay
        console.log("Role not found in session, attempting to refetch...");
        console.log("Session object keys:", Object.keys(session?.user || {}));
        console.log("Full session object:", session);

        // Try to get the session again after a delay
        const timer = setTimeout(async () => {
          try {
            // Import and call getSession to get the latest session
            const nextAuth = await import("next-auth/react");
            const updatedSession = await nextAuth.getSession();

            console.log("Updated session from getSession():", updatedSession);
            console.log(
              "Updated session user keys:",
              Object.keys(updatedSession?.user || {})
            );

            if (updatedSession?.user?.role) {
              console.log(
                "Role found in updated session:",
                updatedSession.user.role
              );
              switch (updatedSession.user.role) {
                case "admin":
                  router.replace("/dashboard/admin");
                  break;
                case "freelancer":
                  router.replace("/dashboard/freelancer");
                  break;
                case "client":
                  router.replace("/dashboard/client");
                  break;
                default:
                  router.replace("/dashboard/client");
              }
            } else {
              console.log(
                "No role found in updated session, redirecting to default client dashboard"
              );
              // If still no role, default to client dashboard
              router.replace("/dashboard/client");
            }
          } catch (error) {
            console.error("Error fetching session:", error);
            // On error, default to client dashboard
            router.replace("/dashboard/client");
          }
        }, 1500); // Increased delay to ensure session is fully loaded

        return () => clearTimeout(timer);
      }
    }

    if (status === "unauthenticated") {
      console.log("User not authenticated, redirecting to login");
      router.replace("/auth/login");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting...</p>
    </div>
  );
}
