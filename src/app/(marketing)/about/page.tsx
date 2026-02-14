import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About - Shipr",
  description:
    "Learn about the team and mission behind Shipr.",
};

// TODO: Replace placeholder content with actual company info, team photos, and mission statement
export default function AboutPage() {
  return (
    <div className="py-32 md:pt-44">
      <div className="mx-auto max-w-2xl px-6">
        <div className="text-center">
          <h1 className="text-balance font-serif text-4xl font-medium">
            About Shipr
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance">
            We are building the future of integrations, one connection at a
            time.
          </p>
        </div>

        <div className="mt-16 space-y-8">
          <div>
            <h2 className="font-serif text-2xl font-medium">Our Mission</h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              Shipr was founded with a simple belief: connecting tools should be
              effortless. We are on a mission to eliminate the friction of
              building integrations so teams can focus on what matters most
              &mdash; shipping great products.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-medium">Our Story</h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              After years of building integrations from scratch at various
              startups, we realized there had to be a better way. Shipr was born
              from that frustration &mdash; a platform that makes connecting
              services as simple as writing a few lines of code.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-medium">Get in Touch</h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              Have questions, feedback, or want to partner with us? We would
              love to hear from you.
            </p>
            {/* TODO: Add contact email or form */}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Button
            className="pr-1.5"
            render={<Link href="/sign-up" />}
            nativeButton={false}
          >
            <span>Get Started Free</span>
            <ChevronRight className="opacity-50" />
          </Button>
        </div>
      </div>
    </div>
  );
}
