import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-purple-500/5 via-white to-purple-900/5 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main CTA Card */}
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-purple-700/20 rounded-2xl blur-lg opacity-30" />

            <div className="relative bg-gradient-to-br from-purple-500/5 to-purple-900/5 border border-purple-500/20 rounded-2xl p-8 md:p-12 lg:p-16 shadow-xl">
              <div className="text-center space-y-8">
                {/* Badge */}
                <div className="flex justify-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
                    <Sparkles className="w-4 h-4 text-purple-700" />
                    <span className="text-sm font-medium text-purple-700">
                      Start Your Free Trial
                    </span>
                  </div>
                </div>

                {/* Heading */}
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-heading leading-tight">
                    Ready to Transform Your
                    <span className="block text-purple-700">Workflow?</span>
                  </h2>
                  <p className="text-lg text-body max-w-2xl mx-auto">
                    Join thousands of freelancers and clients who trust
                    SkillSync for seamless project collaboration and success.
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button
                    size="lg"
                    className="bg-purple-700 text-white hover:bg-purple-800 font-medium group shadow-lg hover:shadow-xl px-8 py-6 text-base cursor-pointer transition-all"
                    asChild
                  >
                    <Link href="/auth/register">
                      Start Free Trial
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-purple-700 text-purple-700 hover:bg-purple-500/10 px-8 py-6 text-base cursor-pointer"
                    asChild
                  >
                    <Link href="/contact">Schedule Demo</Link>
                  </Button>
                </div>

                {/* Features */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8 text-base">
                  <div className="flex items-center gap-2 text-body">
                    <CheckCircle2 className="w-5 h-5 text-purple-700" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2 text-body">
                    <CheckCircle2 className="w-5 h-5 text-purple-700" />
                    <span>14-day free trial</span>
                  </div>
                  <div className="flex items-center gap-2 text-body">
                    <CheckCircle2 className="w-5 h-5 text-purple-700" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-8 mt-16 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-700 mb-2">
                2,000+
              </div>
              <div className="text-secondary">Active Users</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-700 mb-2">
                98%
              </div>
              <div className="text-secondary">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-700 mb-2">
                $2.5M+
              </div>
              <div className="text-secondary">Total Earnings</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
