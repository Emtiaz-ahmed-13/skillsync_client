"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import {
    CheckCircle2,
    Clock,
    DollarSign,
    FileText,
    MessageSquare,
    Target,
    Zap,
} from "lucide-react";
import { MouseEvent } from "react";

export function FeaturesSection() {
  const features = [
    {
      icon: Target,
      title: "Smart Milestones",
      description:
        "Break complex project scopes into manageable, trackable units. Set clear deliverables and automate payment releases upon approval.",
      gradient: "from-blue-500/20 via-cyan-500/20 to-teal-500/20",
      iconColor: "text-blue-400",
      borderColor: "group-hover:border-blue-500/50",
    },
    {
      icon: DollarSign,
      title: "Protected Payments",
      description:
        "Bank-grade escrow protection ensures peace of mind. Funds are held securely and only released when you're 100% satisfied.",
      gradient: "from-emerald-500/20 via-green-500/20 to-lime-500/20",
      iconColor: "text-emerald-400",
      borderColor: "group-hover:border-emerald-500/50",
    },
    {
      icon: FileText,
      title: "Seamless Assets",
      description:
        "Integrated high-speed storage for all your design files and documents. Preview, share, and version-control directly in your dashboard.",
      gradient: "from-orange-500/20 via-amber-500/20 to-yellow-500/20",
      iconColor: "text-orange-400",
      borderColor: "group-hover:border-orange-500/50",
    },
    {
      icon: CheckCircle2,
      title: "Agile Workflow",
      description:
        "Visualize progress with powerful Kanban boards. Drag-and-drop tasks, assign priorities, and keep the momentum going.",
      gradient: "from-purple-500/20 via-violet-500/20 to-indigo-500/20",
      iconColor: "text-purple-400",
      borderColor: "group-hover:border-purple-500/50",
    },
    {
      icon: Clock,
      title: "Precision Timing",
      description:
        "Built-in time tracking with screenshot verification. Generate detailed timesheets automatically for transparent, dispute-free billing.",
      gradient: "from-pink-500/20 via-rose-500/20 to-red-500/20",
      iconColor: "text-pink-400",
      borderColor: "group-hover:border-pink-500/50",
    },
    {
      icon: MessageSquare,
      title: "Instant Connect",
      description:
        "Real-time chat with file attachments, voice notes, and video calls. Keep all your project communication in one searchable context.",
      gradient: "from-indigo-500/20 via-blue-500/20 to-sky-500/20",
      iconColor: "text-indigo-400",
      borderColor: "group-hover:border-indigo-500/50",
    },
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-[100px] opacity-20" />
      <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] opacity-20" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Badge
              variant="outline"
              className="bg-primary/5 text-primary border-primary/20 px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm"
            >
              <Zap className="w-3.5 h-3.5 mr-2 fill-primary/20" />
              Powerhouse Features
            </Badge>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground"
          >
            Everything You Need <br className="hidden md:block" />
            to Build and Scale
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            We've combined the best tools into one seamless platform. No more
            switching apps—just pure, uninterrupted workflow.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  index,
}: {
  feature: any;
  index: number;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative h-full"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute -inset-px bg-gradient-to-r from-border to-border rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.1),
              transparent 80%
            )
          `,
        }}
      />

      <Card className="relative h-full bg-card/50 backdrop-blur-xl border-border/50 overflow-hidden rounded-2xl transition-all duration-300 group-hover:shadow-2xl dark:group-hover:shadow-primary/5">
        <CardContent className="p-8 flex flex-col h-full relative z-10">
          <div
            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg border border-white/10`}
          >
            <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
          </div>

          <div className="space-y-3 flex-1">
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
              {feature.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {feature.description}
            </p>
          </div>

          <div
            className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
