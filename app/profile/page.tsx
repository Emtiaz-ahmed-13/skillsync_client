"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  Calendar,
  ChevronLeft,
  Edit,
  MapPin,
  Star,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  // Mock user data
  const user = {
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    role: "freelancer",
    location: "San Francisco, CA",
    joinDate: "January 2024",
    bio: "Experienced UI/UX designer with a passion for creating intuitive and engaging digital experiences. Specializing in mobile app design and user research.",
    skills: [
      "UI Design",
      "UX Research",
      "Figma",
      "Prototyping",
      "User Testing",
    ],
    rating: 4.9,
    completedProjects: 42,
    hourlyRate: "$75/hour",
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 text-white"
                >
                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                  <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                  <path d="m10 11 5 3-5 3Z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-skillsync-dark-blue to-skillsync-dark-blue/70 bg-clip-text text-transparent">
                SkillSync
              </span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-secondary hover:text-primary-heading transition-colors"
              >
                Home
              </Link>
              <Link
                href="/projects"
                className="text-secondary hover:text-primary-heading transition-colors"
              >
                Projects
              </Link>
              <Link
                href="/dashboard"
                className="text-secondary hover:text-primary-heading transition-colors"
              >
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <Card className="border-gray-200 bg-white">
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-primary-heading">
                    AM
                  </div>
                  <h1 className="text-2xl font-bold mb-1 text-gray-900">
                    {user.name}
                  </h1>
                  <p className="text-sm text-gray-600 mb-4">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </p>
                  <Badge className="bg-skillsync-cyan/10 text-skillsync-cyan-dark border-skillsync-cyan/20 mb-6">
                    {user.hourlyRate}
                  </Badge>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-skillsync-cyan-dark" />
                        <span className="text-sm text-gray-600">Rating</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {user.rating}/5.0
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-skillsync-cyan-dark" />
                        <span className="text-sm text-gray-600">Completed</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {user.completedProjects} projects
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-skillsync-cyan-dark" />
                        <span className="text-sm text-gray-600">Location</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {user.location}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-skillsync-cyan-dark" />
                        <span className="text-sm text-gray-600">Joined</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {user.joinDate}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:w-2/3">
              <Card className="border-gray-200 bg-white mb-6">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-gray-900">About</CardTitle>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{user.bio}</p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-gray-900">Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        className="bg-gray-100 text-gray-800 border-gray-200"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
