"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Chrome, Github, Loader2, Lock, Zap } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        toast.error("Invalid credentials");
      } else {
        toast.success("Logged in successfully");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 text-gray-900 p-6 overflow-hidden">
      <div className="absolute inset-0 opacity-10" />
      <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-grid-pattern opacity-5" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-skillsync-cyan rounded-full filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-skillsync-cyan-dark rounded-full filter blur-3xl opacity-10 animate-pulse delay-1000" />

      <div className="absolute top-8 left-8">
        <Link href="/" className="group flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-primary-heading group-hover:text-skillsync-cyan-dark transition-colors">
            SkillSync
          </span>
        </Link>
      </div>

      <Card className="relative z-10 w-full max-w-md border border-gray-200 bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-skillsync-cyan-dark rounded-xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-skillsync-cyan" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-primary-heading">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-body text-center">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-primary-heading"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-primary-heading"
              >
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="w-full border-t border-gray-300" />
            <div className="relative inline-block bg-white px-3 text-xs uppercase text-muted -top-3 left-1/2 transform -translate-x-1/2">
              Or continue with
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="w-full border-gray-300 text-body hover:bg-gray-100 cursor-pointer"
              onClick={() => signIn("github")}
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <Button
              variant="outline"
              className="w-full border-gray-300 text-body hover:bg-gray-100 cursor-pointer"
              onClick={() => signIn("google")}
            >
              <Chrome className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-body w-full">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-link">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
