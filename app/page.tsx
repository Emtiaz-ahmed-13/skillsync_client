"use client";

import { ArticlesSection } from "@/components/shared/articles-section";
import { CTASection } from "@/components/shared/cta-section";
import { FAQSection } from "@/components/shared/faq-section";
import { FeaturesSection } from "@/components/shared/features-section";
import { HeroSection } from "@/components/shared/hero-section";
import { HowItWorksSection } from "@/components/shared/how-it-works-section";
import { Navbar } from "@/components/shared/navbar";
import { PricingSection } from "@/components/shared/pricing-section";
import { StatsSection } from "@/components/shared/stats-section";
import { TestimonialsSection } from "@/components/shared/testimonials-section";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <div className="pt-20"> 
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <ArticlesSection/>
        <CTASection />
      </div>
    </div>
  );
}
