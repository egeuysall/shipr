"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => {
    if (!CONVEX_URL) return null;
    return new ConvexReactClient(CONVEX_URL);
  }, []);

  if (!client) {
    // Convex is not configured yet -- render children without the provider
    // so the app can still function for non-Convex features.
    return <>{children}</>;
  }

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
