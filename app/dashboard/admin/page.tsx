"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { projectService, type Project } from "@/lib/project-service";
import {
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  FileUp,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Upload,
  User,
  UserCheck,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

// Mock data for recent activities
const recentActivities = [
  {
    id: 1,
    user: "John Doe",
    action: "created project",
    target: "E-commerce Website Redesign",
    time: "2 hours ago",
  },
  {
    id: 2,
    user: "Sarah Smith",
    action: "completed milestone",
    target: "Design Mockups",
    time: "5 hours ago",
  },
  {
    id: 3,
    user: "Mike Johnson",
    action: "uploaded file",
    target: "Project Requirements.pdf",
    time: "1 day ago",
  },
  {
    id: 4,
    user: "Admin",
    action: "approved payment",
    target: "Mobile App Development",
    time: "1 day ago",
  },
  {
    id: 5,
    user: "Jane Wilson",
    action: "submitted proposal",
    target: "Corporate Branding Package",
    time: "2 days ago",
  },
];

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    budget: "",
    clientId: "",
    freelancerId: "",
    estimatedTime: "",
    technologies: [] as string[],
    newTechnology: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load projects on component mount
  useEffect(() => {
    console.log("[Admin] Admin dashboard mounting, loading initial projects");
    loadProjects();

    // Set up polling to refresh projects every 10 seconds
    const interval = setInterval(() => {
      console.log("[Admin] Polling for projects in admin dashboard");
      loadProjects();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const fetchedProjects = await projectService.getAllProjects();
      console.log("[Admin] Projects loaded:", fetchedProjects);
      setProjects(fetchedProjects);
      console.log("[Admin] Setting projects state with:", fetchedProjects);
    } catch (error) {
      console.error("[Admin] Error loading projects:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics using the project service
  const stats = [
    {
      title: "Total Freelancers",
      value: "42",
      description: "18 currently available",
      icon: User,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Clients",
      value: "36",
      description: "12 with pending projects",
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Active Projects",
      value: projects.filter((p) => p.status === "active").length.toString(),
      description: "+8% from last month",
      icon: Play,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Pending Projects",
      value: projects.filter((p) => p.status === "pending").length.toString(),
      description: "Awaiting approval",
      icon: Pause,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Revenue",
      value: "$42,689",
      description: "+15% from last month",
      icon: DollarSign,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100",
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));

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
      newProject.newTechnology.trim() &&
      !newProject.technologies.includes(newProject.newTechnology.trim())
    ) {
      setNewProject((prev) => ({
        ...prev,
        technologies: [...prev.technologies, prev.newTechnology.trim()],
        newTechnology: "",
      }));
    }
  };

  const removeTechnology = (tech: string) => {
    setNewProject((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!newProject.title.trim()) {
      newErrors.title = "Project title is required";
    }

    if (!newProject.description.trim()) {
      newErrors.description = "Project description is required";
    }

    if (!newProject.budget) {
      newErrors.budget = "Budget is required";
    } else if (
      isNaN(parseFloat(newProject.budget)) ||
      parseFloat(newProject.budget) <= 0
    ) {
      newErrors.budget = "Budget must be a positive number";
    }

    if (!newProject.estimatedTime) {
      newErrors.estimatedTime = "Estimated time is required";
    } else if (
      isNaN(parseInt(newProject.estimatedTime)) ||
      parseInt(newProject.estimatedTime) <= 0
    ) {
      newErrors.estimatedTime = "Estimated time must be a positive number";
    }

    if (newProject.technologies.length === 0) {
      newErrors.technologies = "At least one technology is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const projectData = {
          title: newProject.title,
          description: newProject.description,
          budget: newProject.budget,
          clientId: parseInt(newProject.clientId) || 1, // Default to client ID 1
          estimatedTime: parseInt(newProject.estimatedTime),
          technologies: newProject.technologies,
        };

        console.log("[Admin] Admin creating project with data:", projectData);
        const newProjectResult = await projectService.createProject(
          projectData
        );
        console.log("[Admin] Admin created project:", newProjectResult);

        // Refresh projects list
        await loadProjects();

        // Reset form
        setNewProject({
          title: "",
          description: "",
          budget: "",
          clientId: "",
          freelancerId: "",
          estimatedTime: "",
          technologies: [],
          newTechnology: "",
        });

        setShowCreateForm(false);
      } catch (error) {
        console.error("[Admin] Error creating project:", error);
        alert("Failed to create project. Please try again.");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "in-progress":
        return "text-blue-600";
      case "pending":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "pending":
        return <XCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSprintStatus = (sprint: number, daysRemaining: number) => {
    if (sprint === 0) return "Not Started";
    return `Sprint ${sprint} (${daysRemaining} days left)`;
  };

  const approveProject = async (projectId: number) => {
    try {
      console.log("[Admin] Approving project:", projectId);
      const result = await projectService.approveProject(projectId);
      console.log("[Admin] Approval result:", result);

      // Refresh projects list
      await loadProjects();
    } catch (error) {
      console.error("[Admin] Error approving project:", error);
      alert("Failed to approve project. Please try again.");
    }
  };

  // Add a manual refresh function
  const refreshProjects = async () => {
    console.log("[Admin] Manually refreshing projects");
    await loadProjects();
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-heading mb-2">
            Admin Dashboard
          </h1>
          <p className="text-body">
            Manage projects, users, and monitor platform activity
          </p>
          {/* Debug info */}
          <div className="mt-2 text-sm text-gray-500">
            Total projects: {projects.length} {loading && "(Loading...)"}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-primary-heading">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-full ${stat.bgColor}`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary-heading">
                    {stat.value}
                  </div>
                  <p className="text-sm text-body">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-skillsync-cyan-dark text-white hover:bg-skillsync-cyan-dark/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Project
          </Button>
          <Button
            onClick={refreshProjects}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
            disabled={loading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh Projects
          </Button>
        </div>

        {/* Create Project Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl border border-gray-200 bg-white">
              <CardHeader className="relative">
                <CardTitle className="text-gray-900">
                  Create New Project
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4 hover:bg-gray-100"
                  onClick={() => setShowCreateForm(false)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateProject} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-gray-900">
                        Project Title *
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        value={newProject.title}
                        onChange={handleInputChange}
                        placeholder="Enter project title"
                        className={`border ${
                          errors.title ? "border-red-500" : "border-gray-300"
                        } text-gray-900`}
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm">{errors.title}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget" className="text-gray-900">
                        Budget ($) *
                      </Label>
                      <Input
                        id="budget"
                        name="budget"
                        type="number"
                        value={newProject.budget}
                        onChange={handleInputChange}
                        placeholder="Enter project budget"
                        min="0"
                        step="0.01"
                        className={`border ${
                          errors.budget ? "border-red-500" : "border-gray-300"
                        } text-gray-900`}
                      />
                      {errors.budget && (
                        <p className="text-red-500 text-sm">{errors.budget}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-900">
                      Description *
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newProject.description}
                      onChange={handleInputChange}
                      placeholder="Enter project description"
                      className={`border ${
                        errors.description
                          ? "border-red-500"
                          : "border-gray-300"
                      } text-gray-900`}
                      rows={3}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="estimatedTime" className="text-gray-900">
                        Estimated Time (days) *
                      </Label>
                      <Input
                        id="estimatedTime"
                        name="estimatedTime"
                        type="number"
                        value={newProject.estimatedTime}
                        onChange={handleInputChange}
                        placeholder="Enter estimated time in days"
                        min="1"
                        className={`border ${
                          errors.estimatedTime
                            ? "border-red-500"
                            : "border-gray-300"
                        } text-gray-900`}
                      />
                      {errors.estimatedTime && (
                        <p className="text-red-500 text-sm">
                          {errors.estimatedTime}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clientId" className="text-gray-900">
                        Client ID
                      </Label>
                      <Input
                        id="clientId"
                        name="clientId"
                        value={newProject.clientId}
                        onChange={handleInputChange}
                        placeholder="Enter client ID"
                        className="border-gray-300 text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="space-y-2">
                    <Label className="text-gray-900">Technologies *</Label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {newProject.technologies.map((tech, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-skillsync-cyan/10 text-skillsync-cyan-dark px-3 py-1 rounded-full text-sm"
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          {tech}
                          <button
                            type="button"
                            onClick={() => removeTechnology(tech)}
                            className="ml-2 text-skillsync-cyan-dark hover:text-red-500"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={newProject.newTechnology}
                        onChange={handleInputChange}
                        name="newTechnology"
                        placeholder="Add a technology (e.g., React, Node.js, Python)"
                        className="border border-gray-300 text-gray-900"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTechnology();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={addTechnology}
                        variant="outline"
                      >
                        Add
                      </Button>
                    </div>
                    {errors.technologies && (
                      <p className="text-red-500 text-sm">
                        {errors.technologies}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowCreateForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-skillsync-cyan-dark text-white hover:bg-skillsync-cyan-dark/90"
                    >
                      Create Project
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Projects Section */}
          <div>
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">
                  Projects Overview ({projects.length} total)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-skillsync-cyan-dark"></div>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No projects found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className={`border border-gray-200 rounded-lg p-4 hover:bg-gray-50 ${
                          project.status === "pending"
                            ? "border-yellow-300 border-2"
                            : ""
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900">
                                {project.title}
                              </h3>
                              {project.status === "pending" && (
                                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                  Pending Approval
                                </span>
                              )}
                              {project.status === "active" && (
                                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {project.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-sm font-medium text-skillsync-cyan-dark">
                                {project.budget}
                              </span>
                              <span className="text-sm text-gray-500">
                                Created: {project.createdAt}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-gray-500">
                                {getSprintStatus(
                                  project.sprint,
                                  project.daysRemaining
                                )}
                              </span>
                            </div>
                            {/* Technologies */}
                            <div className="flex flex-wrap gap-1 mt-2">
                              {project.technologies.map((tech, index) => (
                                <span
                                  key={index}
                                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {project.status === "pending" && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => approveProject(project.id)}
                              >
                                Approve
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-300 text-gray-700 hover:bg-gray-100"
                            >
                              <FileUp className="w-4 h-4 mr-1" />
                              Manage
                            </Button>
                          </div>
                        </div>

                        {/* Milestones */}
                        {project.milestones.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">
                              Milestones
                            </h4>
                            <div className="space-y-2">
                              {project.milestones.map((milestone) => (
                                <div
                                  key={milestone.id}
                                  className="flex items-center justify-between text-sm"
                                >
                                  <div className="flex items-center gap-2">
                                    {getStatusIcon(milestone.status)}
                                    <span>{milestone.title}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={getStatusColor(
                                        milestone.status
                                      )}
                                    >
                                      {milestone.status.replace("-", " ")}
                                    </span>
                                    <span className="text-gray-500">
                                      Due: {milestone.dueDate}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity Section */}
          <div>
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      <div className="mt-1 w-8 h-8 rounded-full bg-skillsync-cyan/10 flex items-center justify-center">
                        <Upload className="w-4 h-4 text-skillsync-cyan-dark" />
                      </div>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span>{" "}
                          {activity.action}{" "}
                          <span className="font-medium">{activity.target}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* File Upload Section */}
            <Card className="bg-white border-gray-200 mt-8">
              <CardHeader>
                <CardTitle className="text-gray-900">File Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 mb-1">
                    Upload Project Files
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Drag and drop files here or click to browse
                  </p>
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    Select Files
                  </Button>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Recently Uploaded
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm p-2 hover:bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span>Project_Requirements.pdf</span>
                      </div>
                      <span className="text-gray-500">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between text-sm p-2 hover:bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span>Design_Mockups.fig</span>
                      </div>
                      <span className="text-gray-500">1 day ago</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
