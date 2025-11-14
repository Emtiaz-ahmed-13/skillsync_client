"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { LoginCredentials } from "@/types/auth";
import { handleApiError } from "@/utils/helpers/api";
import { createErrorResponse } from "@/utils/helpers/error-handler";
import { validateEmail } from "@/utils/helpers/validation";
import { ArrowRight, Github, Lock, Mail, Zap } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!formData.email || !formData.password) {
        throw new Error("Email and password are required");
      }

      if (!validateEmail(formData.email)) {
        throw new Error("Please enter a valid email address");
      }

      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error || "Invalid email or password");
      } else {
        // Add a small delay to ensure session is updated before redirecting
        setTimeout(() => {
          router.push("/dashboard");
        }, 300);
      }
    } catch (error: any) {
      const standardizedError = createErrorResponse(error);
      setError(handleApiError(standardizedError));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-[#0A192F] dark:via-[#0B1F3A] dark:to-[#0A192F] text-gray-900 dark:text-white p-6 overflow-hidden">
      <div className="absolute inset-0 opacity-10 dark:opacity-5" />

      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 group z-10"
      >
        <div className="w-9 h-9 bg-[#64FFDA] rounded-xl flex items-center justify-center shadow-md shadow-[#64FFDA]/20 group-hover:scale-105 transition-transform">
          <Zap className="w-5 h-5 text-[#0A192F]" />
        </div>
        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-[#0A8B8B] dark:group-hover:text-[#64FFDA] transition-colors">
          SkillSync
        </span>
      </Link>

      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      <Card className="relative z-10 w-full max-w-md border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#112240]/90 backdrop-blur-xl shadow-2xl rounded-2xl">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 bg-[#64FFDA]/10 rounded-xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-[#0A8B8B] dark:text-[#64FFDA]" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Sign in to your account to continue your journey.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <Form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <FormField
              id="email"
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              icon={<Mail className="w-4 h-4" />}
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            <FormField
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              value={formData.password}
              onChange={handleInputChange}
              required
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-[#0A192F] text-[#64FFDA] focus:ring-[#64FFDA]"
                />
                <span className="text-gray-600 dark:text-gray-400">
                  Remember me
                </span>
              </label>
              <Link
                href="#"
                className="text-[#0A8B8B] dark:text-[#64FFDA] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#64FFDA] text-[#0A192F] hover:bg-[#64FFDA]/90 font-semibold shadow-lg shadow-[#64FFDA]/20 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0A192F] mr-2"></div>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </Form>

          <div className="relative py-2 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative inline-block bg-white dark:bg-[#112240] px-3 text-xs uppercase text-gray-500 dark:text-gray-400">
              or continue with
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              type="button"
              className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              <FcGoogle className="w-5 h-5 mr-2" />
              Continue with Google
            </Button>

            <Button
              variant="outline"
              type="button"
              className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            >
              <Github className="w-5 h-5 mr-2" />
              Continue with GitHub
            </Button>
          </div>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              href="/auth/register"
              className="text-[#0A8B8B] dark:text-[#64FFDA] hover:underline"
            >
              Create one
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
