"use client";

import { getPublicProjectCount } from "@/utils/helpers/publicProjects";
import { CheckCircle2, DollarSign, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";

export function StatsSection() {
  const [projectCount, setProjectCount] = useState("1,250+");

  useEffect(() => {
    const fetchProjectCount = async () => {
      try {
        const count = await getPublicProjectCount();
        // Format the count with commas
        setProjectCount(count.toLocaleString() + "+");
      } catch (error) {
        console.warn(
          "Could not fetch project count, using default value:",
          error
        );
        // Keep the default value
      }
    };

    fetchProjectCount();
  }, []);

  const stats = [
    { label: "Projects", value: projectCount, icon: CheckCircle2 },
    { label: "Freelancers", value: "1,200+", icon: Users },
    { label: "Earnings", value: "$2.5M+", icon: DollarSign },
    { label: "Success Rate", value: "98%", icon: TrendingUp },
  ];

  return (
    <section className="py-16 border-y border-gray-200 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center space-y-3">
              <div className="flex justify-center">
                <stat.icon className="w-6 h-6 text-primary-heading" />
              </div>
              <div className="text-2xl font-bold text-primary-heading">
                {stat.value}
              </div>
              <div className="text-sm text-secondary uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
