"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { registerUser } from "@/utils/actions/registerUser";
import { ArrowRight, Lock, Mail, User, Zap } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "client" | "freelancer" | "admin";
}

interface ValidationError {
  field: string;
  message: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "client",
  });

  const validateFormData = (data: FormData): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!data.name.trim()) {
      errors.push({ field: "name", message: "Name is required" });
    }

    if (!data.email.trim()) {
      errors.push({ field: "email", message: "Email is required" });
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.push({ field: "email", message: "Email is invalid" });
    }

    if (!data.password) {
      errors.push({ field: "password", message: "Password is required" });
    } else if (data.password.length < 6) {
      errors.push({
        field: "password",
        message: "Password must be at least 6 characters",
      });
    }

    if (data.password !== data.confirmPassword) {
      errors.push({
        field: "confirmPassword",
        message: "Passwords do not match",
      });
    }

    if (!data.role) {
      errors.push({ field: "role", message: "Role is required" });
    }

    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
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
      const result = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role,
      });

      if (result.success) {
        toast.success("Account created successfully! Please log in.");
        router.push("/auth/login");
      } else {
        setApiError(result.message || "Registration failed");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setApiError(error.message || "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 text-gray-900 overflow-hidden">
      {/* Logo top-left */}
      <Link
        href="/"
        className="absolute top-4 left-4 flex items-center gap-1.5 group z-10"
      >
        <div className="w-7 h-7 bg-skillsync-cyan rounded-lg flex items-center justify-center shadow-md shadow-skillsync-cyan/30 group-hover:scale-105 transition-transform">
          <Zap className="w-3.5 h-3.5 text-skillsync-dark-blue" />
        </div>
        <span className="text-base font-bold tracking-tight text-primary-heading group-hover:text-skillsync-cyan-dark transition-colors">
          SkillSync
        </span>
      </Link>

      {/* Compact Card */}
      <Card className="w-full max-w-sm border border-gray-200 bg-white/95 backdrop-blur-xl shadow-xl rounded-xl">
        <CardHeader className="text-center pb-2 space-y-1">
          <div className="flex justify-center">
            <div className="w-9 h-9 bg-skillsync-cyan/10 rounded-lg flex items-center justify-center">
              <User className="w-4.5 h-4.5 text-skillsync-cyan-dark" />
            </div>
          </div>
          <CardTitle className="text-lg font-semibold text-primary-heading">
            Create Account
          </CardTitle>
          <CardDescription className="text-body text-xs">
            Join SkillSync today
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-2.5">
          <Form onSubmit={onSubmit} className="space-y-2.5">
            {/* API Error Message */}
            {apiError && (
              <div className="text-error text-[10px] text-center">
                {apiError}
              </div>
            )}

            {/* Full Name */}
            <FormField
              id="name"
              label="Full Name"
              type="text"
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
              icon={<Lock className="w-3.5 h-3.5" />}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />

            {/* Role Selection */}
            <div className="space-y-0.5">
              <label className="text-xs font-medium text-primary-heading">
                I am a...
              </label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={formData.role === "client" ? "default" : "outline"}
                  className={`h-8 text-xs ${
                    formData.role === "client"
                      ? "bg-skillsync-cyan text-skillsync-dark-blue hover:bg-skillsync-cyan/90"
                      : "border-gray-300 text-body hover:bg-gray-100"
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
                      ? "bg-skillsync-cyan text-skillsync-dark-blue hover:bg-skillsync-cyan/90"
                      : "border-gray-300 text-body hover:bg-gray-100"
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
                      ? "bg-skillsync-cyan text-skillsync-dark-blue hover:bg-skillsync-cyan/90"
                      : "border-gray-300 text-body hover:bg-gray-100"
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
              className="w-full h-8 text-xs bg-skillsync-cyan text-skillsync-dark-blue hover:bg-skillsync-cyan/90 font-semibold shadow-sm shadow-skillsync-cyan/20 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-skillsync-dark-blue mr-1"></div>
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
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative inline-block bg-white px-1 text-[9px] uppercase text-muted">
              or
            </div>
          </div>

          {/* Social Buttons */}
          <div className="flex flex-col gap-1.5">
            <Button
              variant="outline"
              type="button"
              className="w-full h-8 text-xs border-gray-300 text-body hover:bg-gray-100 cursor-pointer"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              Google
            </Button>

            <Button
              variant="outline"
              type="button"
              className="w-full h-8 text-xs border-gray-300 text-body hover:bg-gray-100 cursor-pointer"
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              GitHub
            </Button>
          </div>
        </CardContent>

        {/* Login Link */}
        <div className="text-center pb-4">
          <p className="text-[10px] text-body">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-link font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
