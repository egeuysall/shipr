"use client";

import React from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Supabase } from "@/components/ui/svgs/supabase";
import { Slack } from "@/components/ui/svgs/slack";
import { Twilio } from "@/components/ui/svgs/twilio";
import { Linear } from "@/components/ui/svgs/linear";
import { Figma } from "@/components/ui/svgs/figma";
import { Vercel } from "@/components/ui/svgs/vercel";
import { Firebase } from "@/components/ui/svgs/firebase";
import { ClerkIconLight as Clerk } from "@/components/ui/svgs/clerk";
import { Claude } from "@/components/ui/svgs/claude";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="overflow-hidden bg-background">
      <div className="relative py-32 md:pt-44">
        <div className="mask-radial-from-50% mask-radial-to-85% mask-radial-at-top mask-radial-[75%_100%] mask-t-from-50% lg:aspect-9/4 absolute inset-0 aspect-square lg:top-24 dark:opacity-5">
          <Image
            src="https://images.unsplash.com/photo-1740516367177-ae20098c8786?q=80&w=2268&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="hero background"
            width={2268}
            height={1740}
            className="size-full object-cover object-top"
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-5"></div>
        <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
          <div className="mx-auto max-w-md text-center">
            <h1 className="text-balance text-4xl font-medium sm:text-5xl">
              Ship faster. Integrate smarter.
            </h1>
            <p className="text-muted-foreground mt-4 text-balance">
              Shipr is your all-in-one engine for adding seamless integrations
              to your app.
            </p>

            <Button
              className="mt-6 pr-1.5"
              render={<Link href="/sign-up" />}
              nativeButton={false}
              onClick={() =>
                posthog.capture("cta_clicked", {
                  cta_text: "Get Started Free",
                  location: "hero_section",
                })
              }
            >
              <span className="text-nowrap">Get Started Free</span>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                strokeWidth={2}
                className="opacity-50 size-4"
              />
            </Button>
          </div>
          <div className="mx-auto mt-24 max-w-xl">
            <div className="grid scale-95 grid-cols-3 gap-12">
              <div className="ml-auto blur-[2px]">
                <Card className="shadow-foreground/10 bg-background rounded-lg flex flex-row h-10 w-fit items-center gap-2 px-3 sm:h-10 sm:px-4 py-0">
                  <div className="text-foreground shrink-0 flex items-center">
                    <Supabase className="size-4" />
                  </div>
                  <span className="text-nowrap font-medium text-xs sm:text-sm text-foreground">
                    Supabase
                  </span>
                </Card>
              </div>
              <div className="ml-auto">
                <Card className="shadow-foreground/10 bg-background border rounded-lg flex flex-row h-10 w-fit items-center gap-2 px-3 sm:h-10 sm:px-4 py-0">
                  <div className="text-foreground shrink-0 flex items-center">
                    <Slack className="size-4" />
                  </div>
                  <span className="text-nowrap font-medium text-xs sm:text-sm text-foreground">
                    Slack
                  </span>
                </Card>
              </div>
              <div className="ml-auto blur-[2px]">
                <Card className="shadow-foreground/10 bg-background border rounded-lg flex flex-row h-10 w-fit items-center gap-2 px-3 sm:h-10 sm:px-4 py-0">
                  <div className="text-foreground shrink-0 flex items-center">
                    <Figma className="size-4" />
                  </div>
                  <span className="text-nowrap font-medium text-xs sm:text-sm text-foreground">
                    Figma
                  </span>
                </Card>
              </div>
              <div className="mr-auto">
                <Card className="shadow-foreground/10 bg-background border rounded-lg flex flex-row h-10 w-fit items-center gap-2 px-3 sm:h-10 sm:px-4 py-0">
                  <div className="text-foreground shrink-0 flex items-center">
                    <Vercel className="size-4" />
                  </div>
                  <span className="text-nowrap font-medium text-xs sm:text-sm text-foreground">
                    Vercel
                  </span>
                </Card>
              </div>
              <div className="blur-[2px]">
                <Card className="shadow-foreground/10 bg-background border rounded-lg flex flex-row h-10 w-fit items-center gap-2 px-3 sm:h-10 sm:px-4 py-0">
                  <div className="text-foreground shrink-0 flex items-center">
                    <Firebase className="size-4" />
                  </div>
                  <span className="text-nowrap font-medium text-xs sm:text-sm text-foreground">
                    Firebase
                  </span>
                </Card>
              </div>
              <div>
                <Card className="shadow-foreground/10 bg-background border rounded-lg flex flex-row h-10 w-fit items-center gap-2 px-3 sm:h-10 sm:px-4 py-0">
                  <div className="text-foreground shrink-0 flex items-center">
                    <Linear className="size-4" />
                  </div>
                  <span className="text-nowrap font-medium text-xs sm:text-sm text-foreground">
                    Linear
                  </span>
                </Card>
              </div>
              <div className="ml-auto blur-[2px]">
                <Card className="shadow-foreground/10 bg-background border rounded-lg flex flex-row h-10 w-fit items-center gap-2 px-3 sm:h-10 sm:px-4 py-0">
                  <div className="text-foreground shrink-0 flex items-center">
                    <Twilio className="size-4" />
                  </div>
                  <span className="text-nowrap font-medium text-xs sm:text-sm text-foreground">
                    Twilio
                  </span>
                </Card>
              </div>
              <div>
                <Card className="shadow-foreground/10 bg-background border rounded-lg flex flex-row h-10 w-fit items-center gap-2 px-3 sm:h-10 sm:px-4 py-0">
                  <div className="text-foreground shrink-0 flex items-center">
                    <Claude className="size-4" />
                  </div>
                  <span className="text-nowrap font-medium text-xs sm:text-sm text-foreground">
                    Claude AI
                  </span>
                </Card>
              </div>
              <div className="blur-[2px]">
                <Card className="shadow-foreground/10 bg-background border rounded-lg flex flex-row h-10 w-fit items-center gap-2 px-3 sm:h-10 sm:px-4 py-0">
                  <div className="text-foreground shrink-0 flex items-center">
                    <Clerk className="size-4" />
                  </div>
                  <span className="text-nowrap font-medium text-xs sm:text-sm text-foreground">
                    Clerk
                  </span>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
