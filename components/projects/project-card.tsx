import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "in-progress":
        return "bg-skillsync-cyan/10 text-skillsync-cyan-dark border-skillsync-cyan/20";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card
      className="border-gray-200 bg-white hover:border-skillsync-cyan/50 transition-all cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {project.title}
          </h3>
          <Badge className={getStatusVariant(project.status)}>
            {project.status.replace("-", " ")}
          </Badge>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>

        <div className="flex justify-between items-center">
          <div className="text-sm">
            <p className="font-semibold text-gray-900">
              {project.owner?.name || "Unknown User"}
            </p>
            <p className="text-gray-500">Owner</p>
          </div>

          <div className="text-sm text-right">
            <p className="font-semibold text-gray-900">
              {formatDate(project.createdAt)}
            </p>
            <p className="text-gray-500">Created</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
