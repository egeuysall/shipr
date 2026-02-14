import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { RocketIcon } from "@hugeicons/core-free-icons";

export default async function HomePage() {
  const { userId } = await auth();

  // Redirect authenticated users to dashboard
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="max-w-2xl space-y-8 text-center px-4">
        <div className="flex justify-center">
          <div className="rounded-full border p-4">
            <HugeiconsIcon icon={RocketIcon} strokeWidth={2} className="h-12 w-12" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">
            Welcome to Shipr
          </h1>
          <p className="text-xl text-muted-foreground">
            Ship your projects faster with powerful tools and integrations
          </p>
        </div>

        <div className="flex gap-4 justify-center pt-4">
          <Link
            href="/sign-up"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-background px-8 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Sign In
          </Link>
        </div>

        <div className="pt-8">
          <Link
            href="/pricing"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View Pricing →
          </Link>
        </div>
      </div>
    </div>
  );
}
