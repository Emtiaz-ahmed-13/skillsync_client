import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, CheckCircle2, Clock, Users } from "lucide-react";

interface ProjectHeaderProps {
  title: string;
  description: string;
  status: string;
  progress: number;
  deadline: string;
  team: Array<{ name: string; role: string }>;
}

export function ProjectHeader({
  title,
  description,
  status,
  progress,
  deadline,
  team,
}: ProjectHeaderProps) {
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in progress":
        return "bg-skillsync-cyan/10 text-skillsync-cyan-dark";
      case "review":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="border-gray-200 bg-white p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-primary-heading">{title}</h1>
            <Badge className={getStatusBadgeClass(status)}>{status}</Badge>
          </div>
          <p className="text-gray-600">{description}</p>
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{deadline}</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>{progress}% complete</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{team.length} team members</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Extend Deadline
          </Button>
          <Button size="sm">Mark as Complete</Button>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-primary-heading mb-3">Team</h3>
        <div className="flex flex-wrap gap-2">
          {team.map((member, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full"
            >
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-primary-heading font-medium text-xs">
                {member.name.charAt(0)}
              </div>
              <span className="text-sm text-primary-heading">
                {member.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
