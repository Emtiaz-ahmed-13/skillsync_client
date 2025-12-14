// Mock API endpoint for testing
import { NextApiRequest, NextApiResponse } from "next";

// Mock data
let projects = [
  {
    id: 1,
    title: "E-commerce Website Redesign",
    description: "Complete redesign of the company website with modern UI/UX",
    budget: "$12,500",
    status: "active",
    clientId: 1,
    freelancerId: 2,
    createdAt: "2023-06-15",
    updatedAt: "2023-06-15",
    milestones: [
      {
        id: 1,
        title: "Design Mockups",
        dueDate: "2023-07-15",
        status: "completed",
      },
      {
        id: 2,
        title: "Frontend Development",
        dueDate: "2023-08-30",
        status: "in-progress",
      },
      {
        id: 3,
        title: "Backend Integration",
        dueDate: "2023-09-15",
        status: "pending",
      },
    ],
    sprint: 2,
    daysRemaining: 7,
    estimatedTime: 60,
    technologies: ["React", "Node.js", "MongoDB"],
  },
  {
    id: 2,
    title: "Mobile App Development",
    description: "iOS and Android app for fitness tracking",
    budget: "$25,000",
    status: "active",
    clientId: 3,
    freelancerId: 4,
    createdAt: "2023-07-01",
    updatedAt: "2023-07-01",
    milestones: [
      {
        id: 4,
        title: "App Wireframes",
        dueDate: "2023-07-20",
        status: "completed",
      },
      { id: 5, title: "UI Design", dueDate: "2023-08-10", status: "completed" },
      {
        id: 6,
        title: "Development Phase 1",
        dueDate: "2023-09-30",
        status: "in-progress",
      },
    ],
    sprint: 1,
    daysRemaining: 14,
    estimatedTime: 90,
    technologies: ["React Native", "Firebase", "Redux"],
  },
  {
    id: 3,
    title: "Corporate Branding Package",
    description: "Complete branding package for startup company",
    budget: "$8,500",
    status: "pending",
    clientId: 5,
    freelancerId: 0,
    createdAt: "2023-07-10",
    updatedAt: "2023-07-10",
    milestones: [],
    sprint: 0,
    daysRemaining: 0,
    estimatedTime: 30,
    technologies: ["Adobe Illustrator", "Photoshop", "Figma"],
  },
];

let nextId = 4;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // GET /api/mock-projects - Get all projects
  if (req.method === "GET") {
    const { sortBy = "createdAt", sortOrder = "desc" } = req.query;

    // Sort projects
    const sortedProjects = [...projects].sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortBy as keyof typeof a] > b[sortBy as keyof typeof b]
          ? 1
          : -1;
      } else {
        return a[sortBy as keyof typeof a] < b[sortBy as keyof typeof b]
          ? 1
          : -1;
      }
    });

    res.status(200).json(sortedProjects);
    return;
  }

  // POST /api/mock-projects - Create a new project
  if (req.method === "POST") {
    const projectData = req.body;

    const newProject = {
      id: nextId++,
      ...projectData,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      milestones: [],
      sprint: 0,
      daysRemaining: 0,
    };

    projects = [...projects, newProject];
    res.status(201).json(newProject);
    return;
  }

  // PATCH /api/mock-projects/:id - Update a project
  if (req.method === "PATCH") {
    const { id } = req.query;
    const projectId = parseInt(id as string);
    const updateData = req.body;

    const projectIndex = projects.findIndex((p) => p.id === projectId);
    if (projectIndex === -1) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    projects[projectIndex] = {
      ...projects[projectIndex],
      ...updateData,
      updatedAt: new Date().toISOString().split("T")[0],
    };

    res.status(200).json(projects[projectIndex]);
    return;
  }

  // GET /api/mock-projects/:id - Get a specific project
  if (req.method === "GET" && req.query.id) {
    const { id } = req.query;
    const projectId = parseInt(id as string);

    const project = projects.find((p) => p.id === projectId);
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    res.status(200).json(project);
    return;
  }

  // Default response for unsupported methods
  res.status(405).json({ error: "Method not allowed" });
}
