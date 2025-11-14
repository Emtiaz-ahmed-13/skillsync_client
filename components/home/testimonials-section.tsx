import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechStart Inc.",
      content:
        "SkillSync transformed how we work with freelancers. The milestone system ensures accountability, and the payment protection gives us peace of mind.",
      rating: 5,
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      role: "UI/UX Designer",
      company: "Freelance Professional",
      content:
        "I've found amazing clients through SkillSync and the platform's project management tools keep everything organized. My income has increased by 40%.",
      rating: 5,
      avatar: "MC",
    },
    {
      name: "Emma Rodriguez",
      role: "Product Manager",
      company: "Global Solutions",
      content:
        "The transparency and communication tools make remote collaboration seamless. We've completed 12 projects with zero disputes.",
      rating: 5,
      avatar: "ER",
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-gray-50 dark:bg-[#112240]/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge className="mx-auto bg-[#64FFDA]/10 text-[#0A8B8B] dark:text-[#64FFDA] border-[#64FFDA]/20">
            Testimonials
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white">
            Trusted by Professionals
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Hear from clients and freelancers who have transformed their
            workflow
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-white dark:bg-[#112240] border-gray-200 dark:border-white/10"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-[#64FFDA] text-[#64FFDA]"
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3 pt-4">
                  <div className="w-10 h-10 rounded-full bg-[#64FFDA]/10 flex items-center justify-center text-[#0A8B8B] dark:text-[#64FFDA] font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
