import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Shipr",
  description: "Privacy policy for Shipr",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-6 py-16 md:py-24">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
        <p className="text-muted-foreground text-lg">
          Last updated: February 14, 2026
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Introduction</h2>
          <p>
            Welcome to Shipr (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Information We Collect</h2>
          <p>We collect information that you provide directly to us, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Account information (name, email address, password)</li>
            <li>Payment information (processed securely through Clerk Billing)</li>
            <li>Usage data and analytics</li>
            <li>Communication preferences</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Monitor and analyze trends, usage, and activities</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage. We use Clerk for authentication and Convex for data storage, both of which employ industry-standard security practices.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Clerk - Authentication and user management</li>
            <li>Convex - Database and backend services</li>
            <li>Vercel - Hosting and deployment</li>
          </ul>
          <p>
            These services have their own privacy policies governing how they handle your data.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
            <li>Export your data</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us through our support page.
          </p>
        </section>
      </div>
    </div>
  );
}
