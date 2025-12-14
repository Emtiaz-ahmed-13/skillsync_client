"use client";

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
import { projectService } from "@/lib/project-service";
import { ChevronLeft, Code, DollarSign, Tag, Timer, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

export default function CreateProjectPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    estimatedTime: "",
    technologies: [] as string[],
    newTechnology: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const addTechnology = () => {
    if (
      formData.newTechnology.trim() &&
      !formData.technologies.includes(formData.newTechnology.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, prev.newTechnology.trim()],
        newTechnology: "",
      }));
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Project title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Project description is required";
    }

    if (!formData.budget) {
      newErrors.budget = "Budget is required";
    } else if (
      isNaN(parseFloat(formData.budget)) ||
      parseFloat(formData.budget) <= 0
    ) {
      newErrors.budget = "Budget must be a positive number";
    }

    if (!formData.estimatedTime) {
      newErrors.estimatedTime = "Estimated time is required";
    } else if (
      isNaN(parseInt(formData.estimatedTime)) ||
      parseInt(formData.estimatedTime) <= 0
    ) {
      newErrors.estimatedTime = "Estimated time must be a positive number";
    }

    if (formData.technologies.length === 0) {
      newErrors.technologies = "At least one technology is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        setLoading(true);

        // Create project using the service
        const projectData = {
          title: formData.title,
          description: formData.description,
          budget: formData.budget,
          clientId: 1, // In a real app, this would be the current client's ID
          estimatedTime: parseInt(formData.estimatedTime),
          technologies: formData.technologies,
        };

        console.log("[Client] Creating project with data:", projectData);
        const newProject = await projectService.createProject(projectData);
        console.log("[Client] Project created successfully:", newProject);

        // Also log all projects after creation to verify
        const allProjects = await projectService.getAllProjects();
        console.log("[Client] All projects after creation:", allProjects);

        toast.success("Project created successfully! Awaiting admin approval.");

        // Show an alert to make it obvious
        alert(
          `Project "${newProject.title}" created successfully with ID ${newProject.id}! It will appear in the admin dashboard for approval.`
        );

        // Reset form
        setFormData({
          title: "",
          description: "",
          budget: "",
          estimatedTime: "",
          technologies: [],
          newTechnology: "",
        });
      } catch (error) {
        console.error("[Client] Error creating project:", error);
        toast.error("Failed to create project. Please try again.");
      } finally {
        setLoading(false);
      }
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
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-heading mb-2">
              Create New Project
            </h1>
            <p className="text-body">
              Provide detailed information about your project to attract the
              right freelancers
            </p>
          </div>

          <Card className="border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-gray-900">Project Details</CardTitle>
              <CardDescription className="text-gray-600">
                Fill in all required information to create your project listing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-900">
                    Project Title *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter a clear and descriptive project title"
                    className={`border ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    } text-gray-900`}
                    disabled={loading}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm">{errors.title}</p>
                  )}
                </div>

                {/* Project Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-900">
                    Project Description *
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Provide a detailed description of your project, including goals, requirements, and expectations"
                    className={`border ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    } text-gray-900`}
                    rows={5}
                    disabled={loading}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    Be as detailed as possible to help freelancers understand
                    your project requirements
                  </p>
                </div>

                {/* Budget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="budget" className="text-gray-900">
                      Budget ($) *
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        id="budget"
                        name="budget"
                        type="number"
                        value={formData.budget}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className={`pl-10 border ${
                          errors.budget ? "border-red-500" : "border-gray-300"
                        } text-gray-900`}
                        disabled={loading}
                      />
                    </div>
                    {errors.budget && (
                      <p className="text-red-500 text-sm">{errors.budget}</p>
                    )}
                  </div>

                  {/* Estimated Time */}
                  <div className="space-y-2">
                    <Label htmlFor="estimatedTime" className="text-gray-900">
                      Estimated Time (days) *
                    </Label>
                    <div className="relative">
                      <Timer className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        id="estimatedTime"
                        name="estimatedTime"
                        type="number"
                        value={formData.estimatedTime}
                        onChange={handleInputChange}
                        placeholder="Number of days"
                        min="1"
                        className={`pl-10 border ${
                          errors.estimatedTime
                            ? "border-red-500"
                            : "border-gray-300"
                        } text-gray-900`}
                        disabled={loading}
                      />
                    </div>
                    {errors.estimatedTime && (
                      <p className="text-red-500 text-sm">
                        {errors.estimatedTime}
                      </p>
                    )}
                  </div>
                </div>

                {/* Technologies */}
                <div className="space-y-2">
                  <Label className="text-gray-900">Technologies *</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.technologies.map((tech, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-skillsync-cyan/10 text-skillsync-cyan-dark px-3 py-1 rounded-full text-sm"
                      >
                        <Code className="w-3 h-3 mr-1" />
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(tech)}
                          className="ml-2 text-skillsync-cyan-dark hover:text-red-500"
                          disabled={loading}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        type="text"
                        value={formData.newTechnology}
                        onChange={handleInputChange}
                        name="newTechnology"
                        placeholder="Add a technology (e.g., React, Node.js, Python)"
                        className="pl-10 border border-gray-300 text-gray-900"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTechnology();
                          }
                        }}
                        disabled={loading}
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={addTechnology}
                      variant="outline"
                      disabled={loading}
                    >
                      Add
                    </Button>
                  </div>
                  {errors.technologies && (
                    <p className="text-red-500 text-sm">
                      {errors.technologies}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    Press Enter or click Add to include technologies. These help
                    match your project with skilled freelancers.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-skillsync-cyan-dark text-white hover:bg-skillsync-cyan-dark/90 py-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                        Creating Project...
                      </>
                    ) : (
                      "Create Project"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Your project will be reviewed by our team and published shortly.
            </p>
            <p className="mt-1">
              Freelancers will be able to submit proposals once approved.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
