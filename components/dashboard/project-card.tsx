import { Project } from "@/types/dashboard";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div>
        <h3 className="font-medium text-gray-900">{project.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-gray-600">{project.client}</span>
          <span className="text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-700">
            {project.status}
          </span>
        </div>
      </div>
      <div className="text-right">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-skillsync-cyan-dark rounded-full"
            style={{ width: `${project.progress}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1 text-right">
          {project.progress}% complete
        </div>
      </div>
    </Link>
  );
}
