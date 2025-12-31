import { Badge } from "@/components/ui/badge";

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Create Account",
      description:
        "Sign up as a client or freelancer and set up your professional profile with skills and portfolio.",
      color: "text-primary bg-primary/10",
    },
    {
      step: "02",
      title: "Find Projects",
      description:
        "Browse projects by category, skills, or budget. Filter and search to find perfect matches or post your own requirements.",
      color: "text-primary bg-primary/10",
    },
    {
      step: "03",
      title: "Collaborate",
      description:
        "Work together with built-in messaging, file sharing, milestone tracking, and real-time project updates.",
      color: "text-primary bg-primary/10",
    },
    {
      step: "04",
      title: "Get Paid",
      description:
        "Complete milestones, receive secure payments, and build your reputation with verified reviews.",
      color: "text-primary bg-primary/10",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-20 bg-gradient-to-b from-primary/5 to-background"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge className="mx-auto bg-primary/10 text-primary border-border">
            How It Works
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Simple, Transparent Process
          </h2>
          <p className="text-lg text-muted-foreground">
            Get started in minutes and experience seamless collaboration
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative group">
              <div className="space-y-4 p-6 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                <div
                  className={`w-14 h-14 rounded-full ${step.color} flex items-center justify-center text-lg font-bold border border-border`}
                >
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
