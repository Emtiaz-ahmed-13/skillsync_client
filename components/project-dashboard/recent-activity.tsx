import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, FileText, MessageSquare, User } from "lucide-react";

interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  type: "message" | "file" | "task" | "user";
}

const mockActivities: Activity[] = [
  {
    id: "1",
    user: "Alex Morgan",
    action: "uploaded",
    target: "new design mockups",
    time: "2 hours ago",
    type: "file",
  },
  {
    id: "2",
    user: "Jamie Smith",
    action: "completed",
    target: "homepage component",
    time: "5 hours ago",
    type: "task",
  },
  {
    id: "3",
    user: "Taylor Kim",
    action: "commented on",
    target: "API documentation",
    time: "1 day ago",
    type: "message",
  },
  {
    id: "4",
    user: "Casey Brown",
    action: "joined the project",
    target: "",
    time: "2 days ago",
    type: "user",
  },
];

export function RecentActivity() {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="w-4 h-4 text-skillsync-cyan-dark" />;
      case "file":
        return <FileText className="w-4 h-4 text-skillsync-cyan-dark" />;
      case "task":
        return <CheckCircle className="w-4 h-4 text-skillsync-cyan-dark" />;
      case "user":
        return <User className="w-4 h-4 text-skillsync-cyan-dark" />;
      default:
        return <MessageSquare className="w-4 h-4 text-skillsync-cyan-dark" />;
    }
  };

  return (
    <Card className="border-gray-200 bg-white">
      <CardHeader>
        <CardTitle className="text-gray-900">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {mockActivities.length === 0 ? (
          <p className="text-gray-600 text-center py-4">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {mockActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0"
              >
                <div className="mt-0.5 p-2 bg-skillsync-cyan/10 rounded-lg">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span>{" "}
                    {activity.action}{" "}
                    {activity.target && (
                      <span className="font-medium">{activity.target}</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
