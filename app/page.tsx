"use client";

import React from "react";
import Link from "next/link";
import {
  Upload,
  Zap,
  Eye,
  ArrowRight,
  Check,
  Star,
} from "lucide-react";
import { AppBackground } from "@/components/app-background";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@heroui/button";
import { CircularPatterns } from "@/components/ink-splash";
import { TattooExamples } from "@/components/landing/tattoo-examples";
import { PricingSection } from "@/components/landing/pricing-section";
import { FAQ } from "@/components/landing/faq";

export default function LandingPage() {
  return (
    <AppBackground variant="default">
      <div className="relative overflow-hidden">
        <Navbar />
        <CircularPatterns />

        {/* Hero Section */}
        <section className="pt-16 pb-16 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight font-sans">
                <span className="font-cursive font-bold text-5xl md:text-7xl">
                  See Your Tattoo
                </span>
                <br />
                <span className="font-sans">Before You Ink</span>
              </h1>
              <p className="text-xl md:text-2xl text-default-500 mb-8 max-w-3xl mx-auto font-medium">
                Upload your body part photo and tattoo design. Our AI shows you
                exactly how it&lsquo;ll look in real life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button color="primary" variant="shadow" size="lg" as={Link} href="/dashboard" className="flex items-center gap-2">
                  <span>Start Now - Free</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

          </div>
        </section>

        {/* Full Width Tattoo Examples */}
        <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-content1/50">
          <TattooExamples />
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-20 px-4 sm:px-6 lg:px-8 bg-content2 border-t-4 border-divider relative z-10"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-6 font-sans">
                <span className="font-cursive font-bold">Powered by</span> AI
                Technology
              </h2>
              <p className="text-xl text-default-600 max-w-3xl mx-auto font-medium">
                Professional-grade tattoo visualization that artists and clients
                trust
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-content1 p-8 border-2 border-divider rounded-2xl hover:bg-content2 transition-colors shadow-lg">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6">
                  <Upload className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  Smart Upload
                </h3>
                <p className="text-default-600 mb-6 font-medium min-h-[72px]">
                  Upload any body part photo. Our AI detects skin tone, curves,
                  and optimal placement zones automatically.
                </p>
                <ul className="space-y-2 text-sm text-default-500">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Auto skin detection</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Perfect positioning</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Size optimization</span>
                  </li>
                </ul>
              </div>

              <div className="bg-content1 p-8 border-2 border-divider rounded-2xl hover:bg-content2 transition-colors shadow-lg">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  Design Generator
                </h3>
                <p className="text-default-600 mb-6 font-medium min-h-[72px]">
                  Upload your design or generate new ones. AI creates tattoos
                  that fit your body&lsquo;s natural contours.
                </p>
                <ul className="space-y-2 text-sm text-default-500">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Custom generation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Style matching</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Perfect scaling</span>
                  </li>
                </ul>
              </div>

              <div className="bg-content1 p-8 border-2 border-divider rounded-2xl hover:bg-content2 transition-colors shadow-lg">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6">
                  <Eye className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  Realistic Preview
                </h3>
                <p className="text-default-600 mb-6 font-medium min-h-[72px]">
                  See exactly how your tattoo will look with realistic shadows,
                  skin integration, and lighting.
                </p>
                <ul className="space-y-2 text-sm text-default-500">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Real-time rendering</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Skin tone matching</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>HD quality output</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section
          id="how-it-works"
          className="py-20 px-4 sm:px-6 lg:px-8 border-t-4 border-divider relative z-10"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-6 font-sans">
                <span className="font-cursive font-bold">Simple</span> Process
              </h2>
              <p className="text-xl text-default-600 font-medium">
                Get your tattoo preview in under 2 minutes
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-black shadow-lg">
                  1
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  Upload Photo
                </h3>
                <p className="text-default-600 font-medium">
                  Take or upload a clear photo of where you want your tattoo
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-black shadow-lg">
                  2
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  Add Design
                </h3>
                <p className="text-default-600 font-medium">
                  Upload your tattoo design or generate one with our AI
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-black shadow-lg">
                  3
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  See Results
                </h3>
                <p className="text-default-600 font-medium">
                  AI overlays your design with photorealistic precision
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section
          id="reviews"
          className="py-20 px-4 sm:px-6 lg:px-8 bg-content2 border-t-4 border-divider relative z-10"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-6 font-sans">
                <span className="font-cursive font-bold">Trusted by</span>{" "}
                Tattoo Artists
              </h2>
              <div className="flex items-center justify-center space-x-2 mb-8">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-warning text-warning" />
                ))}
                <span className="text-xl font-bold ml-2 text-foreground">
                  4.9/5 from 25,000+ users
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-content1 p-8 border-2 border-divider rounded-2xl shadow-lg">
                <div className="flex items-center space-x-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-warning text-warning"
                    />
                  ))}
                </div>
                <p className="text-default-600 mb-6 font-medium">
                  &quot;Game changer! I could see exactly how my sleeve would
                  look before booking. Saved me from making a huge
                  mistake.&quot;
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold">
                    M
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Mike Chen</p>
                    <p className="text-sm text-default-500">Tattoo Collector</p>
                  </div>
                </div>
              </div>

              <div className="bg-content1 p-8 border-2 border-divider rounded-2xl shadow-lg">
                <div className="flex items-center space-x-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-warning text-warning"
                    />
                  ))}
                </div>
                <p className="text-default-600 mb-6 font-medium">
                  &quot;As a tattoo artist, this tool helps me show clients
                  exactly what their piece will look like. Essential for
                  consultations.&quot;
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold">
                    S
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Sarah Martinez</p>
                    <p className="text-sm text-default-500">
                      Professional Artist
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-content1 p-8 border-2 border-divider rounded-2xl shadow-lg">
                <div className="flex items-center space-x-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-warning text-warning"
                    />
                  ))}
                </div>
                <p className="text-default-600 mb-6 font-medium">
                  &quot;The realism is incredible! Tried 20+ designs and found
                  the perfect one. My artist was impressed with the
                  accuracy.&quot;
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold">
                    A
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Alex Rivera</p>
                    <p className="text-sm text-default-500">First Tattoo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <PricingSection />

        {/* FAQ Section */}
        <FAQ />

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t-4 border-divider relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-black mb-6 font-sans">
              <span className="font-cursive font-bold">Ready to See Your</span>
              <br />
              <span className="font-sans">Perfect Tattoo?</span>
            </h2>
            <p className="text-xl text-default-600 mb-8 max-w-2xl mx-auto font-medium">
              Join thousands who&lsquo;ve found their ideal ink with AI
              technology. No commitment, instant results.
            </p>
            <Link
              href="/dashboard"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-12 py-6 rounded-2xl font-black text-xl transition-colors flex items-center space-x-3 mx-auto shadow-xl w-fit"
            >
              <span>Try TattooTraceAI Free</span>
              <ArrowRight className="w-6 h-6" />
            </Link>
            <p className="text-sm text-default-500 mt-4 font-medium">
              Free trial • No signup required • Instant preview
            </p>
          </div>
        </section>

        <Footer />
      </div>
    </AppBackground>
  );
}
