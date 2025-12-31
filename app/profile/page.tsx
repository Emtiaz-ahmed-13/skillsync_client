"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface SessionUser {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  role?: string;
  accessToken?: string;
}

interface Session {
  user?: SessionUser;
  expires: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession() as {
    data: Session | null;
    status: string;
  };
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Redirect based on user role to appropriate profile page
      const userRole = session.user.role;

      switch (userRole) {
        case "client":
          router.push("/dashboard/client");
          break;
        case "freelancer":
          router.push("/dashboard/freelancer/profile");
          break;
        case "admin":
          router.push("/dashboard/admin");
          break;
        default:
          // Default to client dashboard if no role
          router.push("/dashboard/client");
      }
    } else if (status === "unauthenticated") {
      // If not authenticated, redirect to login
      router.push("/auth/login");
    }
  }, [status, session, router]);

  // Show a loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-foreground">Redirecting to your profile...</p>
      </div>
    </div>
  );
}
