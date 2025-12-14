"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, DollarSign, Filter, Search } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { projectService, type Project } from "@/lib/project-service";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
    
    // Set up polling to refresh projects every 10 seconds
    const interval = setInterval(() => {
      loadProjects();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const fetchedProjects = await projectService.getAllProjects();
      setProjects(fetchedProjects);
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters when projects, search term, or status filter changes
  useEffect(() => {
    let result = projects;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(project => project.status === statusFilter);
    }
    
    setFilteredProjects(result);
  }, [projects, searchTerm, statusFilter]);

  const getStatusVariant = (status: string): "default" | "secondary" | "outline" => {
    switch (status) {
      case "active": return "default";
      case "pending": return "secondary";
      case "completed": return "secondary"; // Using secondary for completed projects
      default: return "outline";
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      try {
        setLoading(true);
        const searchedProjects = await projectService.searchProjects(searchTerm);
        // Ensure we're working with an array
        const projectsArray = Array.isArray(searchedProjects) ? searchedProjects : [];
        setFilteredProjects(projectsArray);
      } catch (error) {
        console.error("Error searching projects:", error);
        setFilteredProjects([]);
      } finally {
        setLoading(false);
      }
    } else {
      // If search term is empty, show all projects
      setFilteredProjects(projects);
    }
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-heading mb-2">
              My Projects
            </h1>
            <p className="text-body">
              Manage and track all your projects in one place
            </p>
          </div>
          <Button asChild>
            <Link href="/projects/new">Create New Project</Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-skillsync-cyan-dark focus:border-skillsync-cyan-dark"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          <div className="flex gap-2">
            <Filter className="w-4 h-4 text-gray-500 mt-3" />
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-skillsync-cyan-dark focus:border-skillsync-cyan-dark"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-skillsync-cyan-dark"></div>
          </div>
        ) : (Array.isArray(filteredProjects) && filteredProjects.length === 0) ? (
          <Card className="border border-gray-200 bg-white">
            <CardContent className="py-12 text-center">
              <h3 className="text-lg font-medium text-primary-heading mb-2">
                No projects found
              </h3>
              <p className="text-body mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by creating your first project"}
              </p>
              <Button asChild>
                <Link href="/projects/new">Create New Project</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.isArray(filteredProjects) && filteredProjects.map((project) => (
              <Card key={project.id} className="border border-gray-200 bg-white hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-primary-heading mb-1">
                        {project.title}
                      </CardTitle>
                      <Badge variant={getStatusVariant(project.status)}>
                        {project.status === "pending" ? "Pending Approval" : project.status}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="mt-3 line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <DollarSign className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-primary-heading font-medium">
                        {project.budget}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-body">
                        Created: {project.createdAt}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-body">
                        Est. Time: {project.estimatedTime} days
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.technologies.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/projects/${project.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}