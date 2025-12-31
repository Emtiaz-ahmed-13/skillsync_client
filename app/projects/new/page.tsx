"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NewProjectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }

    // In a real implementation, this would redirect to the actual project creation form
    // For now, redirecting to the main projects page
    router.push("/projects");
  }, [status, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-foreground">Redirecting to create project...</p>
      </div>
    </div>
  );
}
