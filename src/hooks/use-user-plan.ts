"use client";

import { useUser } from "@clerk/nextjs";

export type Plan = "free" | "pro";

export function useUserPlan(): {
  plan: Plan;
  isLoading: boolean;
  isPro: boolean;
  isFree: boolean;
} {
  const { user, isLoaded } = useUser();

  const plan = (user?.publicMetadata?.plan as Plan) || "free";
  const isPro = plan === "pro";
  const isFree = plan === "free";

  return {
    plan,
    isLoading: !isLoaded,
    isPro,
    isFree,
  };
}
