import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Star, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:bg-[radial-gradient(ellipse_at_top,_#112240_0%,_#0A192F_50%)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2NEZGREEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bS0yIDJ2LTJoLTJ2Mmgyem0wLTJ2LTJoLTJ2Mmgyem0yIDB2LTJoLTJ2MmgyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20 dark:opacity-20" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Badge className="w-fit bg-[#64FFDA]/10 text-[#0A8B8B] dark:text-[#64FFDA] border-[#64FFDA]/20 hover:bg-[#64FFDA]/20">
              <Zap className="w-3 h-3 mr-1" />
              Professional Collaboration Platform
            </Badge>
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
                Collaborate{" "}
                <span className="text-[#0A8B8B] dark:text-[#64FFDA]">
                  Smarter.
                </span>
                <br />
                Deliver{" "}
                <span className="text-[#0A8B8B] dark:text-[#64FFDA]">
                  Faster.
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed">
                SkillSync brings clients and freelancers together on one
                powerful platform. Manage projects, track milestones, process
                payments, and collaborate seamlessly.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-[#64FFDA] text-[#0A192F] hover:bg-[#64FFDA]/90 font-semibold group shadow-lg shadow-[#64FFDA]/20 cursor-pointer"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white cursor-pointer"
              >
                Watch Demo
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-[#64FFDA] to-[#64FFDA]/60 border-2 border-[#0A192F]"
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    2,000+
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Active Users
                  </div>
                </div>
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1 font-semibold text-gray-900 dark:text-white">
                  <Star className="w-4 h-4 fill-[#64FFDA] text-[#64FFDA]" />
                  4.9/5
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  User Rating
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-[#64FFDA]/10 rounded-3xl blur-3xl" />
            <Card className="relative border border-gray-200 dark:border-white/10 shadow-2xl bg-white dark:bg-[#112240]">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className="bg-[#64FFDA]/10 text-[#0A8B8B] dark:text-[#64FFDA] border-[#64FFDA]/20">
                    Active Project
                  </Badge>
                  <Badge className="bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10">
                    In Progress
                  </Badge>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    E-Commerce Website Redesign
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Full-stack development with modern UI/UX
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Budget
                    </div>
                    <div className="font-semibold text-[#0A8B8B] dark:text-[#64FFDA]">
                      $12,500
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Timeline
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      6 weeks
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Progress
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      67%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#64FFDA] w-2/3 rounded-full" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-[#64FFDA] text-[#0A192F] hover:bg-[#64FFDA]/90 cursor-pointer"
                  >
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                  >
                    Message Client
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
