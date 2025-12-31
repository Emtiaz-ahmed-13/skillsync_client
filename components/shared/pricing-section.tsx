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
    <section className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge className="mx-auto bg-muted text-foreground border-border">
            Pricing
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the plan that works best for you and your team
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative border-border rounded-xl ${
                plan.popular
                  ? "ring-2 ring-primary bg-gradient-to-b from-muted/50 to-transparent"
                  : "bg-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="pt-8 pb-6 text-center">
                <h3 className="text-2xl font-bold text-foreground">
                  {plan.name}
                </h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-muted-foreground">
                      /{plan.period}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground mt-3">{plan.description}</p>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start gap-3 text-muted-foreground"
                    >
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full py-6 text-base ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border-border text-foreground hover:bg-accent"
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-16 text-muted-foreground">
          <p>All plans include a 14-day free trial. No credit card required.</p>
        </div>
      </div>
    </section>
  );
}
