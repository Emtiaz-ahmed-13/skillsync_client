import { BlogSection } from "@/components/home/blog-section";
import { CTASection } from "@/components/home/cta-section";
import { FAQSection } from "@/components/home/faq-section";
import { FeaturesSection } from "@/components/home/features-section";
import { HeroSection } from "@/components/home/hero-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { Navbar } from "@/components/home/navbar";
import { PricingSection } from "@/components/home/pricing-section";
import { StatsSection } from "@/components/home/stats-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white bg-dot-pattern text-gray-900">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <BlogSection />
      <CTASection />
    </div>
  );
}
