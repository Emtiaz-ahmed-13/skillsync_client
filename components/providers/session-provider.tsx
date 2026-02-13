"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";

interface CustomSession {
  user?: {
    name?: string;
    email?: string;
    image?: string;
    id?: string;
    role?: string;
  };
  expires: string;
  accessToken?: string;
}

function SessionUpdater() {
  const { data: session, status } = useSession() as {
    data: CustomSession | null;
    status: string;
  };

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      sessionStorage.setItem("accessToken", session.accessToken);
    }

    if (status === "unauthenticated") {
      sessionStorage.removeItem("accessToken");
    }
  }, [session?.accessToken, status]);

  return null;
}

export function NextAuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <SessionUpdater />
      {children}
    </SessionProvider>
  );
}
