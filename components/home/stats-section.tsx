import { CheckCircle2, DollarSign, TrendingUp, Users } from "lucide-react";

export function StatsSection() {
  const stats = [
    { label: "Projects Completed", value: "5,000+", icon: CheckCircle2 },
    { label: "Active Freelancers", value: "1,200+", icon: Users },
    { label: "Total Earnings", value: "$2.5M+", icon: DollarSign },
    { label: "Success Rate", value: "98%", icon: TrendingUp },
  ];

  return (
    <section className="py-16 border-y border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#112240]/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center space-y-2">
              <stat.icon className="w-6 h-6 mx-auto text-[#0A8B8B] dark:text-[#64FFDA]" />
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
