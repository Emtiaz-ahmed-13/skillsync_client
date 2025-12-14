// Project interfaces
export interface Milestone {
  id: number;
  title: string;
  dueDate: string;
  status: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  budget: string;
  status: string;
  clientId: number;
  freelancerId: number;
  createdAt: string;
  updatedAt: string;
  milestones: Milestone[];
  sprint: number;
  daysRemaining: number;
  estimatedTime: number;
  technologies: string[];
}

// API base URL - in a real app, this would come from an environment variable
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

// Import the apiClient
import apiClient from "@/utils/apiClient";

// Service functions
export const projectService = {
  // Get all projects
  getAllProjects: async (): Promise<Project[]> => {
    try {
      console.log("[ProjectService] Fetching all projects");
      const data = await apiClient.get("/projects", {
        sortBy: "createdAt",
        sortOrder: "desc"
      });
      // Ensure we return an array
      const projectsArray = Array.isArray(data) ? data : [];
      console.log("[ProjectService] Fetched projects:", projectsArray);
      return projectsArray;
    } catch (error) {
      console.error("[ProjectService] Error fetching projects:", error);
      // Return empty array on error
      return [];
    }
  },

  // Get projects by status
  getProjectsByStatus: async (status: string): Promise<Project[]> => {
    try {
      console.log(`[ProjectService] Fetching projects with status ${status}`);
      const data = await apiClient.get("/projects", {
        status,
        sortBy: "createdAt",
        sortOrder: "desc"
      });
      // Ensure we return an array
      const projectsArray = Array.isArray(data) ? data : [];
      console.log(
        `[ProjectService] Fetched ${projectsArray.length} projects with status ${status}`
      );
      return projectsArray;
    } catch (error) {
      console.error(
        `[ProjectService] Error fetching projects with status ${status}:`,
        error
      );
      // Return empty array on error
      return [];
    }
  },

  // Get project by ID
  getProjectById: async (id: number): Promise<Project | undefined> => {
    try {
      console.log(`[ProjectService] Fetching project with id ${id}`);
      const data = await apiClient.get(`/projects/${id}`);
      console.log(`[ProjectService] Fetched project:`, data);
      return data;
    } catch (error: any) {
      if (error.message && error.message.includes("404")) {
        console.log(`[ProjectService] Project ${id} not found`);
        return undefined;
      }
      console.error(`[ProjectService] Error fetching project ${id}:`, error);
      return undefined;
    }
  },

  // Search projects
  searchProjects: async (query: string): Promise<Project[]> => {
    try {
      console.log(`[ProjectService] Searching projects with query: ${query}`);
      const data = await apiClient.get("/projects/search", {
        q: query,
        sortBy: "createdAt",
        sortOrder: "desc"
      });
      // Ensure we return an array
      const projectsArray = Array.isArray(data) ? data : [];
      console.log(
        `[ProjectService] Found ${projectsArray.length} projects for query: ${query}`
      );
      return projectsArray;
    } catch (error) {
      console.error(
        `[ProjectService] Error searching projects with query ${query}:`,
        error
      );
      // Return empty array on error
      return [];
    }
  },

  // Create a new project
  createProject: async (
    projectData: Omit<
      Project,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "status"
      | "milestones"
      | "sprint"
      | "daysRemaining"
      | "freelancerId"
    >
  ): Promise<Project> => {
    try {
      console.log("[ProjectService] Creating project with data:", projectData);
      const newProject = await apiClient.post("/projects", {
        ...projectData,
        status: "pending", // New projects start as pending
        freelancerId: 0, // Not assigned yet
      });
      console.log("[ProjectService] Project created successfully:", newProject);
      return newProject;
    } catch (error) {
      console.error("[ProjectService] Error creating project:", error);
      throw error;
    }
  },

  // Approve a project
  approveProject: async (id: number): Promise<boolean> => {
    try {
      console.log(`[ProjectService] Approving project with id ${id}`);
      await apiClient.put(`/projects/${id}/approve`);
      console.log(`[ProjectService] Project ${id} approved successfully`);
      return true;
    } catch (error) {
      console.error(`[ProjectService] Error approving project ${id}:`, error);
      return false;
    }
  },

  // Get statistics
  getStats: async () => {
    try {
      console.log("[ProjectService] Fetching project statistics");
      // In a real app, this would be a dedicated endpoint
      const allProjects = await projectService.getAllProjects();
      const activeProjects = allProjects.filter(
        (p) => p.status === "active"
      ).length;
      const pendingProjects = allProjects.filter(
        (p) => p.status === "pending"
      ).length;

      const stats = {
        totalProjects: allProjects.length,
        activeProjects,
        pendingProjects,
      };
      console.log("[ProjectService] Project statistics:", stats);
      return stats;
    } catch (error) {
      console.error("[ProjectService] Error fetching statistics:", error);
      // Return default stats on error
      return {
        totalProjects: 0,
        activeProjects: 0,
        pendingProjects: 0,
      };
    }
  }
};