"use client";

import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon } from "@hugeicons/core-free-icons";
import { useUserPlan } from "@/hooks/use-user-plan";
import Link from "next/link";

export function UpgradeButton() {
  const { isPro } = useUserPlan();

  if (isPro) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      render={<Link href="/pricing" />}
      nativeButton={false}
    >
      <HugeiconsIcon icon={SparklesIcon} strokeWidth={2} />
      Upgrade to Pro
    </Button>
  );
}
