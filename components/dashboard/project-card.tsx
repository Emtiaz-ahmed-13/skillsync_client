import { Button } from "@/components/ui/button";
import { Project } from "@/types/dashboard";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div
      key={project.id}
      className="flex items-center justify-between p-4 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
    >
      <div>
        <h3 className="font-medium text-gray-900 dark:text-white">
          {project.title}
        </h3>
        <div className="flex items-center gap-4 mt-1">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {project.budget}
          </span>
          {project.status && (
            <span className="text-sm px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-500">
              {project.status}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        {project.progress !== undefined && (
          <div className="w-24">
            <div className="h-2 bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#64FFDA] rounded-full"
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
              {project.progress}%
            </div>
          </div>
        )}
        <Button variant="outline" size="sm" className="cursor-pointer">
          View
        </Button>
      </div>
    </div>
  );
}
