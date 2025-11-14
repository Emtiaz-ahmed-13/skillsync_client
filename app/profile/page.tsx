"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Briefcase,
  Camera,
  DollarSign,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Save,
  Star,
  User,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ProfilePage() {
  const [userRole] = useState<"freelancer" | "client">("freelancer");

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A192F] text-gray-900 dark:text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0A192F]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#64FFDA] rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#0A192F]" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-[#0A192F] to-[#0A192F]/70 dark:from-white dark:to-white/70 bg-clip-text text-transparent">
                  SkillSync
                </span>
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#0A8B8B] dark:hover:text-[#64FFDA] transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/projects"
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#0A8B8B] dark:hover:text-[#64FFDA] transition-colors"
                >
                  Projects
                </Link>
                <Link
                  href="/profile"
                  className="text-sm font-medium text-[#0A8B8B] dark:text-[#64FFDA]"
                >
                  Profile
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10 cursor-pointer"
              >
                <User className="w-4 h-4 mr-2" />
                John Doe
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {userRole === "freelancer" ? "Freelancer" : "Client"} Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your profile information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture & Stats */}
          <div className="space-y-6">
            <Card className="border-gray-200 dark:border-white/10 bg-white dark:bg-[#112240]">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#64FFDA] to-[#64FFDA]/60 flex items-center justify-center">
                      <User className="w-16 h-16 text-[#0A192F]" />
                    </div>
                    <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#64FFDA] rounded-full flex items-center justify-center hover:bg-[#64FFDA]/90 transition-colors cursor-pointer">
                      <Camera className="w-5 h-5 text-[#0A192F]" />
                    </button>
                  </div>
                  <h2 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">
                    John Doe
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {userRole === "freelancer"
                      ? "Full Stack Developer"
                      : "Tech Entrepreneur"}
                  </p>
                  <Badge className="bg-[#64FFDA]/10 text-[#0A8B8B] dark:text-[#64FFDA] border-[#64FFDA]/20 mb-6">
                    {userRole === "freelancer" ? "Freelancer" : "Client"}
                  </Badge>

                  {userRole === "freelancer" && (
                    <div className="w-full space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#0A192F] rounded-lg">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-[#0A8B8B] dark:text-[#64FFDA]" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Rating
                          </span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          4.9/5
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#0A192F] rounded-lg">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-[#0A8B8B] dark:text-[#64FFDA]" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Projects
                          </span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          24
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#0A192F] rounded-lg">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-[#0A8B8B] dark:text-[#64FFDA]" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Hourly Rate
                          </span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          $85/hr
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-gray-200 dark:border-white/10 bg-white dark:bg-[#112240]">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="firstName"
                        className="text-gray-900 dark:text-white"
                      >
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        defaultValue="John"
                        className="bg-gray-50 dark:bg-[#0A192F] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="lastName"
                        className="text-gray-900 dark:text-white"
                      >
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        defaultValue="Doe"
                        className="bg-gray-50 dark:bg-[#0A192F] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-gray-900 dark:text-white"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        defaultValue="john.doe@example.com"
                        className="pl-10 bg-gray-50 dark:bg-[#0A192F] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="location"
                      className="text-gray-900 dark:text-white"
                    >
                      Location
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <Input
                        id="location"
                        defaultValue="San Francisco, CA"
                        className="pl-10 bg-gray-50 dark:bg-[#0A192F] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {userRole === "freelancer" && (
                    <>
                      <div className="space-y-2">
                        <Label
                          htmlFor="title"
                          className="text-gray-900 dark:text-white"
                        >
                          Professional Title
                        </Label>
                        <Input
                          id="title"
                          defaultValue="Full Stack Developer"
                          className="bg-gray-50 dark:bg-[#0A192F] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="hourlyRate"
                          className="text-gray-900 dark:text-white"
                        >
                          Hourly Rate (USD)
                        </Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <Input
                            id="hourlyRate"
                            type="number"
                            defaultValue="85"
                            className="pl-10 bg-gray-50 dark:bg-[#0A192F] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label
                      htmlFor="bio"
                      className="text-gray-900 dark:text-white"
                    >
                      Bio
                    </Label>
                    <textarea
                      id="bio"
                      rows={4}
                      defaultValue={
                        userRole === "freelancer"
                          ? "Passionate full-stack developer with 5+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud technologies."
                          : "Tech entrepreneur with a passion for innovative solutions. Looking to collaborate with talented freelancers on exciting projects."
                      }
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0A192F] border border-gray-200 dark:border-white/10 rounded-md text-gray-900 dark:text-white focus:border-[#64FFDA] focus:ring-[#64FFDA] resize-none"
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="border-gray-200 dark:border-white/10 bg-white dark:bg-[#112240]">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Social Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="website"
                      className="text-gray-900 dark:text-white"
                    >
                      Website
                    </Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <Input
                        id="website"
                        placeholder="https://yourwebsite.com"
                        className="pl-10 bg-gray-50 dark:bg-[#0A192F] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="linkedin"
                      className="text-gray-900 dark:text-white"
                    >
                      LinkedIn
                    </Label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <Input
                        id="linkedin"
                        placeholder="https://linkedin.com/in/username"
                        className="pl-10 bg-gray-50 dark:bg-[#0A192F] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills (Freelancer Only) */}
            {userRole === "freelancer" && (
              <Card className="border-gray-200 dark:border-white/10 bg-white dark:bg-[#112240]">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">
                    Skills & Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "React",
                      "Node.js",
                      "TypeScript",
                      "MongoDB",
                      "Next.js",
                      "Tailwind CSS",
                      "AWS",
                      "Docker",
                    ].map((skill) => (
                      <Badge
                        key={skill}
                        className="bg-[#64FFDA]/10 text-[#0A8B8B] dark:text-[#64FFDA] border-[#64FFDA]/20 px-3 py-1"
                      >
                        {skill}
                      </Badge>
                    ))}
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                    >
                      + Add Skill
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
              <Button className="bg-[#64FFDA] text-[#0A192F] hover:bg-[#64FFDA]/90 font-semibold cursor-pointer">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
