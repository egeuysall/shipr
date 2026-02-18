import type { Metadata } from "next";
import { PAGE_SEO, SITE_CONFIG } from "@/lib/constants";
import { BreadcrumbJsonLd } from "@/lib/structured-data";
import {
  LEGAL_LAST_UPDATED,
  LEGAL_PROCESSORS,
  LEGAL_STACK_SUMMARY,
} from "../legal-content";

export const metadata: Metadata = {
  title: PAGE_SEO.privacy.title,
  description: PAGE_SEO.privacy.description,
  alternates: {
    canonical: `${SITE_CONFIG.url}/privacy`,
  },
};

export default function PrivacyPage(): React.ReactElement {
  return (
    <div className="container mx-auto max-w-4xl px-6 py-16 md:py-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Privacy Policy", href: "/privacy" },
        ]}
      />
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 [&_section_li]:text-muted-foreground [&_section_li]:text-sm [&_section_li]:leading-relaxed [&_section_p]:text-muted-foreground [&_section_p]:text-sm [&_section_p]:leading-relaxed [&_section_strong]:text-foreground [&_section_strong]:font-semibold [&_section_a]:text-foreground [&_section_a]:font-medium [&_section_a:hover]:underline">
        <p className="text-muted-foreground text-lg">
          Last updated: {LEGAL_LAST_UPDATED}
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Scope</h2>
          <p>
            This policy explains how Shipr collects, uses, and protects personal
            data when you use our website, authentication flows, dashboard, file
            uploads, analytics-enabled UI, and API routes.
          </p>
          <p>Current production stack covered by this policy: {LEGAL_STACK_SUMMARY}.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Data We Collect</h2>
          <p>Depending on the feature you use, we process the following data:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Account and identity data:</strong> user ID, name, email,
              and session metadata via Clerk.
            </li>
            <li>
              <strong>Application data:</strong> records you create in the app
              and related metadata stored in Convex.
            </li>
            <li>
              <strong>Uploaded files:</strong> file content, file name, MIME
              type, and size for file upload features backed by Convex storage.
            </li>
            <li>
              <strong>Product analytics:</strong> events and page-level
              interactions collected through PostHog.
            </li>
            <li>
              <strong>Performance telemetry:</strong> web vitals and performance
              metrics from Vercel Analytics and Vercel Speed Insights.
            </li>
            <li>
              <strong>Error and diagnostic data:</strong> crash/error context
              and stack traces through Sentry.
            </li>
            <li>
              <strong>Email delivery metadata:</strong> recipient, template, and
              send status for transactional email sent through Resend.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">How We Collect Data</h2>
          <p>
            We collect data from:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Information you provide directly in forms and app inputs</li>
            <li>Authentication and session flows handled by Clerk</li>
            <li>Client-side telemetry scripts and SDKs configured in the app</li>
            <li>Server-side logs and monitoring pipelines</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            Why We Use Your Information
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Authenticate users and secure private dashboard routes</li>
            <li>Store and serve app data and uploaded files</li>
            <li>Operate transactional emails and account notifications</li>
            <li>Measure feature usage and improve product UX</li>
            <li>Detect, investigate, and resolve errors and abuse</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Processors We Use</h2>
          <ul className="list-disc pl-6 space-y-2">
            {LEGAL_PROCESSORS.map((processor) => (
              <li key={processor.name}>
                <strong>{processor.name}:</strong> {processor.purpose}.
              </li>
            ))}
          </ul>
          <p>
            These providers process data under their own terms and privacy
            policies.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Security Controls</h2>
          <p>
            Shipr applies technical controls such as route protection with
            Clerk, CSP and transport/security headers in middleware, payload
            validation on API routes, and endpoint-specific rate limits (for
            example, the email API route is limited per IP).
          </p>
          <p>
            No system is completely risk-free, but we continuously improve
            safeguards and monitoring coverage.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Data Retention and Deletion</h2>
          <p>
            We retain data for as long as needed to operate the service,
            maintain security/audit history, and comply with legal obligations.
            You can request account or data deletion by contacting us.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Your Privacy Choices</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access and update account data through your account settings</li>
            <li>Request export or deletion of your personal data</li>
            <li>Control analytics and cookie behavior in browser settings</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Contact</h2>
          <p>
            For privacy requests or questions, contact{" "}
            <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Policy Updates</h2>
          <p>
            We update this policy when product architecture, processors, or
            legal obligations change. Material changes are published on this
            page with a new &quot;Last updated&quot; date.
          </p>
        </section>
      </div>
    </div>
  );
}
