"use client";

import HeroSection from "@/components/hero-section-1";
import LogoCloud from "@/components/logo-cloud-2";
import Features from "@/components/features-3";
import Integrations from "@/components/integrations-1";
import Stats from "@/components/stats-2";
import Testimonials from "@/components/testimonials-3";
import FAQs from "@/components/faqs-2";
import CallToAction from "@/components/call-to-action-1";
import Pricing from "@/components/pricing-3";

export default function LandingPage() {
  return (
    <div className="[&_h1]:font-[family-name:var(--font-pixel-square)] [&_h2]:font-[family-name:var(--font-pixel-square)] [&_h3]:font-[family-name:var(--font-pixel-square)]">
      {/* Hero Section */}
      <HeroSection />

      {/* Logo Cloud */}
      <section className="py-8 md:py-12 [&_h2]:font-[family-name:var(--font-pixel-square)]">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-12">
            Used by engineers at
          </h2>
          <LogoCloud />
        </div>
      </section>

      {/* Features */}
      <section className="py-8 md:py-12">
        <Features />
      </section>

      {/* Integrations */}
      <section className="py-8 md:py-12">
        <Integrations />
      </section>

      {/* Stats */}
      <section className="py-8 md:py-12">
        <Stats />
      </section>

      {/* Testimonials */}
      <section className="py-8 md:py-12">
        <Testimonials />
      </section>

      {/* Pricing */}
      <Pricing />

      {/* FAQs */}
      <section className="py-8 md:py-12">
        <FAQs />
      </section>

      {/* CTA */}
      <section className="py-8 md:py-12">
        <CallToAction />
      </section>
    </div>
  );
}
