"use client";

import { useState } from "react";
import {
  KeyRound,
  CreditCard,
  Database,
  Palette,
  ChevronRight,
} from "lucide-react";
import { Vercel } from "@/components/ui/svgs/vercel";
import { Supabase } from "@/components/ui/svgs/supabase";
import { Linear } from "@/components/ui/svgs/linear";
import { Slack } from "@/components/ui/svgs/slack";
import { Firebase } from "@/components/ui/svgs/firebase";
import { ClerkIconDark as Clerk } from "@/components/ui/svgs/clerk";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";

type Feature =
  | "authentication"
  | "billing"
  | "database"
  | "ui-components";

export default function ShiprFeatures() {
  const [feature, setFeature] = useState<Feature>("authentication");
  return (
    <section id="features" className="bg-background @container py-16 md:py-24">
      <div className="@2xl:grid-cols-2 mx-auto grid max-w-3xl gap-6 px-6">
        <div>
          <div>
            <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
              Everything You Need to Launch Fast
            </h2>
            <p className="text-muted-foreground mb-6 mt-4 text-balance">
              Stop rebuilding the same boilerplate. Shipr gives you
              production-ready auth, billing, database, and UI out of the box.
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="gap-1 pr-1.5"
              render={<Link href="/sign-up" />}
              nativeButton={false}
            >
              Get started
              <ChevronRight />
            </Button>
          </div>
          <div className="mt-16 *:w-full *:cursor-pointer">
            <button
              onClick={() => setFeature("authentication")}
              data-selected={feature === "authentication"}
              className="not-data-[selected=true]:hover:text-foreground not-data-[selected=true]:text-muted-foreground flex items-center gap-3 py-2 text-sm"
            >
              <KeyRound className="size-4" />
              <span className="in-data-[selected=true]:text-shadow-[0.2px_0_0_currentColor]">
                Authentication (Clerk)
              </span>
            </button>
            <button
              onClick={() => setFeature("billing")}
              data-selected={feature === "billing"}
              className="not-data-[selected=true]:hover:text-foreground not-data-[selected=true]:text-muted-foreground flex items-center gap-3 py-2 text-sm"
            >
              <CreditCard className="size-4" />
              <span className="in-data-[selected=true]:text-shadow-[0.2px_0_0_currentColor]">
                Billing (Stripe)
              </span>
            </button>
            <button
              onClick={() => setFeature("database")}
              data-selected={feature === "database"}
              className="not-data-[selected=true]:hover:text-foreground not-data-[selected=true]:text-muted-foreground flex items-center gap-3 py-2 text-sm"
            >
              <Database className="size-4" />
              <span className="in-data-[selected=true]:text-shadow-[0.2px_0_0_currentColor]">
                Database (Convex)
              </span>
            </button>
            <button
              onClick={() => setFeature("ui-components")}
              data-selected={feature === "ui-components"}
              className="not-data-[selected=true]:hover:text-foreground not-data-[selected=true]:text-muted-foreground flex items-center gap-3 py-2 text-sm"
            >
              <Palette className="size-4" />
              <span className="in-data-[selected=true]:text-shadow-[0.2px_0_0_currentColor]">
                UI Components (shadcn)
              </span>
            </button>
          </div>
        </div>
        <div className="@max-xl:-mx-6 not-dark:bg-linear-to-b not-dark:via-muted relative flex items-center overflow-hidden rounded-3xl *:w-full">
          <div
            aria-hidden
            className={cn(
              "*:bg-linear-to-r not-dark:opacity-50 mask-y-from-65% *:to-muted dark:*:to-foreground/2 absolute inset-0 grid grid-cols-4 duration-300",
              feature === "authentication" &&
                "*:bg-linear-to-t grid-cols-1 grid-rows-12",
              feature === "ui-components" &&
                "*:bg-linear-to-l grid-cols-2 dark:opacity-50",
              feature === "billing" && "*:opacity-35"
            )}
          >
            <div />
            <div />
            <div />
            <div />
          </div>
          {feature === "authentication" && <AuthIllustration />}
          {feature === "billing" && <BillingIllustration />}
          {feature === "database" && <DatabaseIllustration />}
          {feature === "ui-components" && <UIIllustration />}
        </div>
      </div>
    </section>
  );
}

const AuthIllustration = () => {
  return (
    <div
      aria-hidden
      className="**:fill-foreground flex h-44 flex-col justify-between pt-8"
    >
      <div className="relative flex h-10 items-center gap-12 px-6">
        <div className="bg-border absolute inset-0 my-auto h-px"></div>
        <div className="bg-card shadow-black/6.5 ring-border relative flex h-8 items-center rounded-full px-3 shadow-sm ring">
          <Vercel className="size-3.5" />
        </div>
        <div className="bg-card shadow-black/6.5 ring-border relative flex h-8 items-center rounded-full px-3 shadow-sm ring">
          <Slack className="size-3.5" />
        </div>
      </div>
      <div className="pl-17 relative flex h-10 items-center justify-between gap-12 pr-6">
        <div className="bg-border absolute inset-0 my-auto h-px"></div>
        <div className="bg-card shadow-black/6.5 ring-border relative flex h-8 items-center rounded-full px-3 shadow-sm ring">
          <Clerk className="size-3.5" />
        </div>
        <div className="bg-card shadow-black/6.5 ring-border relative flex h-8 items-center rounded-full px-3 shadow-sm ring">
          <Linear className="size-3.5" />
        </div>
      </div>
      <div className="relative flex h-10 items-center gap-20 px-8">
        <div className="bg-border absolute inset-0 my-auto h-px"></div>
        <div className="bg-card shadow-black/6.5 ring-border relative flex h-8 items-center rounded-full px-3 shadow-sm ring">
          <Supabase className="size-3.5" />
        </div>
        <div className="bg-card shadow-black/6.5 ring-border relative flex h-8 items-center rounded-full px-3 shadow-sm ring">
          <Firebase className="size-3.5" />
        </div>
      </div>
    </div>
  );
};

const BillingIllustration = () => {
  return (
    <div aria-hidden className="relative h-44 translate-y-6">
      <div className="bg-foreground/15 absolute inset-0 mx-auto w-px"></div>
      <div className="absolute -inset-x-16 top-6 aspect-square rounded-full border"></div>
      <div className="border-primary mask-l-from-50% mask-l-to-90% mask-r-from-50% mask-r-to-50% absolute -inset-x-16 top-6 aspect-square rounded-full border"></div>
      <div className="absolute -inset-x-8 top-24 aspect-square rounded-full border"></div>
      <div className="mask-r-from-50% mask-r-to-90% mask-l-from-50% mask-l-to-50% absolute -inset-x-8 top-24 aspect-square rounded-full border border-lime-500"></div>
    </div>
  );
};

const DatabaseIllustration = () => {
  return (
    <div
      aria-hidden
      className="relative flex size-44 items-center justify-center"
    >
      <Shield className="absolute inset-0 size-full stroke-[0.1px] opacity-15" />
      <Shield className="fill-card dark:fill-foreground/10 drop-shadow-black/3 stroke-border size-32 stroke-[0.2px] drop-shadow-xl" />
    </div>
  );
};

const UIIllustration = () => {
  return (
    <div
      aria-hidden
      className="*:bg-foreground/15 flex h-44 justify-between pb-6 pt-12 *:h-full *:w-px"
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div className="bg-primary!"></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div className="bg-primary!"></div>
      <div></div>
      <div></div>
      <div></div>
      <div className="bg-primary!"></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div className="bg-primary!"></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div className="bg-primary!"></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div className="bg-primary!"></div>
    </div>
  );
};
