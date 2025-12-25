"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";

function SessionUpdater() {
  const { data: session, status } = useSession();

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
