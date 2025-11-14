// Dashboard related types
export interface Project {
  id: number;
  title: string;
  budget: string;
  progress?: number;
  status?: string;
  skills?: string[];
  posted?: string;
  bids?: number;
}

export interface Activity {
  id: number;
  user?: string;
  client?: string;
  action: string;
  project: string;
  time: string;
}

export interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

export interface UserRole {
  id: number;
  name: string;
  email: string;
  role: string;
  joined: string;
}

export interface Report {
  id: number;
  title: string;
  status: "Completed" | "In Progress" | "Pending";
  time: string;
}

export interface DashboardStats {
  totalUsers?: number;
  activeProjects?: number;
  platformRevenue?: string;
  supportTickets?: number;
  postedProjects?: number;
  totalSpent?: string;
  freelancers?: number;
  completed?: number;
  activeBids?: number;
  totalEarned?: string;
  rating?: number;
}
