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
            Shipr is a free, open-source SaaS starter built to help you launch
            in a weekend.
          </p>
        </div>

        <div className="mt-16 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold">Our Mission</h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              We believe great ideas should not be blocked by boilerplate. Our
              mission is to give founders and teams a production-ready base so
              they can spend time on product, not setup.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Why We Built Shipr</h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              After rebuilding auth, database, dashboards, analytics, uploads,
              and docs across multiple projects, the same pattern kept
              repeating. Shipr was created to remove that waste and turn weeks
              of setup into a fast path to launch.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Open Source First</h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              Shipr is fully free and open source at{" "}
              <Link
                href="https://github.com/egeuysall/shipr"
                className="text-primary font-medium hover:underline"
              >
                github.com/egeuysall/shipr
              </Link>
              . You can use it, fork it, and shape it for your own product.
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
