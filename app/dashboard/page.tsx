"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// This is a redirect page that will send users to their respective dashboards
// In a real app, you would determine the user's role from context/session
export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // For demo purposes, we'll redirect to the client dashboard
    // In a real app, you would check the user's role and redirect accordingly
    router.push("/dashboard/client");
  }, [router]);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-skillsync-cyan-dark mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
