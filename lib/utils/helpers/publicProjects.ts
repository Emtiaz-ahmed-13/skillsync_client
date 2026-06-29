export interface PublicStats {
  totalUsers: number;
  totalProjects: number;
  completedProjects: number;
  inProgressProjects: number;
  freelancers: number;
  clients: number;
  totalEarnings: number;
  successRate: number;
}

export async function getPublicStats(): Promise<PublicStats | null> {
  try {
    const response = await fetch("/api/v1/stats/public");
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data) return data.data;
    }
  } catch (error) {
    console.warn("Error fetching public stats:", error);
  }
  return null;
}

export async function getPublicProjectCount(): Promise<number> {
  const stats = await getPublicStats();
  return stats?.totalProjects ?? 0;
}
