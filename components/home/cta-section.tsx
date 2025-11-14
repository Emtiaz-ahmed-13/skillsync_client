import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-20 lg:py-32 bg-white dark:bg-[#0A192F] relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#64FFDA]/10 dark:bg-[#64FFDA]/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main CTA Card */}
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#64FFDA] to-[#0A8B8B] dark:from-[#64FFDA] dark:to-[#64FFDA]/60 rounded-2xl blur-lg opacity-20 dark:opacity-30" />

            <div className="relative bg-gradient-to-br from-gray-50 to-blue-50 dark:from-[#112240] dark:to-[#0A192F] border border-gray-200 dark:border-white/10 rounded-2xl p-8 md:p-12 lg:p-16">
              <div className="text-center space-y-8">
                {/* Badge */}
                <div className="flex justify-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#64FFDA]/10 dark:bg-[#64FFDA]/20 border border-[#64FFDA]/20 rounded-full">
                    <Sparkles className="w-4 h-4 text-[#0A8B8B] dark:text-[#64FFDA]" />
                    <span className="text-sm font-semibold text-[#0A8B8B] dark:text-[#64FFDA]">
                      Start Your Free Trial
                    </span>
                  </div>
                </div>

                {/* Heading */}
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                    Ready to Transform Your
                    <span className="block text-[#0A8B8B] dark:text-[#64FFDA]">
                      Workflow?
                    </span>
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Join thousands of freelancers and clients who trust
                    SkillSync for seamless project collaboration and success.
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button
                    size="lg"
                    className="bg-[#64FFDA] text-[#0A192F] hover:bg-[#64FFDA]/90 font-semibold group shadow-lg shadow-[#64FFDA]/25 px-8 cursor-pointer"
                    asChild
                  >
                    <Link href="/auth/register">
                      Start Free Trial
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 px-8 cursor-pointer"
                    asChild
                  >
                    <Link href="/contact">Schedule Demo</Link>
                  </Button>
                </div>

                {/* Features */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 text-sm">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-[#0A8B8B] dark:text-[#64FFDA]" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-[#0A8B8B] dark:text-[#64FFDA]" />
                    <span>14-day free trial</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-[#0A8B8B] dark:text-[#64FFDA]" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-8 mt-12 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                2,000+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Active Users
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                98%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Success Rate
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                $2.5M+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Earnings
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
