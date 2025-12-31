"use client";

import { Navbar } from "@/components/shared/navbar";
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

interface FreelancerUser {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  role?: string;
  accessToken?: string;
}

interface FreelancerProfile {
  id?: string;
  name?: string;
  email?: string;
  bio?: string;
  skills?: string[];
  hourlyRate?: number;
  portfolio?: string[];
  location?: string;
  experience?: string;
  resume?: string;
}

export default function FreelancerProfileUpdateClient({
  user,
}: {
  user: FreelancerUser;
}) {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<FreelancerProfile>({
    name: user?.name || "",
    email: user?.email || "",
    bio: "",
    skills: [],
    hourlyRate: 0,
    portfolio: [],
    location: "",
    experience: "",
    resume: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumePreview, setResumePreview] = useState<string | null>(null);

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
      } else {
        fetchProfile();
      }
    } else if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, user, router]);

  const fetchProfile = async () => {
    if (!user?.accessToken) {
      toast.error("No access token available");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/v1/profile/me", {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setProfile({
            ...data.data,
            skills: data.data.skills || [],
            portfolio: data.data.portfolio || [],
          });
        }
      } else {
        toast.error("Failed to fetch profile");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      toast.error("Error fetching profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);

      // Create a preview URL for the file
      const previewUrl = URL.createObjectURL(file);
      setResumePreview(previewUrl);

      // Clean up the preview URL when component unmounts or file changes
      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      let resumeUrl = null;

      // Upload resume if provided
      if (resumeFile) {
        const formData = new FormData();
        formData.append("file", resumeFile);
        formData.append("fileType", "resume");
        // Add optional parameters that the backend might require
        formData.append("projectId", ""); // Empty string if not associated with a project
        // Don't include milestoneId to avoid BSONError

        try {
          const uploadResponse = await fetch(
            "http://localhost:5001/api/v1/files",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${user?.accessToken || ""}`,
                // Don't set Content-Type header when using FormData
                // The browser will set it automatically with the correct boundary
              },
              body: formData,
            }
          );

          if (!uploadResponse.ok) {
            const uploadError = await uploadResponse.json();
            console.error("Upload error response:", uploadError);
            toast.error(
              uploadError.message ||
                `Upload failed with status ${uploadResponse.status}`
            );
            return;
          }

          const uploadResult = await uploadResponse.json();
          console.log("Upload result:", uploadResult);
          resumeUrl = uploadResult.data?.url || uploadResult.data?.data?.url;
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          toast.error("Failed to upload resume file. Please try again.");
          return;
        }
      }

      // Prepare profile data - only freelancer-specific fields
      const profileData: {
        bio?: string;
        skills?: string[];
        hourlyRate?: number;
        portfolio?: string[];
        location?: string;
        experience?: string;
        resume?: string;
      } = {
        bio: profile.bio || "",
        skills: profile.skills || [],
        hourlyRate: profile.hourlyRate || 0,
        portfolio: profile.portfolio || [],
        location: profile.location || "",
        experience: profile.experience || "",
      };

      // Update freelancer profile
      const requestBody = resumeUrl
        ? { ...profileData, resume: resumeUrl }
        : profileData;
      const response = await fetch(
        "http://localhost:5001/api/v1/profile/me/freelancer",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.accessToken || ""}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          toast.success("Profile updated successfully!");
          // Update session with new profile data
          await update({
            ...session,
            user: {
              ...session?.user,
              ...result.data,
            },
          });
          router.push("/dashboard/freelancer");
        } else {
          toast.error(result.message || "Failed to update profile");
        }
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("An error occurred while updating profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skillsString = e.target.value;
    const skillsArray = skillsString
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== "");
    setProfile({ ...profile, skills: skillsArray });
  };

  const handlePortfolioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const portfolioString = e.target.value;
    const portfolioArray = portfolioString
      .split(",")
      .map((link) => link.trim())
      .filter((link) => link !== "");
    setProfile({ ...profile, portfolio: portfolioArray });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background overflow-hidden relative">
        <Navbar />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="flex justify-center items-center h-32">
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="space-y-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-foreground">
              Update Your Profile
            </h1>
            <p className="text-muted-foreground mt-2">
              Update your freelancer profile information
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your profile details to help clients find you
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profile.name || ""}
                          onChange={(e) =>
                            setProfile({ ...profile, name: e.target.value })
                          }
                          placeholder="Your full name"
                          readOnly
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={profile.email || ""}
                          onChange={(e) =>
                            setProfile({ ...profile, email: e.target.value })
                          }
                          placeholder="your@email.com"
                          readOnly
                        />
                      </div>

                      <div>
                        <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                        <Input
                          id="hourlyRate"
                          type="number"
                          value={profile.hourlyRate || ""}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              hourlyRate: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="50"
                          min="0"
                        />
                      </div>

                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profile.location || ""}
                          onChange={(e) =>
                            setProfile({ ...profile, location: e.target.value })
                          }
                          placeholder="City, Country"
                        />
                      </div>

                      <div>
                        <Label htmlFor="experience">Experience</Label>
                        <Input
                          id="experience"
                          value={profile.experience || ""}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              experience: e.target.value,
                            })
                          }
                          placeholder="5 years"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="skills">Skills</Label>
                        <Input
                          id="skills"
                          value={profile.skills?.join(", ") || ""}
                          onChange={handleSkillsChange}
                          placeholder="React, Node.js, TypeScript"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Separate skills with commas
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="portfolio">Portfolio Links</Label>
                        <Input
                          id="portfolio"
                          value={profile.portfolio?.join(", ") || ""}
                          onChange={handlePortfolioChange}
                          placeholder="https://portfolio.com, https://github.com/username"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Separate links with commas
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="resume">Upload Resume</Label>
                        <Input
                          id="resume"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          PDF, DOC, or DOCX format (max 5MB)
                        </p>
                        {resumePreview && (
                          <p className="text-xs text-blue-500 mt-1">
                            File selected: {resumeFile?.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={profile.bio || ""}
                          onChange={(e) =>
                            setProfile({ ...profile, bio: e.target.value })
                          }
                          placeholder="Tell clients about yourself..."
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/dashboard/freelancer")}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={updating}>
                      {updating ? "Updating..." : "Update Profile"}
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
