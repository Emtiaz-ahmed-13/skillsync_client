"use client";

import { BlogSection } from "../components/home/blog-section";
import { CTASection } from "../components/home/cta-section";
import { FAQSection } from "../components/home/faq-section";
import { FeaturesSection } from "../components/home/features-section";
import { HeroSection } from "../components/home/hero-section";
import { HowItWorksSection } from "../components/home/how-it-works-section";
import { Navbar } from "../components/home/navbar";
import { PricingSection } from "../components/home/pricing-section";
import { StatsSection } from "../components/home/stats-section";
import { TestimonialsSection } from "../components/home/testimonials-section";
import { BackgroundRippleEffect } from "../components/ui/background-ripple-effect";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* NAVBAR */}
      <Navbar />

      {/* BACKGROUND (FULL SCREEN, NO PADDING) */}
      <div className="absolute inset-0 z-0">
        <BackgroundRippleEffect />
      </div>

      {/* CONTENT (OFFSET ONLY ONCE) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="space-y-24 pb-24">
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
      </div>
    </div>
  );
}
