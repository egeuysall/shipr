import type { Metadata } from "next";
import { HeroHeader } from "@/components/header";
import Footer from "@/components/footer-1";

export const metadata: Metadata = {
  title: "Shipr - Ship Your Next SaaS in Days, Not Weeks",
  description:
    "Production-ready SaaS starter with auth, billing, and beautiful UI. Built with Next.js, Clerk, and Convex.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeroHeader />
      <main>{children}</main>
      <Footer />
    </>
  );
}
