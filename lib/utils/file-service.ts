export interface FileItem {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  url: string;
  projectId: string;
  content?: string;
}

let mockFiles: FileItem[] = [
  {
    id: "1",
    name: "skillsync-requirements.txt",
    size: "2.4 KB",
    type: "txt",
    uploadedAt: "2025-01-10",
    url: "#",
    projectId: "694e6e9c6663549c78c0ce0d",
    content: `SkillSync Project Requirements

Project Overview:
- Full-stack web application for connecting freelancers with clients
- Focus on project management with sprint planning and work submission
- AI-powered task distribution based on project requirements
- Real-time communication and file sharing capabilities

Key Features:
1. User Authentication & Authorization
   - Multi-provider login (Email, Google, GitHub)
   - Role-based access (Client, Freelancer, Admin)

2. Project Management
   - Project creation and listing
   - Budget and technology specification
   - Freelancer bidding system

3. Sprint Planning
   - 3 sprints of 14 days each
   - 4 features per sprint
   - AI-powered task distribution
   - Feature status tracking (pending, in-progress, completed)

4. Work Submission
   - GitHub repository links
   - Live demo links
   - Feature completion tracking
   - Status updates (pending, review, approved, rejected)

5. Communication & Collaboration
   - Real-time messaging
   - File sharing system
   - Milestone tracking
   - Time tracking

6. Additional Features
   - Task management
   - Time tracking
   - Notification system
   - Responsive design
   - Dark/light theme support`,
  },
  {
    id: "2",
    name: "design-mockups.pdf",
    size: "2.4 MB",
    type: "pdf",
    uploadedAt: "2025-01-10",
    url: "#",
    projectId: "694e6e9c6663549c78c0ce0d",
  },
  {
    id: "3",
    name: "enhanced-details.docx",
    size: "1.1 MB",
    type: "docx",
    uploadedAt: "2025-01-08",
    url: "#",
    projectId: "694e6e9c6663549c78c0ce0d",
    content: `SkillSync Enhanced Project Details

Project Title: SkillSync - Freelancer-Client Platform

Description: A comprehensive platform for connecting freelancers with clients, focusing on project management with sprint-based development cycles.

Detailed Requirements:
- The platform should support 3 sprints of 14 days each
- Each sprint should contain 4 features distributed based on complexity and dependencies
- The first sprint should focus on foundational features like authentication, basic UI, and project setup
- The second sprint should implement core functionality like project management, bidding, and communication
- The third sprint should handle advanced features, testing, and deployment

Technology Stack:
- Frontend: Next.js, React, TypeScript
- Styling: Tailwind CSS
- UI Components: Shadcn UI
- Animation: Framer Motion
- Icons: Lucide React
- State Management: NextAuth for authentication
- Backend: Node.js/Express (planned)

Features by Sprint:

Sprint 1 (Foundation):
- User authentication system
- Role-based dashboard framework
- Project management core
- Theme system implementation

Sprint 2 (Core Features):
- Project filtering system
- Freelancer project workflow
- Responsive landing page
- API service layer

Sprint 3 (Advanced Features):
- Sprint planning interface
- Work submission system
- AI integration
- Testing & deployment`,
  },
];

const generateId = () => Math.random().toString(36).substr(2, 9);

export const getProjectFiles = async (projectId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const projectFiles = mockFiles.filter((file) => file.projectId === projectId);

  return {
    success: true,
    message: "Project files retrieved successfully",
    data: projectFiles,
  };
};

export const uploadProjectFile = async (projectId: string, file: File) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newFile: FileItem = {
    id: generateId(),
    name: file.name,
    size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
    type: file.name.split(".").pop() || "file",
    uploadedAt: new Date().toISOString().split("T")[0],
    url: "#",
    projectId,
  };

  mockFiles.push(newFile);

  return {
    success: true,
    message: "File uploaded successfully",
    data: newFile,
  };
};

export const deleteProjectFile = async (fileId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const initialLength = mockFiles.length;
  mockFiles = mockFiles.filter((file) => file.id !== fileId);

  if (mockFiles.length === initialLength) {
    return {
      success: false,
      message: "File not found",
      data: null,
    };
  }

  return {
    success: true,
    message: "File deleted successfully",
    data: null,
  };
};

export const getProjectFileContent = async (fileId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const file = mockFiles.find((f) => f.id === fileId);

  if (!file || !file.content) {
    return {
      success: false,
      message: "File content not available",
      data: null,
    };
  }

  return {
    success: true,
    message: "File content retrieved successfully",
    data: file.content,
  };
};
export const getProjectFilesWithContent = async (projectId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const projectFiles = mockFiles.filter((file) => file.projectId === projectId);
  const filesWithContent = projectFiles.filter((file) => file.content);

  return {
    success: true,
    message: "Project files with content retrieved successfully",
    data: filesWithContent,
  };
};
