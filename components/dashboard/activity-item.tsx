interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
}

export function ActivityItem({
  icon,
  title,
  description,
  time,
}: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="mt-0.5 p-2 bg-skillsync-cyan/10 rounded-lg">{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-gray-900">
          <span className="font-medium">{title}</span> {description}
        </p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
}
