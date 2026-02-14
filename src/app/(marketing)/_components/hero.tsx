import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HeroHeader } from "@/components/header";
import { ChevronRight } from "lucide-react";
import { Supabase } from "@/components/ui/svgs/supabase";
import { Slack } from "@/components/ui/svgs/slack";
import { Twilio } from "@/components/ui/svgs/twilio";
import { Linear } from "@/components/ui/svgs/linear";
import { Figma } from "@/components/ui/svgs/figma";
import { Vercel } from "@/components/ui/svgs/vercel";
import { Firebase } from "@/components/ui/svgs/firebase";
import { ClerkIconLight as Clerk } from "@/components/ui/svgs/clerk";
import { Claude } from "@/components/ui/svgs/claude";

export default function ShiprHero() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        <section className="bg-background">
          <div className="relative py-32 md:pt-44">
            <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
              <div className="mx-auto max-w-lg text-center">
                <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Ship Your Next SaaS in Days, Not Weeks
                </h1>
                <p className="text-muted-foreground mt-6 text-balance text-lg">
                  Production-ready starter with auth, billing, and beautiful UI.
                  Built with Next.js, Clerk, and Convex.
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Button
                    className="pr-1.5"
                    size="lg"
                    render={<Link href="/sign-up" />}
                    nativeButton={false}
                  >
                    <span className="text-nowrap">Get Started Free</span>
                    <ChevronRight className="opacity-50" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    render={<Link href="#features" />}
                    nativeButton={false}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="mx-auto mt-24 max-w-xl">
                <div className="**:fill-foreground grid scale-95 grid-cols-3 gap-12">
                  <div className="ml-auto blur-[2px]">
                    <Card className="shadow-foreground/10 flex h-8 w-fit items-center gap-2 rounded-xl px-3 sm:h-10 sm:px-4">
                      <Supabase className="size-4" />
                      <span className="text-nowrap font-medium max-sm:text-xs">
                        Supabase
                      </span>
                    </Card>
                  </div>
                  <div className="ml-auto">
                    <Card className="shadow-foreground/10 flex h-8 w-fit items-center gap-2 rounded-xl px-3 sm:h-10 sm:px-4">
                      <Slack className="size-4" />
                      <span className="text-nowrap font-medium max-sm:text-xs">
                        Slack
                      </span>
                    </Card>
                  </div>
                  <div className="ml-auto blur-[2px]">
                    <Card className="shadow-foreground/10 flex h-8 w-fit items-center gap-2 rounded-xl px-3 sm:h-10 sm:px-4">
                      <Figma className="size-4" />
                      <span className="text-nowrap font-medium max-sm:text-xs">
                        Figma
                      </span>
                    </Card>
                  </div>
                  <div className="mr-auto">
                    <Card className="shadow-foreground/10 flex h-8 w-fit items-center gap-2 rounded-xl px-3 sm:h-10 sm:px-4">
                      <Vercel className="size-4" />
                      <span className="text-nowrap font-medium max-sm:text-xs">
                        Vercel
                      </span>
                    </Card>
                  </div>
                  <div className="blur-[2px]">
                    <Card className="shadow-foreground/10 flex h-8 w-fit items-center gap-2 rounded-xl px-3 sm:h-10 sm:px-4">
                      <Firebase className="size-3 sm:size-4" />
                      <span className="text-nowrap font-medium max-sm:text-xs">
                        Firebase
                      </span>
                    </Card>
                  </div>
                  <div>
                    <Card className="shadow-foreground/10 mx-a flex h-8 w-fit items-center gap-2 rounded-xl px-3 sm:h-10 sm:px-4">
                      <Linear className="size-3 sm:size-4" />
                      <span className="text-nowrap font-medium max-sm:text-xs">
                        Linear
                      </span>
                    </Card>
                  </div>
                  <div className="ml-auto blur-[2px]">
                    <Card className="shadow-foreground/10 flex h-8 w-fit items-center gap-2 rounded-xl px-3 sm:h-10 sm:px-4">
                      <Twilio className="size-3 sm:size-4" />
                      <span className="text-nowrap font-medium max-sm:text-xs">
                        Twilio
                      </span>
                    </Card>
                  </div>
                  <div>
                    <Card className="shadow-foreground/10 mx-a flex h-8 w-fit items-center gap-2 rounded-xl px-3 sm:h-10 sm:px-4">
                      <Claude className="size-3 sm:size-4" />
                      <span className="text-nowrap font-medium max-sm:text-xs">
                        Claude AI
                      </span>
                    </Card>
                  </div>
                  <div className="blur-[2px]">
                    <Card className="shadow-foreground/10 flex h-8 w-fit items-center gap-2 rounded-xl px-3 sm:h-10 sm:px-4">
                      <Clerk className="size-3 sm:size-4" />
                      <span className="text-nowrap font-medium max-sm:text-xs">
                        Clerk
                      </span>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
