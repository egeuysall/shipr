import type { Metadata } from "next";
import HeroSection from "@/components/hero-section-1";
import LogoCloud from "@/components/logo-cloud-2";
import Features from "@/components/features-3";
import Integrations from "@/components/integrations-1";
import Stats from "@/components/stats-2";
import Testimonials from "@/components/testimonials-3";
import Pricing from "@/components/pricing-3";
import FAQs from "@/components/faqs-2";
import CallToAction from "@/components/call-to-action-1";
import { FaqJsonLd, SoftwareApplicationJsonLd } from "@/lib/structured-data";
import { PAGE_SEO, SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: PAGE_SEO.home.title,
  description: PAGE_SEO.home.description,
  keywords: [...PAGE_SEO.home.keywords],
  alternates: {
    canonical: SITE_CONFIG.url,
  },
};

const faqItems = [
  {
    question: "How does the free trial work?",
    answer:
      "Start with a 14-day free trial with full access to all features. No credit card required. You can upgrade to a paid plan at any time during or after the trial.",
  },
  {
    question: "Can I change my plan later?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the difference.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, and bank transfers for annual plans. Enterprise customers can also pay via invoice.",
  },
  {
    question: "Is there a setup fee?",
    answer:
      "No, there are no setup fees or hidden costs. You only pay for your subscription plan.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 30-day money-back guarantee. If you're not satisfied, contact us within 30 days for a full refund.",
  },
];

export default function LandingPage(): React.ReactElement {
  return (
    <div>
      <SoftwareApplicationJsonLd />
      <FaqJsonLd items={faqItems} />

      {/* Hero Section */}
      <HeroSection />

      {/* Logo Cloud */}
      <section className="pt-8 md:pt-12 [&_h2]:font-[family-name:var(--font-pixel-square)]">
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
