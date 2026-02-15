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
    question: "What is included out of the box?",
    answer:
      "Shipr includes Next.js, Convex, Clerk, full auth and database connections, a production dashboard, documentation-ready structure, secure file uploads with shareable links, and prewired analytics.",
  },
  {
    question: "Does Shipr include analytics and product insights?",
    answer:
      "Yes. PostHog, Vercel Analytics, and Vercel Speed Insights are integrated so you can track behavior and performance from day one.",
  },
  {
    question: "Can I build AI features quickly?",
    answer:
      "Yes. Shipr includes Vercel AI SDK support so you can implement chat, copilots, and AI workflows without wiring everything from scratch.",
  },
  {
    question: "How are security and file uploads handled?",
    answer:
      "Shipr follows strong security defaults and includes file uploads with shareable links, so you can ship user-facing file flows safely and quickly.",
  },
  {
    question: "Can I customize and scale after launch?",
    answer:
      "Absolutely. You get a clean, extensible codebase that is ready to customize for your product and scale as usage grows.",
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
            Trusted by teams at leading companies
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
