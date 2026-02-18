import type { Metadata } from "next";
import { PAGE_SEO, SITE_CONFIG } from "@/lib/constants";
import { BreadcrumbJsonLd } from "@/lib/structured-data";
import { LEGAL_LAST_UPDATED, LEGAL_STACK_SUMMARY } from "../legal-content";

export const metadata: Metadata = {
  title: PAGE_SEO.terms.title,
  description: PAGE_SEO.terms.description,
  alternates: {
    canonical: `${SITE_CONFIG.url}/terms`,
  },
};

export default function TermsPage(): React.ReactElement {
  return (
    <div className="container mx-auto max-w-4xl px-6 py-16 md:py-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Terms of Service", href: "/terms" },
        ]}
      />
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 [&_section_li]:text-muted-foreground [&_section_li]:text-sm [&_section_li]:leading-relaxed [&_section_p]:text-muted-foreground [&_section_p]:text-sm [&_section_p]:leading-relaxed [&_section_strong]:text-foreground [&_section_strong]:font-semibold [&_section_a]:text-foreground [&_section_a]:font-medium [&_section_a:hover]:underline">
        <p className="text-muted-foreground text-lg">
          Last updated: {LEGAL_LAST_UPDATED}
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Agreement to Terms</h2>
          <p>
            By accessing or using Shipr, you agree to these Terms of Service. If
            you do not agree, do not use the service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Service Description</h2>
          <p>
            Shipr is a SaaS starter and web application platform built on{" "}
            {LEGAL_STACK_SUMMARY}. Features include authentication, dashboard
            tooling, file upload flows, analytics instrumentation, monitoring,
            and related developer utilities.
          </p>
          <p>
            We may add, remove, or change features over time to improve
            reliability, security, and product fit.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Accounts and Access</h2>
          <p>
            Some features require an account. Authentication and session
            management are handled by Clerk. You are responsible for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Maintaining secure credentials and session access</li>
            <li>Activity that occurs under your account</li>
            <li>Providing accurate and current account details</li>
            <li>Notifying us promptly about unauthorized account use</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Acceptable Use</h2>
          <p>You must not:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use the service for illegal, fraudulent, or abusive activity</li>
            <li>Attempt unauthorized access to accounts, APIs, or infrastructure</li>
            <li>
              Interfere with service availability or degrade other users&apos;
              access
            </li>
            <li>Upload or transmit malware, exploit code, or harmful payloads</li>
            <li>
              Abuse automation or scraping in ways that violate law or policy
            </li>
            <li>Reverse engineer or misuse security controls</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Data, Files, and Content</h2>
          <p>
            You keep ownership of content and files you submit. You grant us a
            limited license to host, process, and transmit that content only as
            needed to provide the service.
          </p>
          <p>
            You are responsible for ensuring you have rights to upload,
            process, and share any content you submit.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Billing and Paid Features</h2>
          <p>
            If paid plans are enabled, billing and subscription surfaces are
            handled through Clerk-hosted billing components. Pricing, renewal,
            and cancellation terms shown at checkout apply to your subscription.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Security and Abuse Prevention</h2>
          <p>
            We use layered safeguards such as route protection, CSP/security
            headers, payload validation, rate limiting on sensitive endpoints,
            and error monitoring. You agree not to bypass these controls.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Availability and Changes</h2>
          <p>
            We aim for reliable service but do not guarantee uninterrupted
            availability. We may perform maintenance, roll out upgrades, or
            adjust integrations as needed.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Termination</h2>
          <p>
            We may suspend or terminate access for violations of these terms,
            security threats, legal requirements, or prolonged abuse. You may
            stop using the service at any time.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Disclaimers</h2>
          <p>
            The service is provided on an &quot;as is&quot; and &quot;as
            available&quot; basis. To the maximum extent permitted by law, we
            disclaim warranties not expressly stated in these terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Shipr is not liable for
            indirect, incidental, special, consequential, exemplary, or punitive
            damages, or loss of profits, revenue, data, or goodwill.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Changes to These Terms</h2>
          <p>
            We may update these terms as the product and legal requirements
            evolve. Continued use after updates means you accept the revised
            terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Contact</h2>
          <p>
            Questions about these terms can be sent to{" "}
            <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
