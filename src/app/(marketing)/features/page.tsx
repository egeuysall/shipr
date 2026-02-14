import type { Metadata } from "next";
import Features from "@/components/features-1";
import { PAGE_SEO, SITE_CONFIG } from "@/lib/constants";
import { BreadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: PAGE_SEO.features.title,
  description: PAGE_SEO.features.description,
  keywords: [...PAGE_SEO.features.keywords],
  alternates: {
    canonical: `${SITE_CONFIG.url}/features`,
  },
};

export default function FeaturesPage(): React.ReactElement {
  return (
    <div className="py-32 md:pt-44">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Features", href: "/features" },
        ]}
      />
      <div className="mx-auto max-w-2xl px-6">
        <div className="text-center">
          <h1 className="text-balance text-4xl font-bold">Powerful Features</h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-balance">
            Everything you need to build, connect, and scale your integrations
            with confidence.
          </p>
        </div>
      </div>
      <Features />
    </div>
  );
}
