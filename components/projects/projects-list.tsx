"use client";

import { CreateProjectModal } from "@/components/projects/create-project-modal";
import { ProjectCard } from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Project } from "@/types/project";
import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProjectsListProps {
  projects: Project[];
  onProjectCreated: (project: Project) => void;
}

export function ProjectsList({
  projects,
  onProjectCreated,
}: ProjectsListProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProject = (projectData: {
    title: string;
    description: string;
    budget: string;
  }) => {
    // In a real app, this would make an API call to create the project
    // For now, we'll just simulate it
    const newProject: Project = {
      _id: `project-${Date.now()}`,
      title: projectData.title,
      description: projectData.description,
      status: "pending",
      owner: {
        _id: "current-user-id",
        name: "Current User",
        email: "user@example.com",
        role: "client",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onProjectCreated(newProject);
    setIsCreateModalOpen(false);
  };

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}/dashboard`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Project
        </Button>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            {searchTerm
              ? "No projects match your search."
              : "No projects found."}
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            Create your first project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onClick={() => handleProjectClick(project._id)}
            />
          ))}
        </div>
      )}

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateProject}
      />
    </div>
  );
}
