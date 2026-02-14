"use client";

import { PricingTable } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function PricingPage() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="py-32 md:pt-44">
      <div className="mx-auto max-w-2xl px-6">
        <div className="mb-12 text-center">
          <h1 className="text-balance text-4xl font-bold">Choose Your Plan</h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance">
            Select the plan that best fits your needs
          </p>
        </div>
        <PricingTable
          appearance={{
            baseTheme: resolvedTheme === "dark" ? dark : undefined,
          }}
        />
      </div>
    </div>
  );
}
