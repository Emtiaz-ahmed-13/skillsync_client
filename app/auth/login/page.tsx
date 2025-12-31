import LoginClient from "@/components/features/auth/login-client";
import { Navbar } from "@/components/shared/navbar";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background provided by generic layout */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/0 to-background/0 pointer-events-none" />

      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-screen items-center justify-center pt-16 md:pt-20 pb-12">
          <div className="w-full max-w-md relative">
            {/* Glow effect behind the card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-2xl opacity-20 pointer-events-none" />
            
            <div className="relative rounded-2xl border border-border/50 bg-background/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="mb-8 text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                  Welcome back
                </h1>
                <p className="text-sm text-muted-foreground">
                  Sign in to access your workspace
                </p>
              </div>

              <Suspense
                fallback={
                  <div className="flex items-center justify-center py-12 text-sm text-muted-foreground animate-pulse">
                    Loading login form...
                  </div>
                }
              >
                <LoginClient />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
