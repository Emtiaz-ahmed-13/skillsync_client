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
import { AuthResponse, RegisterData } from "@/types/auth";
import {
  handleApiError,
  isResponseOk,
  parseJsonResponse,
} from "@/utils/helpers/api";
import { createErrorResponse } from "@/utils/helpers/error-handler";
import { validateFormData } from "@/utils/helpers/validation";
import { ArrowRight, Github, Lock, Mail, User, Zap } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "client",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (role: "client" | "freelancer" | "admin") => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const validationErrors = validateFormData(formData);
    if (validationErrors.length > 0) {
      setApiError(validationErrors[0].message);
      return;
    }

    setIsLoading(true);
    setApiError(null);
    try {
      // Make actual API call to register user
      const response = await fetch("http://localhost:5001/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          phone: "", // Add phone if needed
        }),
      });

      const result: AuthResponse = await parseJsonResponse(response);

      if (isResponseOk(response) && result.success) {
        // Redirect user to login page after successful registration
        router.push("/auth/login");
      } else {
        setApiError(result.message || "Registration failed");
      }
    } catch (error: any) {
      const standardizedError = createErrorResponse(error);
      setApiError(handleApiError(standardizedError));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-[#0A192F] dark:via-[#0B1F3A] dark:to-[#0A192F] text-gray-900 dark:text-white overflow-hidden">
      {/* Logo top-left */}
      <Link
        href="/"
        className="absolute top-4 left-4 flex items-center gap-1.5 group z-10"
      >
        <div className="w-7 h-7 bg-[#64FFDA] rounded-lg flex items-center justify-center shadow-md shadow-[#64FFDA]/30 group-hover:scale-105 transition-transform">
          <Zap className="w-3.5 h-3.5 text-[#0A192F]" />
        </div>
        <span className="text-base font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-[#0A8B8B] dark:group-hover:text-[#64FFDA] transition-colors">
          SkillSync
        </span>
      </Link>

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Compact Card */}
      <Card className="w-full max-w-sm border border-gray-200 dark:border-white/10 bg-white/95 dark:bg-[#112240]/95 backdrop-blur-xl shadow-xl rounded-xl">
        <CardHeader className="text-center pb-2 space-y-1">
          <div className="flex justify-center">
            <div className="w-9 h-9 bg-[#64FFDA]/10 rounded-lg flex items-center justify-center">
              <User className="w-4.5 h-4.5 text-[#0A8B8B] dark:text-[#64FFDA]" />
            </div>
          </div>
          <CardTitle className="text-lg font-semibold">
            Create Account
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 text-xs">
            Join SkillSync today
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-2.5">
          <Form onSubmit={onSubmit} className="space-y-2.5">
            {/* API Error Message */}
            {apiError && (
              <div className="text-red-400 text-[10px] text-center">
                {apiError}
              </div>
            )}

            {/* Full Name */}
            <FormField
              id="name"
              label="Full Name"
              type="text"
              placeholder="John Doe"
              icon={<User className="w-3.5 h-3.5" />}
              value={formData.name}
              onChange={handleInputChange}
              required
            />

            {/* Email */}
            <FormField
              id="email"
              label="Email"
              type="email"
              placeholder="name@example.com"
              icon={<Mail className="w-3.5 h-3.5" />}
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            {/* Password */}
            <FormField
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-3.5 h-3.5" />}
              value={formData.password}
              onChange={handleInputChange}
              required
            />

            {/* Confirm Password */}
            <FormField
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-3.5 h-3.5" />}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />

            {/* Role Selection */}
            <div className="space-y-0.5">
              <label className="text-xs font-medium">I am a...</label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={formData.role === "client" ? "default" : "outline"}
                  className={`h-8 text-xs ${
                    formData.role === "client"
                      ? "bg-[#64FFDA] text-[#0A192F] hover:bg-[#64FFDA]/90"
                      : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                  } cursor-pointer`}
                  onClick={() => handleRoleChange("client")}
                >
                  Client
                </Button>
                <Button
                  type="button"
                  variant={
                    formData.role === "freelancer" ? "default" : "outline"
                  }
                  className={`h-8 text-xs ${
                    formData.role === "freelancer"
                      ? "bg-[#64FFDA] text-[#0A192F] hover:bg-[#64FFDA]/90"
                      : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                  } cursor-pointer`}
                  onClick={() => handleRoleChange("freelancer")}
                >
                  Freelancer
                </Button>
                <Button
                  type="button"
                  variant={formData.role === "admin" ? "default" : "outline"}
                  className={`h-8 text-xs ${
                    formData.role === "admin"
                      ? "bg-[#64FFDA] text-[#0A192F] hover:bg-[#64FFDA]/90"
                      : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                  } cursor-pointer`}
                  onClick={() => handleRoleChange("admin")}
                >
                  Admin
                </Button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-8 text-xs bg-[#64FFDA] text-[#0A192F] hover:bg-[#64FFDA]/90 font-semibold shadow-sm shadow-[#64FFDA]/20 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#0A192F] mr-1"></div>
                  Creating...
                </>
              ) : (
                <>
                  Sign Up
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </>
              )}
            </Button>
          </Form>

          {/* Divider */}
          <div className="relative py-1 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative inline-block bg-white dark:bg-[#112240] px-1 text-[9px] uppercase text-gray-500 dark:text-gray-400">
              or
            </div>
          </div>

          {/* Social Buttons */}
          <div className="flex flex-col gap-1.5">
            <Button
              variant="outline"
              type="button"
              className="w-full h-8 text-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              <FcGoogle className="w-4 h-4 mr-1" />
              Google
            </Button>

            <Button
              variant="outline"
              type="button"
              className="w-full h-8 text-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            >
              <Github className="w-4 h-4 mr-1" />
              GitHub
            </Button>
          </div>

          {/* Login Link */}
          <p className="text-center text-[11px] text-gray-600 dark:text-gray-400 pt-0.5">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-[#0A8B8B] dark:text-[#64FFDA] hover:underline"
            >
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
