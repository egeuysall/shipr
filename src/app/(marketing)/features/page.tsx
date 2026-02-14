import type { Metadata } from "next";
import Features from "@/components/features-1";

export const metadata: Metadata = {
  title: "Features - Shipr",
  description: "Powerful features to build, connect, and scale your integrations.",
};

export default function FeaturesPage() {
  return (
    <div className="py-32 md:pt-44">
      <div className="mx-auto max-w-2xl px-6">
        <div className="text-center">
          <h1 className="text-balance text-4xl font-bold">
            Powerful Features
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-balance">
            Everything you need to build, connect, and scale your integrations with confidence.
          </p>
        </div>
      </div>
      <Features />
    </div>
  );
}
