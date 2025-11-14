import { Activity } from "@/types/dashboard";
import { Zap } from "lucide-react";

interface ActivityItemProps {
  activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  return (
    <div key={activity.id} className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-[#64FFDA]/10 flex items-center justify-center">
        <Zap className="w-4 h-4 text-[#0A8B8B] dark:text-[#64FFDA]" />
      </div>
      <div>
        <p className="text-sm text-gray-900 dark:text-white">
          {activity.user && (
            <span className="font-medium">{activity.user}</span>
          )}
          {activity.client && (
            <span className="font-medium">{activity.client}</span>
          )}{" "}
          {activity.action}{" "}
          {activity.project && (
            <span className="font-medium">{activity.project}</span>
          )}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {activity.time}
        </p>
      </div>
    </div>
  );
}
