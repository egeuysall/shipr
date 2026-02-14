"use client";

import HeroSection from "@/components/hero-section-1";
import LogoCloud from "@/components/logo-cloud-2";
import Features from "@/components/features-3";
import Integrations from "@/components/integrations-1";
import Stats from "@/components/stats-2";
import Testimonials from "@/components/testimonials-3";
import FAQs from "@/components/faqs-2";
import CallToAction from "@/components/call-to-action-1";
import { PricingTable } from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";

export default function LandingPage() {
  return (
    <div className="[&_h1]:font-[family-name:var(--font-pixel-square)] [&_h2]:font-[family-name:var(--font-pixel-square)] [&_h3]:font-[family-name:var(--font-pixel-square)]">
      {/* Hero Section */}
      <HeroSection />

      {/* Logo Cloud */}
      <section className="bg-muted/30 py-16 md:py-20 [&_h2]:font-[family-name:var(--font-pixel-square)]">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-12">
            Powered by industry-leading tools
          </h2>
          <LogoCloud />
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <Features />
      </section>

      {/* Integrations */}
      <section className="bg-muted/30 py-16 md:py-24">
        <Integrations />
      </section>

      {/* Stats */}
      <section className="py-16 md:py-24">
        <Stats />
      </section>

      {/* Testimonials */}
      <section className="bg-muted/30 py-16 md:py-24">
        <Testimonials />
      </section>

      {/* Pricing */}
      <section className="py-16 md:py-24" id="pricing">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Start building for free. Upgrade when you&apos;re ready to launch.
            </p>
          </div>
          <div className="[&_.cl-pricingCard]:border [&_.cl-pricingCard]:border-border [&_.cl-pricingCard]:rounded-lg">
            <PricingTable
              appearance={{
                baseTheme: shadcn,
              }}
            />
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-muted/30 py-16 md:py-24">
        <FAQs />
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <CallToAction />
      </section>
    </div>
  );
}
