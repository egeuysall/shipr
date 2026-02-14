import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { PAGE_SEO, SITE_CONFIG } from "@/lib/constants";
import { BreadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: PAGE_SEO.docs.title,
  description: PAGE_SEO.docs.description,
  keywords: [...PAGE_SEO.docs.keywords],
  alternates: {
    canonical: `${SITE_CONFIG.url}/docs`,
  },
};

const sections = [
  {
    id: "getting-started",
    title: "Getting Started",
    description:
      "Learn the basics and set up your first integration in under 5 minutes.",
  },
  {
    id: "api",
    title: "API Reference",
    description:
      "Complete reference for all Shipr API endpoints, parameters, and response formats.",
  },
  {
    id: "examples",
    title: "Examples",
    description:
      "Step-by-step tutorials for common integration patterns and use cases.",
  },
  {
    id: "sdks",
    title: "SDKs & Libraries",
    description:
      "Official client libraries for JavaScript, Python, Go, and more.",
  },
];

export default function DocsPage(): React.ReactElement {
  return (
    <div className="py-32 md:pt-44">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Documentation", href: "/docs" },
        ]}
      />
      <div className="mx-auto max-w-2xl px-6">
        <div className="text-center">
          <h1 className="text-balance text-4xl font-bold">Documentation</h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance">
            Everything you need to build with Shipr.
          </p>
        </div>

        <div className="mt-16 space-y-6">
          {sections.map((section) => (
            <div
              key={section.title}
              id={section.id}
              className="rounded-lg border p-6 scroll-mt-32"
            >
              <h2 className="text-2xl font-semibold">{section.title}</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                {section.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button
            variant="secondary"
            className="pr-1.5"
            render={<Link href="/sign-up" />}
            nativeButton={false}
          >
            <span>Start Building</span>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              strokeWidth={2}
              className="opacity-50 size-4"
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
