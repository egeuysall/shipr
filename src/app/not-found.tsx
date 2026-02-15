import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export default function NotFound(): React.ReactElement {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <Logo className="mb-8 h-6 w-fit" />
      <h1 className="text-6xl font-bold tracking-tight">404</h1>
      <p className="text-muted-foreground mt-3 text-center text-balance">
        This page doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Button render={<Link href="/" />} nativeButton={false}>
          Go Home
        </Button>
        <Button
          variant="outline"
          render={<Link href="/pricing" />}
          nativeButton={false}
        >
          View Pricing
        </Button>
      </div>
    </div>
  );
}
