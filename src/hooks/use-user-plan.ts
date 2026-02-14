"use client";

import { useAuth } from "@clerk/nextjs";

export type Plan = "free" | "pro";

export function useUserPlan(): {
  plan: Plan;
  isLoading: boolean;
  isPro: boolean;
  isFree: boolean;
} {
  const { has, isLoaded } = useAuth();

  const isPro = isLoaded ? (has?.({ plan: "pro" }) ?? false) : false;
  const isFree = !isPro;
  const plan: Plan = isPro ? "pro" : "free";

  return {
    plan,
    isLoading: !isLoaded,
    isPro,
    isFree,
  };
}
