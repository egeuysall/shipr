"use client";

import { PricingTable } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export function PricingTableClient(): React.ReactElement {
  const { resolvedTheme } = useTheme();

  return (
    <PricingTable
      for="organization"
      appearance={{
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
      }}
    />
  );
}
