"use client";

import { getPublicStats, PublicStats } from "@/lib/utils/helpers/publicProjects";
import { CheckCircle2, DollarSign, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";

export function StatsSection() {
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    getPublicStats().then(setStats);
  }, []);

  const formatEarnings = (cents: number) => {
    const dollars = cents / 100;
    if (dollars >= 1000000) return `$${(dollars / 1000000).toFixed(1)}M`;
    if (dollars >= 1000) return `$${(dollars / 1000).toFixed(1)}K`;
    return `$${dollars.toFixed(0)}`;
  };

  const items = [
    { label: "Projects", value: stats?.totalProjects ?? "—", icon: CheckCircle2 },
    { label: "Freelancers", value: stats?.freelancers ?? "—", icon: Users },
    {
      label: "Completed",
      value: stats?.completedProjects ?? "—",
      icon: DollarSign,
    },
    {
      label: "Success Rate",
      value: stats ? `${stats.successRate}%` : "—",
      icon: TrendingUp,
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-secondary to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((stat, i) => (
            <div
              key={i}
              className="text-center space-y-3 p-6 bg-card rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
        {stats && stats.totalEarnings > 0 && (
          <p className="text-center text-sm text-muted-foreground mt-6">
            {formatEarnings(stats.totalEarnings)} processed through the platform
          </p>
        )}
      </div>
    </section>
  );
}
