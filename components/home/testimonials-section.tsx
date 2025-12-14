import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Marketing Director",
      role: "Marketing Director",
      company: "Tech Company",
      content:
        "SkillSync transformed how we work with freelancers. The milestone system ensures accountability, and the payment protection gives us peace of mind.",
      rating: 5,
      avatar: "MD",
      color: "bg-purple-100 text-purple-700",
    },
    {
      name: "UI/UX Designer",
      role: "UI/UX Designer",
      company: "Design Agency",
      content:
        "I've found amazing clients through SkillSync and the platform's project management tools keep everything organized. My income has increased significantly.",
      rating: 5,
      avatar: "UD",
      color: "bg-purple-100 text-purple-700",
    },
    {
      name: "Product Manager",
      role: "Product Manager",
      company: "Software Company",
      content:
        "The transparency and communication tools make remote collaboration seamless. We've completed multiple projects with zero disputes.",
      rating: 5,
      avatar: "PM",
      color: "bg-purple-100 text-purple-700",
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-white to-purple-500/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge className="mx-auto bg-purple-500/10 text-purple-700 border-purple-500/20">
            Testimonials
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-heading">
            Trusted by Professionals
          </h2>
          <p className="text-lg text-body max-w-2xl mx-auto">
            Hear from clients and freelancers who have transformed their
            workflow
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-white border-purple-500/10 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-lg italic text-body">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4 pt-4">
                  <div
                    className={`w-12 h-12 rounded-full ${testimonial.color} flex items-center justify-center font-medium text-lg`}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-primary-heading">
                      {testimonial.name}
                    </div>
                    <div className="text-body">
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
