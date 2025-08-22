"use client";

import React from "react";
import { AppBackground } from "@/components/app-background";
import { Navbar } from "@/components/navbar";
import { CircularPatterns } from "@/components/ink-splash";
import { HeroSection } from "@/components/landing/hero-section";
import { TattooExamples } from "@/components/landing/tattoo-examples";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FAQ } from "@/components/landing/faq";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/footer";

export default function LandingPage() {
  return (
    <AppBackground variant="default">
      <div className="relative overflow-hidden">
        <Navbar />
        <CircularPatterns />

        {/* Hero Section */}
        <HeroSection />

        {/* Full Width Tattoo Examples */}
        <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-content1/50 mb-8 sm:mb-12 lg:mb-16">
          <TattooExamples />
        </section>

        {/* Features Section */}
        <FeaturesSection />

        {/* How It Works */}
        <HowItWorksSection />

        {/* Social Proof */}
        <TestimonialsSection />

        {/* Pricing Section */}
        <PricingSection />

        {/* FAQ Section */}
        <FAQ />

        {/* CTA Section */}
        <CTASection />

        <Footer />
      </div>
    </AppBackground>
  );
}
