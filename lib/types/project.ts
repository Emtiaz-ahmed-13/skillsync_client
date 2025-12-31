import {
  ProjectPriority,
  ProjectStatus,
  ProjectVisibility,
} from "../constants/project";

export interface Project {
  id: string;
  title: string;
  description: string;
  clientId: string;
  freelancerId?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  visibility: ProjectVisibility;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  deadline?: Date;
  skillsRequired: string[];
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  completedAt?: Date;
  rating?: number;
  review?: string;
}

export interface ProjectFilters {
  status?: ProjectStatus;
  priority?: ProjectPriority;
  visibility?: ProjectVisibility;
  skills?: string[];
  budgetMin?: number;
  budgetMax?: number;
  deadlineAfter?: Date;
  deadlineBefore?: Date;
  searchQuery?: string;
}
