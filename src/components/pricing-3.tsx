"use client";

import posthog from "posthog-js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "",
    badge: "Always free",
    description: "Core features to get started, no commitment required.",
    features: [
      "Basic core features",
      "Limited usage quota",
      "Community support",
      "Standard performance",
    ],
    buttonText: "Subscribe",
  },
  {
    name: "Pro",
    price: "$12",
    period: "/ month",
    originalPrice: "$15",
    badge: "Save $36 per year",
    description: "Advanced tools, priority support, built for serious growth.",
    features: [
      "Higher usage",
      "Priority support",
      "Early access to new features",
      "Faster processing",
    ],
    buttonText: "Start 7-day free trial",
    highlighted: true,
  },
];

export default function Pricing() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const handleGetStarted = (planName: string, price: string) => {
    posthog.capture("pricing_plan_clicked", {
      plan_name: planName,
      plan_price: price,
      is_signed_in: isSignedIn,
    });

    if (isSignedIn) {
      router.push("/pricing");
    } else {
      router.push("/sign-in?redirect_url=/pricing");
    }
  };

  return (
    <section className="bg-background @container py-24">
      <div className="mx-auto max-w-2xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-bold">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance">
            Start for free, upgrade as you grow. No hidden fees.
          </p>
        </div>
        <div className="@xl:grid-cols-2 @xl:gap-3 mt-12 grid gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "relative p-6",
                plan.highlighted && "ring-1 ring-primary",
              )}
            >
              <div className="mb-4">
                <div className="text-foreground text-2xl font-bold">
                  {plan.name}
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  {plan.originalPrice && (
                    <span className="text-muted-foreground text-xl line-through">
                      {plan.originalPrice}
                    </span>
                  )}
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>
                <p className="text-muted-foreground mt-4 text-sm">
                  {plan.description}
                </p>
              </div>
              <div className="mb-4">
                <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                  {plan.badge}
                </span>
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-muted-foreground flex items-center gap-2 text-sm"
                  >
                    <HugeiconsIcon
                      icon={Tick01Icon}
                      strokeWidth={2}
                      className="text-primary size-4"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.highlighted ? "default" : "outline"}
                className="mt-8 w-full"
                onClick={() => handleGetStarted(plan.name, plan.price)}
              >
                {plan.buttonText}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
