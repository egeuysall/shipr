"use client";

import posthog from "posthog-js";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon } from "@hugeicons/core-free-icons";
import { useUserPlan } from "@/hooks/use-user-plan";
import Link from "next/link";

export function UpgradeButton() {
  const { isPro, plan } = useUserPlan();

  if (isPro) return null;

  const handleUpgradeClick = () => {
    posthog.capture("upgrade_button_clicked", {
      current_plan: plan,
      location: "dashboard",
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      render={<Link href="/pricing" />}
      nativeButton={false}
      onClick={handleUpgradeClick}
    >
      <HugeiconsIcon icon={SparklesIcon} strokeWidth={2} />
      Upgrade to Pro
    </Button>
  );
}
