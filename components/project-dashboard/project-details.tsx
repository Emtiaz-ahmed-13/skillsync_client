import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectDetailsProps {
  title: string;
  description: string;
  budget: string;
  deadline: string;
  startDate: string;
  client: string;
  freelancer: string;
  progress: number;
}

export function ProjectDetails({
  title,
  description,
  budget,
  deadline,
  startDate,
  client,
  freelancer,
  progress,
}: ProjectDetailsProps) {
  return (
    <Card className="border-gray-200 bg-white">
      <CardHeader>
        <CardTitle className="text-gray-900">Project Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-primary-heading mb-2">
            {title}
          </h3>
          <p className="text-body">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Budget</p>
            <p className="font-semibold text-gray-900">{budget}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Progress</p>
            <p className="font-semibold text-gray-900">{progress}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Start Date</p>
            <p className="font-semibold text-gray-900">{startDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Deadline</p>
            <p className="font-semibold text-gray-900">{deadline}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Client</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-primary-heading font-medium text-sm">
                {client.charAt(0)}
              </div>
              <span className="font-semibold text-gray-900">{client}</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Freelancer</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-primary-heading font-medium text-sm">
                {freelancer.charAt(0)}
              </div>
              <span className="font-semibold text-gray-900">{freelancer}</span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2">Status</p>
          <Badge
            className={
              progress === 100
                ? "bg-green-100 text-green-800"
                : progress >= 50
                ? "bg-skillsync-cyan/10 text-skillsync-cyan-dark"
                : "bg-yellow-100 text-yellow-800"
            }
          >
            {progress === 100
              ? "Completed"
              : progress >= 50
              ? "In Progress"
              : "Starting"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
