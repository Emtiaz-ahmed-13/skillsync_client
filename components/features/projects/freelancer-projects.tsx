"use client";

import { Navbar } from "@/components/shared/navbar";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Project {
  id: string;
  _id: string;
  title: string;
  description: string;
  minimumBid: number;
  budget: number;
  technology: string[];
  status: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

interface FreelancerUser {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  role?: string;
  accessToken?: string;
}

interface Bid {
  id: string;
  projectId: string;
  amount: number;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function FreelancerProjectsClient({
  user,
}: {
  user: FreelancerUser;
}) {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTech, setSelectedTech] = useState("all");
  const [allTechnologies, setAllTechnologies] = useState<string[]>([]);

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
    const fetchProjects = async () => {
      try {
        // Fetch freelancer's profile to get their skills
        const profileResponse = await fetch("/api/v1/profile/me", {
          headers: {
            Authorization: `Bearer ${user?.accessToken || ""}`,
          },
        });

        let freelancerSkills: string[] = [];
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          if (profileData.success && profileData.data) {
            freelancerSkills = profileData.data.skills || [];
          }
        }

        const response = await fetch("/api/v1/projects/approved", {
          headers: {
            Authorization: `Bearer ${user?.accessToken || ""}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data && data.data.projects) {
            const allProjects = data.data.projects;

            setProjects(allProjects);
            const techSet = new Set<string>();
            allProjects.forEach((project: Project) => {
              project.technology.forEach((tech) => techSet.add(tech));
            });
            setAllTechnologies(Array.from(techSet));
          }
        } else {
          setError("Failed to fetch projects");
        }
      } catch (err) {
        setError("Error fetching projects");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    let result = projects;

    if (searchTerm) {
      result = result.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          project.technology.some((tech) =>
            tech.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (selectedTech !== "all") {
      result = result.filter((project) =>
        project.technology.includes(selectedTech)
      );
    }

    setFilteredProjects(result);
  }, [projects, searchTerm, selectedTech]);

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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="space-y-8 py-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-foreground"
            >
              Find Projects
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground mt-2 text-lg"
            >
              Browse available projects and place your bids
            </motion.p>
          </div>

          {/* Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <div className="md:col-span-2">
              <Label htmlFor="search">Search Projects</Label>
              <Input
                id="search"
                placeholder="Search by title, description, or technology..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="technology">Technology</Label>
              <Select value={selectedTech} onValueChange={setSelectedTech}>
                <SelectTrigger id="technology">
                  <SelectValue placeholder="All Technologies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Technologies</SelectItem>
                  {allTechnologies.map((tech) => (
                    <SelectItem key={tech} value={tech}>
                      {tech}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedTech("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </motion.div>

          {/* Projects Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {loading ? (
              <div className="col-span-full flex justify-center items-center h-32">
                <p>Loading projects...</p>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-8">
                <p className="text-red-500">{error}</p>
                <Button
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p>No projects found matching your criteria.</p>
              </div>
            ) : (
              filteredProjects.map((project) => (
                <Card key={project.id} className="flex flex-col h-full">
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>Budget: ${project.budget}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.technology.slice(0, 3).map((tech, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Min Bid: ${project.minimumBid}</span>
                      <Badge variant="outline">{project.status}</Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() =>
                        router.push(
                          `/dashboard/freelancer/projects/${project._id}` ||
                            `localhost:5001/api/v1/projects/${project._id}`
                        )
                      }
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
