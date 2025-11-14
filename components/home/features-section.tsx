import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  MessageSquare,
  Shield,
  Star,
  Target,
  Users,
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Target,
      title: "Milestone Management",
      description:
        "Break projects into manageable milestones with clear deliverables and payment schedules.",
    },
    {
      icon: DollarSign,
      title: "Secure Payments",
      description:
        "Stripe-integrated payment system with escrow protection for both clients and freelancers.",
    },
    {
      icon: FileText,
      title: "File Sharing",
      description:
        "Securely upload and share project files with integrated ImageKit storage.",
    },
    {
      icon: CheckCircle2,
      title: "Task Management",
      description:
        "Kanban-style task boards to organize, assign, and track project tasks efficiently.",
    },
    {
      icon: Clock,
      title: "Time Tracking",
      description:
        "Log work hours with detailed reports for complete transparency and accurate billing.",
    },
    {
      icon: MessageSquare,
      title: "Real-time Notifications",
      description:
        "Stay updated with instant alerts for messages, approvals, and project updates.",
    },
    {
      icon: Star,
      title: "Review System",
      description:
        "Two-way ratings and feedback to build reputation and trust in the community.",
    },
    {
      icon: Shield,
      title: "Secure Authentication",
      description:
        "NextAuth-powered JWT authentication with role-based access control.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Invite team members, assign roles, and collaborate seamlessly on projects.",
    },
  ];

  return (
    <section
      id="features"
      className="py-20 lg:py-32 bg-white dark:bg-[#0A192F]"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge className="mx-auto bg-[#64FFDA]/10 text-[#0A8B8B] dark:text-[#64FFDA] border-[#64FFDA]/20">
            Features
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Powerful tools designed to streamline your workflow and maximize
            productivity
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <Card
              key={i}
              className="group hover:shadow-xl hover:border-[#64FFDA]/50 transition-all duration-300 bg-white dark:bg-[#112240] border-gray-200 dark:border-white/10"
            >
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-[#64FFDA]/10 rounded-lg flex items-center justify-center group-hover:bg-[#64FFDA]/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-[#0A8B8B] dark:text-[#64FFDA]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
