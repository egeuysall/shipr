import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Documentation - Shipr",
  description:
    "Learn how to get started with Shipr. Guides, API references, and integration tutorials.",
};

const sections = [
  {
    title: "Getting Started",
    description:
      "Learn the basics and set up your first integration in under 5 minutes.",
  },
  {
    title: "API Reference",
    description:
      "Complete reference for all Shipr API endpoints, parameters, and response formats.",
  },
  {
    title: "Guides",
    description:
      "Step-by-step tutorials for common integration patterns and use cases.",
  },
  {
    title: "SDKs & Libraries",
    description:
      "Official client libraries for JavaScript, Python, Go, and more.",
  },
];

// TODO: Replace with actual documentation content or link to external docs site (e.g., Mintlify, Docusaurus)
export default function DocsPage() {
  return (
    <div className="py-32 md:pt-44">
      <div className="mx-auto max-w-2xl px-6">
        <div className="text-center">
          <h1 className="text-balance font-serif text-4xl font-medium">
            Documentation
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance">
            Everything you need to build with Shipr.
          </p>
        </div>

        <div className="mt-16 space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="rounded-lg border p-6">
              <h2 className="font-medium">{section.title}</h2>
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
            <ChevronRight className="opacity-50" />
          </Button>
        </div>
      </div>
    </div>
  );
}
