"use client";

import { Navbar } from "@/components/home/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface FreelancerProfile {
  id: string;
  name: string;
  email: string;
  bio: string;
  skills: string[];
  location: string;
  experience: string;
  portfolio: string[];
  hourlyRate: number;
  rating: number;
  completedProjects: number;
}

interface FreelancerUser {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  role?: string;
  accessToken?: string;
}

export default function FreelancerProfileClient({
  user,
}: {
  user: FreelancerUser;
}) {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    skills: "",
    location: "",
    experience: "",
    portfolio: "",
    hourlyRate: 0,
  });

  useEffect(() => {
    if (status === "authenticated") {
      if (user?.role !== "freelancer") {
        // Redirect to correct dashboard if user is not a freelancer
        switch (user?.role) {
          case "client":
            router.push("/dashboard/client");
            break;
          case "admin":
            router.push("/dashboard/admin");
            break;
          default:
            router.push("/dashboard");
        }
      }
    } else if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, user, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id || !user?.accessToken) return;

      try {
        const response = await fetch(
          `http://localhost:5001/api/v1/profile/me`,
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            const profileData = data.data;
            setProfile(profileData);

            // Set form data
            setFormData({
              name: profileData.name || "",
              bio: profileData.bio || "",
              skills: profileData.skills ? profileData.skills.join(", ") : "",
              location: profileData.location || "",
              experience: profileData.experience || "",
              portfolio: profileData.portfolio
                ? profileData.portfolio.join(", ")
                : "",
              hourlyRate: profileData.hourlyRate || 0,
            });
          }
        } else {
          // If profile doesn't exist, initialize with user data
          setFormData({
            name: user.name || "",
            bio: "",
            skills: "",
            location: "",
            experience: "",
            portfolio: "",
            hourlyRate: 0,
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        toast.error("Failed to fetch profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(
        "http://localhost:5001/api/v1/profile/me/freelancer",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.accessToken || ""}`,
          },
          body: JSON.stringify({
            bio: formData.bio,
            skills: formData.skills
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s),
            location: formData.location,
            experience: formData.experience,
            portfolio: formData.portfolio
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s),
            hourlyRate: Number(formData.hourlyRate),
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success("Profile updated successfully!");
          // Update session if needed
          await update();
        } else {
          toast.error(data.message || "Failed to update profile");
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("An error occurred while updating profile");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Redirect effect will handle this
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="space-y-8 py-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-foreground"
            >
              Update Profile
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground mt-2 text-lg"
            >
              Manage your freelancer profile and experience
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your profile to help clients find the right freelancer
                  for their projects
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                      <Input
                        id="hourlyRate"
                        name="hourlyRate"
                        type="number"
                        value={formData.hourlyRate}
                        onChange={handleChange}
                        placeholder="Your hourly rate"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Your location (e.g., City, Country)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="skills">Skills (comma-separated)</Label>
                    <Input
                      id="skills"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="e.g., React, Node.js, MongoDB"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter your skills separated by commas
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="experience">Experience</Label>
                    <Textarea
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="Describe your professional experience and background"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell clients about yourself and your expertise"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="portfolio">
                      Portfolio Links (comma-separated)
                    </Label>
                    <Input
                      id="portfolio"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleChange}
                      placeholder="e.g., https://portfolio.com, https://github.com/username"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Add links to your portfolio, GitHub, or other work samples
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={saving}>
                      {saving ? "Saving..." : "Save Profile"}
                    </Button>
                  </div>
                </CardContent>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
