import type { Metadata } from "next";
import { PAGE_SEO, SITE_CONFIG } from "@/lib/constants";
import { BreadcrumbJsonLd } from "@/lib/structured-data";
import { LEGAL_LAST_UPDATED } from "../legal-content";

export const metadata: Metadata = {
  title: PAGE_SEO.cookies.title,
  description: PAGE_SEO.cookies.description,
  alternates: {
    canonical: `${SITE_CONFIG.url}/cookies`,
  },
};

export default function CookiesPage(): React.ReactElement {
  return (
    <div className="container mx-auto max-w-4xl px-6 py-16 md:py-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Cookie Policy", href: "/cookies" },
        ]}
      />
      <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 [&_section_li]:text-muted-foreground [&_section_li]:text-sm [&_section_li]:leading-relaxed [&_section_p]:text-muted-foreground [&_section_p]:text-sm [&_section_p]:leading-relaxed [&_section_strong]:text-foreground [&_section_strong]:font-semibold [&_section_a]:text-foreground [&_section_a]:font-medium [&_section_a:hover]:underline">
        <p className="text-muted-foreground text-lg">
          Last updated: {LEGAL_LAST_UPDATED}
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">How We Use Cookies and Similar Storage</h2>
          <p>
            Shipr uses cookies and similar browser storage to keep accounts
            signed in, secure authentication flows, measure product usage, and
            improve performance.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Categories We Use</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Strictly necessary cookies:</strong> used by Clerk for
              sign-in, account session continuity, and security controls.
            </li>
            <li>
              <strong>Analytics cookies:</strong> used by PostHog for event
              analytics and user interaction metrics.
            </li>
            <li>
              <strong>Performance measurement:</strong> Vercel Analytics and
              Vercel Speed Insights may set identifiers to measure page
              performance and traffic trends.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Technology-Specific Notes</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Clerk:</strong> manages authentication/session cookies
              required for protected routes and account access.
            </li>
            <li>
              <strong>PostHog:</strong> may set browser identifiers (for example
              keys prefixed with <code>ph_</code>) when analytics is enabled.
            </li>
            <li>
              <strong>Vercel Analytics / Speed Insights:</strong> collect usage
              and performance telemetry with lightweight client instrumentation.
            </li>
            <li>
              <strong>Theme preference:</strong> dark/light mode preference is
              stored via browser storage (localStorage), not a dedicated cookie.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Third-Party Context</h2>
          <p>
            Some cookie and telemetry behavior is controlled by third-party
            providers (Clerk, PostHog, Vercel). Their policies also apply to
            data they process.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">How to Control Cookies</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Block or delete cookies in your browser settings</li>
            <li>Clear site data (cookies and local storage) for this domain</li>
            <li>Use privacy tools/extensions to limit analytics tracking</li>
          </ul>
          <p>
            If you disable necessary cookies, login and protected dashboard
            features may not work correctly.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Do Not Track</h2>
          <p>
            Browser &quot;Do Not Track&quot; behavior is not consistently
            standardized across vendors. We currently do not implement a
            separate Do Not Track response mechanism.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Policy Updates</h2>
          <p>
            We may update this policy when we change analytics providers,
            authentication flows, infrastructure, or legal requirements.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Contact</h2>
          <p>
            Questions about cookies can be sent to{" "}
            <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
