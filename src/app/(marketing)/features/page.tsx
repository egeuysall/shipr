import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Zap, Shield, Cloud, Cpu } from "lucide-react";

export const metadata: Metadata = {
  title: "Features - Shipr",
  description:
    "Explore all the features that make Shipr the best platform for building integrations.",
};

const features = [
  {
    icon: Zap,
    title: "Seamless Integrations",
    description:
      "Connect to your favorite tools in minutes. Our pre-built connectors handle the complexity so you can focus on building.",
  },
  {
    icon: Cloud,
    title: "Real-time Sync",
    description:
      "Keep your data synchronized across all connected services with real-time event-driven updates.",
  },
  {
    icon: Cpu,
    title: "Developer-first",
    description:
      "Clean APIs, comprehensive SDKs, and detailed documentation designed by developers, for developers.",
  },
  {
    icon: Shield,
    title: "Enterprise-ready",
    description:
      "SOC 2 compliant, end-to-end encryption, and role-based access control to meet your security requirements.",
  },
];

// TODO: Replace placeholder content with actual feature details and screenshots
export default function FeaturesPage() {
  return (
    <div className="py-32 md:pt-44">
      <div className="mx-auto max-w-2xl px-6">
        <div className="text-center">
          <h1 className="text-balance font-serif text-4xl font-medium">
            Everything you need to ship faster
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance">
            Powerful features designed to help modern teams build, connect, and
            scale their integrations.
          </p>
        </div>

        <div className="mt-16 space-y-12">
          {features.map((feature) => (
            <div key={feature.title} className="flex gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border">
                <feature.icon className="size-5" />
              </div>
              <div>
                <h2 className="font-medium">{feature.title}</h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button
            className="pr-1.5"
            render={<Link href="/sign-up" />}
            nativeButton={false}
          >
            <span>Get Started Free</span>
            <ChevronRight className="opacity-50" />
          </Button>
        </div>
      </div>
    </div>
  );
}
