import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <Badge className="w-fit bg-primary/10 text-primary border-primary/20">
              <Zap className="w-3 h-3 mr-1" />
              Professional Collaboration Platform
            </Badge>
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                <span className="block">Connect with</span>
                <span className="text-primary">Top Talent</span>
                <span className="block">for Your Projects</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
                SkillSync connects clients with skilled freelancers to bring
                your projects to life. Streamline collaboration, manage
                milestones, and deliver exceptional results.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-8 py-6 text-base shadow-lg hover:shadow-xl transition-all"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 font-medium px-8 py-6 text-base"
              >
                View Demo
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-primary border-2 border-background"
                    />
                  ))}
                </div>
                <div>
                  <div className="font-semibold text-foreground">2,000+</div>
                  <div className="text-muted-foreground">Active Users</div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 font-semibold text-foreground">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  4.9/5
                </div>
                <div className="text-muted-foreground">User Rating</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl border border-primary/20 bg-card p-6 shadow-xl relative">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-foreground">
                    Project Dashboard
                  </h3>
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                    In Progress
                  </Badge>
                </div>
                <p className="text-base text-muted-foreground">
                  E-Commerce Website Redesign
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="text-muted-foreground">Budget</div>
                    <div className="font-semibold text-foreground">$12,500</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-muted-foreground">Timeline</div>
                    <div className="font-semibold text-foreground">6 weeks</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-base">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold text-foreground">67%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-2/3 rounded-full" />
                  </div>
                </div>
                <div className="pt-4">
                  <Button
                    size="lg"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-3"
                  >
                    View Project
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
