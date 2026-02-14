import type { Metadata } from "next";
import { PAGE_SEO, SITE_CONFIG } from "@/lib/constants";
import { BreadcrumbJsonLd } from "@/lib/structured-data";

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

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
        <p className="text-muted-foreground text-lg">
          Last updated: February 14, 2026
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Agreement to Terms</h2>
          <p>
            By accessing or using Shipr (&quot;the Service&quot;), you agree to
            be bound by these Terms of Service. If you do not agree to these
            terms, please do not use the Service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Description of Service</h2>
          <p>
            Shipr provides integration and automation services that allow users
            to connect various tools and automate workflows. We reserve the
            right to modify, suspend, or discontinue any part of the Service at
            any time.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">User Accounts</h2>
          <p>
            To use certain features of the Service, you must create an account.
            You are responsible for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>
              Ensuring your account information is accurate and up to date
            </li>
            <li>
              Notifying us immediately of any unauthorized use of your account
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use the Service for any illegal or unauthorized purpose</li>
            <li>Violate any laws in your jurisdiction</li>
            <li>Interfere with or disrupt the Service or servers</li>
            <li>
              Attempt to gain unauthorized access to any part of the Service
            </li>
            <li>
              Use the Service to transmit viruses, malware, or malicious code
            </li>
            <li>Scrape, spider, or crawl the Service</li>
            <li>Impersonate any person or entity</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Payment and Billing</h2>
          <p>
            Paid subscriptions are billed in advance on a monthly or annual
            basis. All fees are non-refundable except as required by law. We
            reserve the right to change our pricing with 30 days notice. Your
            subscription will automatically renew unless you cancel before the
            renewal date.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality
            are owned by Shipr and are protected by international copyright,
            trademark, and other intellectual property laws. You retain
            ownership of any data you submit to the Service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Termination</h2>
          <p>
            We may terminate or suspend your account and access to the Service
            immediately, without prior notice, for any reason, including breach
            of these Terms. Upon termination, your right to use the Service will
            cease immediately.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Disclaimer of Warranties</h2>
          <p>
            The Service is provided &quot;as is&quot; and &quot;as
            available&quot; without warranties of any kind, either express or
            implied. We do not warrant that the Service will be uninterrupted,
            secure, or error-free.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Shipr shall not be liable
            for any indirect, incidental, special, consequential, or punitive
            damages, or any loss of profits or revenues, whether incurred
            directly or indirectly.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will
            notify users of any material changes by posting the new Terms on
            this page and updating the &quot;Last updated&quot; date. Your
            continued use of the Service after changes constitutes acceptance of
            the modified Terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Contact</h2>
          <p>
            If you have questions about these Terms, please contact us through
            our support page.
          </p>
        </section>
      </div>
    </div>
  );
}
