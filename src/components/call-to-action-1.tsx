"use client";

import Link from "next/link";
import posthog from "posthog-js";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

export default function CallToAction() {
  return (
    <section className="bg-background @container pb-24">
      <div className="mx-auto max-w-2xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-medium">
            Ready to Ship This Weekend?
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance">
            Launch with full infrastructure already done, from auth and data to
            analytics, uploads, and AI-ready flows.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button
              className="pr-1.5"
              render={<Link href="/sign-up" />}
              nativeButton={false}
              onClick={() =>
                posthog.capture("cta_clicked", {
                  cta_text: "Get Started Free",
                  location: "call_to_action_section",
                })
              }
            >
              <span>Get Started Free</span>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                strokeWidth={2}
                className="opacity-50 size-4"
              />
            </Button>
            <Button
              variant="secondary"
              render={<Link href="/pricing" />}
              nativeButton={false}
              onClick={() =>
                posthog.capture("cta_clicked", {
                  cta_text: "View Pricing",
                  location: "call_to_action_section",
                })
              }
            >
              View Pricing
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
