import { Card } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShieldKeyIcon } from "@hugeicons/core-free-icons";
import { Vercel } from "@/components/ui/svgs/vercel";
import { Supabase } from "@/components/ui/svgs/supabase";
import { Linear } from "@/components/ui/svgs/linear";
import { Slack } from "@/components/ui/svgs/slack";
import { Firebase } from "@/components/ui/svgs/firebase";
import { ClerkIconDark as Clerk } from "@/components/ui/svgs/clerk";

export default function Features() {
  return (
    <section className="bg-background @container py-12">
      <div className="mx-auto max-w-2xl px-6">
        <div className="@xl:grid-cols-2 grid gap-3 *:p-6">
          <Card className="row-span-2 grid grid-rows-subgrid">
            <div className="space-y-2">
              <h3 className="text-foreground font-medium">
                Built-In Foundation
              </h3>
              <p className="text-muted-foreground text-sm">
                Next.js, Convex, Clerk auth, dashboard, uploads, and analytics
                are ready from day one.
              </p>
            </div>
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
          </Card>
          <Card className="row-span-2 grid grid-rows-subgrid overflow-hidden">
            <div className="space-y-2">
              <h3 className="text-foreground font-medium">
                Analytics Included
              </h3>
              <p className="text-muted-foreground text-sm">
                PostHog, Vercel Analytics, and Speed Insights are prewired for
                product and performance tracking.
              </p>
            </div>
            <div aria-hidden className="relative h-44 translate-y-6">
              <div className="bg-foreground/15 absolute inset-0 mx-auto w-px"></div>
              <div className="absolute -inset-x-16 top-6 aspect-square rounded-full border"></div>
              <div className="border-primary mask-l-from-50% mask-l-to-90% mask-r-from-50% mask-r-to-50% absolute -inset-x-16 top-6 aspect-square rounded-full border"></div>
              <div className="absolute -inset-x-8 top-24 aspect-square rounded-full border"></div>
              <div className="mask-r-from-50% mask-r-to-90% mask-l-from-50% mask-l-to-50% absolute -inset-x-8 top-24 aspect-square rounded-full border border-lime-500"></div>
            </div>
          </Card>
          <Card className="row-span-2 grid grid-rows-subgrid overflow-hidden">
            <div className="space-y-2">
              <h3 className="text-foreground font-medium">
                AI Features, Fast
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Vercel AI SDK support helps you ship chat, copilots, and AI
                workflows without extra setup.
              </p>
            </div>
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
          </Card>
          <Card className="row-span-2 grid grid-rows-subgrid">
            <div className="space-y-2">
              <h3 className="font-medium">
                Secure Uploads
              </h3>
              <p className="text-muted-foreground text-sm">
                Strong defaults plus shareable file links let you build
                user-facing upload flows safely and quickly.
              </p>
            </div>

            <div className="pointer-events-none relative -ml-7 flex size-44 items-center justify-center pt-5">
              <HugeiconsIcon
                icon={ShieldKeyIcon}
                strokeWidth={0.1}
                className="absolute inset-0 top-2.5 size-full opacity-15"
              />
              <HugeiconsIcon
                icon={ShieldKeyIcon}
                strokeWidth={0.1}
                className="size-32"
              />
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
