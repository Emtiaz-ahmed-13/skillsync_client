import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/types/dashboard";

export function StatsCard({ title, value, icon }: StatCard) {
  return (
    <Card className="bg-white dark:bg-[#112240] border-gray-200 dark:border-white/10">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className="w-12 h-12 bg-[#64FFDA]/10 rounded-lg flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
