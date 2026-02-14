import type { Metadata } from "next";
import { HeroHeader } from "@/components/header";
import Footer from "@/components/footer-1";

export const metadata: Metadata = {
  title: "Shipr - Legal",
  description: "Legal information for Shipr",
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeroHeader />
      <main className="[&_h1]:font-[family-name:var(--font-pixel-square)] [&_h2]:font-[family-name:var(--font-pixel-square)] [&_h3]:font-[family-name:var(--font-pixel-square)]">
        {children}
      </main>
      <Footer />
    </>
  );
}
