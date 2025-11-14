import { Badge } from "@/components/ui/badge";

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Create Account",
      description:
        "Sign up as a client or freelancer and set up your professional profile.",
    },
    {
      step: "02",
      title: "Post or Find Projects",
      description:
        "Clients post projects with detailed requirements. Freelancers browse and apply.",
    },
    {
      step: "03",
      title: "Collaborate & Track",
      description:
        "Work together using milestones, tasks, and real-time communication tools.",
    },
    {
      step: "04",
      title: "Complete & Review",
      description:
        "Deliver work, process payments securely, and exchange feedback.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-20 lg:py-32 bg-gray-50 dark:bg-[#112240]/50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge className="mx-auto bg-[#64FFDA]/10 text-[#0A8B8B] dark:text-[#64FFDA] border-[#64FFDA]/20">
            How It Works
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white">
            Simple, Transparent Process
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Get started in minutes and experience seamless collaboration
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {i < 3 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gray-200 dark:bg-white/10" />
              )}
              <div className="space-y-4 relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#64FFDA] to-[#64FFDA]/60 flex items-center justify-center text-3xl font-bold text-[#0A192F]">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
