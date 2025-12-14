// Project related types based on backend API
export interface Project {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  owner: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    role: "client" | "freelancer" | "admin";
  };
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  _id?: string;
  id?: string;
  projectId: string;
  title: string;
  description: string;
  dueDate: string;
  order: number;
  isCompleted?: boolean;
  completed?: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  _id?: string;
  id?: string;
  type: string;
  description: string;
  actor?: {
    _id: string;
    name: string;
    email: string;
  };
  actorId?: {
    _id: string;
    name: string;
    email: string;
  };
  projectId: string;
  createdAt: string;
}

export interface ProjectDashboard {
  project: Project;
  owner: Project["owner"];
  milestones: Milestone[];
  recentActivities: Activity[];
  stats: {
    completionRate: number;
    totalMilestones: number;
    completedMilestones: number;
  };
}

export interface CreateProjectData {
  title: string;
  description: string;
  ownerId: string;
  status?: "pending" | "in-progress" | "completed" | "cancelled";
}

export interface CreateMilestoneData {
  title: string;
  description: string;
  dueDate: string;
  order?: number;
}

