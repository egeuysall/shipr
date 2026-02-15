"use client";

import { Waitlist } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export function WaitlistClient(): React.ReactElement {
  const { resolvedTheme } = useTheme();

  return (
    <Waitlist
      appearance={{
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
      }}
    />
  );
}
