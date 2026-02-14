import { HeroHeader } from "@/components/header";
import Footer from "@/components/footer-1";

export default function MarketingLayout({
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
