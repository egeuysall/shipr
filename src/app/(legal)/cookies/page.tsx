import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | Shipr",
  description: "Cookie policy for Shipr",
};

export default function CookiesPage() {
  return (
    <div className="container mx-auto max-w-4xl px-6 py-16 md:py-24">
      <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
        <p className="text-muted-foreground text-lg">
          Last updated: February 14, 2026
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">What Are Cookies</h2>
          <p>
            Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">How We Use Cookies</h2>
          <p>We use cookies for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Essential Cookies:</strong> These are necessary for the website to function properly, including authentication and security features provided by Clerk.
            </li>
            <li>
              <strong>Analytics Cookies:</strong> We use these to understand how visitors interact with our website, helping us improve our service.
            </li>
            <li>
              <strong>Preference Cookies:</strong> These remember your settings and preferences, such as theme selection and language preferences.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Third-Party Cookies</h2>
          <p>We use the following third-party services that may set cookies:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Clerk:</strong> For authentication and user management. Clerk uses cookies to maintain your login session and security.
            </li>
            <li>
              <strong>Vercel:</strong> Our hosting provider uses cookies for analytics and performance monitoring.
            </li>
          </ul>
          <p>
            These third-party services have their own cookie policies, which we encourage you to review.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Types of Cookies We Use</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Session Cookies</h3>
              <p>
                These are temporary cookies that expire when you close your browser. They help us maintain your session as you navigate through our website.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Persistent Cookies</h3>
              <p>
                These remain on your device for a set period or until you delete them. They help us remember your preferences and provide a personalized experience.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Managing Cookies</h2>
          <p>
            You can control and manage cookies in various ways. Most web browsers automatically accept cookies, but you can modify your browser settings to decline cookies if you prefer. Please note that disabling cookies may affect the functionality of our service.
          </p>
          <p>To manage cookies, you can:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Adjust your browser settings to block or delete cookies</li>
            <li>Use browser extensions that manage cookie preferences</li>
            <li>Clear cookies from your browser's settings menu</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Do Not Track</h2>
          <p>
            Some browsers have a "Do Not Track" feature that signals to websites that you do not want to have your online activity tracked. We currently do not respond to Do Not Track signals.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time to reflect changes in our practices or for legal reasons. We will notify you of any material changes by posting the updated policy on this page with a new "Last updated" date.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Contact Us</h2>
          <p>
            If you have questions about our use of cookies, please contact us through our support page.
          </p>
        </section>
      </div>
    </div>
  );
}
