import type { Metadata } from "next";
import { PAGE_SEO, SITE_CONFIG } from "@/lib/constants";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/lib/structured-data";
import { PricingTableClient } from "@/components/pricing-table";

export const metadata: Metadata = {
  title: PAGE_SEO.pricing.title,
  description: PAGE_SEO.pricing.description,
  keywords: [...PAGE_SEO.pricing.keywords],
  alternates: {
    canonical: `${SITE_CONFIG.url}/pricing`,
  },
};

const pricingPlans = [
  {
    name: "Free",
    price: "0",
    description: "Core features to get started, no commitment required.",
  },
  {
    name: "Organizations",
    price: "12",
    description: "Organization-level billing and governance for serious growth.",
  },
];

export default function PricingPage(): React.ReactElement {
  return (
    <div className="py-32 md:pt-44">
      <ProductJsonLd plans={pricingPlans} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Pricing", href: "/pricing" },
        ]}
      />
      <div className="mx-auto max-w-2xl px-6">
        <div className="mb-12 text-center">
          <h1 className="text-balance text-4xl font-bold">Choose Your Plan</h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance">
            Select the plan that best fits your needs
          </p>
        </div>
        <PricingTableClient />
      </div>
    </div>
  );
}
