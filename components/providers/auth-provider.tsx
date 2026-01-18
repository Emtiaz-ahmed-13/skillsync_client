"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./theme-provider";

/**
 * Unified Authentication Provider
 * 
 * Combines NextAuth session management with theme provider
 * This is the ONLY provider you need for authentication
 * 
 * Features:
 * - Role-based authentication (client, freelancer, admin)
 * - Session management
 * - Token handling
 * - Theme integration
 * 
 * Usage:
 * Wrap your app in layout.tsx:
 * <AuthProvider>{children}</AuthProvider>
 * 
 * Access session anywhere:
 * const { data: session } = useSession();
 * const userRole = session?.user?.role;
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider
            refetchInterval={0}
            refetchOnWindowFocus={false}
        >
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </SessionProvider>
    );
}
