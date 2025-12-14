import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  MessageSquare,
  Target,
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Target,
      title: "Milestone Management",
      description:
        "Break projects into manageable milestones with clear deliverables and payment schedules.",
      color: "bg-purple-100 text-purple-700",
    },
    {
      icon: DollarSign,
      title: "Secure Payments",
      description:
        "Stripe-integrated payment system with escrow protection for both clients and freelancers.",
      color: "bg-purple-100 text-purple-700",
    },
    {
      icon: FileText,
      title: "File Sharing",
      description:
        "Securely upload and share project files with integrated ImageKit storage.",
      color: "bg-purple-100 text-purple-700",
    },
    {
      icon: CheckCircle2,
      title: "Task Management",
      description:
        "Kanban-style task boards to organize, assign, and track project tasks efficiently.",
      color: "bg-purple-100 text-purple-700",
    },
    {
      icon: Clock,
      title: "Time Tracking",
      description:
        "Log work hours with detailed reports for complete transparency and accurate billing.",
      color: "bg-purple-100 text-purple-700",
    },
    {
      icon: MessageSquare,
      title: "Real-time Messaging",
      description:
        "Stay connected with instant messaging for seamless communication.",
      color: "bg-purple-100 text-purple-700",
    },
  ];

  return (
    <section
      id="features"
      className="py-20 bg-gradient-to-b from-white to-purple-500/5"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge className="mx-auto bg-purple-500/10 text-purple-700 border-purple-500/20">
            Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-heading">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-body max-w-2xl mx-auto">
            Powerful tools designed to streamline your workflow and maximize
            productivity
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <Card
              key={i}
              className="hover:shadow-xl hover:border-purple-500/30 transition-all duration-300 bg-white border-purple-500/10 rounded-xl transform hover:-translate-y-2"
            >
              <CardContent className="p-6 space-y-4">
                <div
                  className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-primary-heading">
                  {feature.title}
                </h3>
                <p className="text-body">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
