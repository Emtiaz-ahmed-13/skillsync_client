import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      period: "forever",
      description: "Perfect for individuals getting started",
      features: [
        "Up to 3 active projects",
        "Basic milestone management",
        "File sharing (1GB storage)",
        "Email support",
        "Standard security",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Professional",
      price: "$29",
      period: "per month",
      description: "Ideal for growing businesses and teams",
      features: [
        "Unlimited projects",
        "Advanced milestone tracking",
        "File sharing (10GB storage)",
        "Priority support",
        "Enhanced security",
        "Team collaboration (up to 5 members)",
        "Time tracking",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations with complex needs",
      features: [
        "Everything in Professional",
        "Unlimited team members",
        "Custom storage solutions",
        "24/7 dedicated support",
        "Enterprise-grade security",
        "Custom integrations",
        "SLA guarantees",
        "Personal account manager",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-white dark:bg-[#0A192F]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge className="mx-auto bg-[#64FFDA]/10 text-[#0A8B8B] dark:text-[#64FFDA] border-[#64FFDA]/20">
            Pricing
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Choose the plan that works best for you and your team
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative border-gray-200 dark:border-white/10 ${
                plan.popular
                  ? "ring-2 ring-[#64FFDA] bg-gradient-to-b from-[#64FFDA]/5 to-transparent dark:from-[#64FFDA]/10"
                  : "bg-white dark:bg-[#112240]"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-[#64FFDA] text-[#0A192F]">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="pt-8 pb-4 text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {plan.name}
                </h3>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-gray-600 dark:text-gray-400">
                      /{plan.period}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {plan.description}
                </p>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start gap-2 text-gray-600 dark:text-gray-400"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[#64FFDA] mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-[#64FFDA] text-[#0A192F] hover:bg-[#64FFDA]/90"
                      : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12 text-sm text-gray-600 dark:text-gray-400">
          <p>All plans include a 14-day free trial. No credit card required.</p>
        </div>
      </div>
    </section>
  );
}
