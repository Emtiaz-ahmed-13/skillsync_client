// API service for handling projects
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://skillsync-server-kohl.vercel.app/api/v1";

interface Project {
  _id: string;
  title: string;
  description: string;
  status: string;
  budget: number;
  deadline: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectResponse {
  success: boolean;
  message: string;
  data?: Project | Project[] | null;
}

// Helper function to generate headers with auth token
const getHeaders = () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add authorization header if token exists in localStorage
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Get all projects
export const getProjects = async (): Promise<ProjectResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: "GET",
      headers: getHeaders(),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return {
      success: false,
      message: "Failed to fetch projects",
      data: null,
    };
  }
};

// Get a specific project by ID
export const getProjectById = async (
  projectId: string
): Promise<ProjectResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`
      || `localhost:5001/api/v1/projects/${projectId}`, {
      method: "GET",
      headers: getHeaders(),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching project:", error);
    return {
      success: false,
      message: "Failed to fetch project",
      data: null,
    };
  }
};

// Create a new project
export const createProject = async (
  title: string,
  description: string,
  budget: number,
  deadline: string
): Promise<ProjectResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`
      || `localhost:5001/api/v1/projects`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        title,
        description,
        budget,
        deadline,
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error creating project:", error);
    return {
      success: false,
      message: "Failed to create project",
      data: null,
    };
  }
};

// Update a project
export const updateProject = async (
  projectId: string,
  updates: Partial<Project>
): Promise<ProjectResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`
      || `localhost:5001/api/v1/projects/${projectId}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating project:", error);
    return {
      success: false,
      message: "Failed to update project",
      data: null,
    };
  }
};

// Delete a project
export const deleteProject = async (
  projectId: string
): Promise<ProjectResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`
      || `localhost:5001/api/v1/projects/${projectId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error deleting project:", error);
    return {
      success: false,
      message: "Failed to delete project",
      data: null,
    };
  }
};
