import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { WaitlistClient } from "@/components/waitlist";

export const metadata: Metadata = {
  title: "Waitlist",
  description: "Join the waitlist for early access to Shipr.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/waitlist`,
  },
};

export default function WaitlistPage(): React.ReactElement {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <WaitlistClient />
    </main>
  );
}
