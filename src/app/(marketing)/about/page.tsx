import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PAGE_SEO, SITE_CONFIG } from "@/lib/constants";
import { BreadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: PAGE_SEO.about.title,
  description: PAGE_SEO.about.description,
  keywords: [...PAGE_SEO.about.keywords],
  alternates: {
    canonical: `${SITE_CONFIG.url}/about`,
  },
};

export default function AboutPage(): React.ReactElement {
  return (
    <div className="py-32 md:pt-44">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
      />
      <div className="mx-auto max-w-2xl px-6">
        <div className="text-center">
          <h1 className="text-balance text-4xl font-bold">About Shipr</h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance">
            Building the future of integrations, one connection at a time.
          </p>
        </div>

        <div className="mt-16 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold">Our Mission</h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              We believe connecting tools should be effortless. Our mission is
              to eliminate the complexity of building integrations so teams can
              focus on what truly matters: shipping great products. With Shipr,
              you spend less time on infrastructure and more time creating
              value.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Why We Built Shipr</h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              After years of building integrations from scratch at various
              startups, we experienced the same pain points repeatedly. We knew
              there had to be a better way. Shipr was born from that
              frustration. We created a platform that makes connecting services
              as simple as writing a few lines of code, turning weeks of work
              into minutes.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Get in Touch</h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              Have questions, feedback, or want to partner with us? We&apos;d
              love to hear from you. Whether you&apos;re exploring integrations
              for the first time or looking to scale your existing workflows,
              we&apos;re here to help.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Button
            render={<Link href="mailto:hi@egeuysal.com" />}
            nativeButton={false}
          >
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
}
