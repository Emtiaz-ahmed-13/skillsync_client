"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";

function SessionUpdater() {
  const { data: session } = useSession();

  useEffect(() => {
    // Save accessToken to localStorage when session changes
    if (session?.accessToken) {
      localStorage.setItem("accessToken", session.accessToken);
    } else if (session === null) {
      // Clear accessToken when user logs out
      localStorage.removeItem("accessToken");
    }
  }, [session]);

  return null;
}

export function NextAuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <SessionUpdater />
      {children}
    </SessionProvider>
  );
}
