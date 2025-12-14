import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-white to-purple-900/5" />

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-purple-500/5 rounded-l-full" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-purple-700/5 rounded-tr-full" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <Badge className="w-fit bg-purple-500/10 text-purple-700 border-purple-500/20">
              <Zap className="w-3 h-3 mr-1" />
              Professional Collaboration Platform
            </Badge>
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                <span className="block">Streamline Your</span>
                <span className="text-purple-700">Project Collaboration</span>
              </h1>
              <p className="text-xl text-body max-w-xl leading-relaxed">
                Connect with skilled professionals, manage projects seamlessly,
                and deliver exceptional results with our all-in-one
                collaboration platform.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-purple-700 text-white hover:bg-purple-800 font-medium px-8 py-6 text-base shadow-lg hover:shadow-xl transition-all"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-purple-700 text-purple-700 hover:bg-purple-500/10 font-medium px-8 py-6 text-base"
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
                      className="w-10 h-10 rounded-full bg-purple-500 border-2 border-white"
                    />
                  ))}
                </div>
                <div>
                  <div className="font-semibold text-primary-heading">
                    2,000+
                  </div>
                  <div className="text-secondary">Active Users</div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 font-semibold text-primary-heading">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  4.9/5
                </div>
                <div className="text-secondary">User Rating</div>
              </div>
            </div>
          </div>
          <div className="relative">
            {/* Floating cards effect */}
            <div className="absolute -top-6 -right-6 w-full h-full bg-purple-500/10 rounded-2xl -z-10" />
            <div className="absolute -bottom-6 -left-6 w-full h-full bg-purple-700/10 rounded-2xl -z-20" />

            <div className="rounded-2xl border border-purple-500/20 bg-white p-6 shadow-xl relative">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-primary-heading">
                    Project Dashboard
                  </h3>
                  <Badge className="bg-purple-500/10 text-purple-700 border-purple-500/20 text-xs">
                    In Progress
                  </Badge>
                </div>
                <p className="text-base text-body">
                  E-Commerce Website Redesign
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="text-secondary">Budget</div>
                    <div className="font-semibold text-primary-heading">
                      $12,500
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-secondary">Timeline</div>
                    <div className="font-semibold text-primary-heading">
                      6 weeks
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-base">
                    <span className="text-secondary">Progress</span>
                    <span className="font-semibold text-primary-heading">
                      67%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-700 w-2/3 rounded-full" />
                  </div>
                </div>
                <div className="pt-4">
                  <Button
                    size="lg"
                    className="w-full bg-purple-700 text-white hover:bg-purple-800 font-medium py-3"
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
