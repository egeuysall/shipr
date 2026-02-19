"use client";

import { ReactNode, useCallback, useEffect, useMemo, useRef } from "react";
import { ConvexReactClient, ConvexProviderWithAuth } from "convex/react";
import { useAuth } from "@clerk/nextjs";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL in your .env file");
}

// Module-level singleton -- only created once since NEXT_PUBLIC_CONVEX_URL
// is a build-time constant that never changes.
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

function useConvexClerkAuth() {
  const { isLoaded, isSignedIn, getToken, orgId, orgRole } = useAuth();
  const previousOrgIdRef = useRef<string | null | undefined>(undefined);
  const shouldForceRefreshRef = useRef(false);

  useEffect(() => {
    const previousOrgId = previousOrgIdRef.current;

    if (previousOrgId !== undefined && previousOrgId !== orgId) {
      shouldForceRefreshRef.current = true;
    }

    previousOrgIdRef.current = orgId;
  }, [orgId]);

  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      try {
        const token = await getToken({
          template: "convex",
          organizationId: orgId ?? undefined,
          skipCache: forceRefreshToken || shouldForceRefreshRef.current,
        });

        shouldForceRefreshRef.current = false;
        return token;
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("Failed to fetch Clerk Convex token", error);
        }
        return null;
      }
    },
    // Build a new fetchAccessToken to trigger setAuth() whenever these change.
    [getToken, orgId, orgRole],
  );

  return useMemo(
    () => ({
      isLoading: !isLoaded,
      isAuthenticated: isSignedIn ?? false,
      fetchAccessToken,
    }),
    [isLoaded, isSignedIn, fetchAccessToken],
  );
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithAuth client={convex} useAuth={useConvexClerkAuth}>
      {children}
    </ConvexProviderWithAuth>
  );
}
