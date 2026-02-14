import Link from "next/link";
import { Logo } from "@/components/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      {/* Header with Logo */}
      <header className="border-b py-6">
        <div className="mx-auto max-w-7xl px-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-5 w-fit" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center py-12">
        {children}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t py-6">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Shipr. All rights reserved.</p>
            <div className="flex flex-wrap gap-6">
              <Link
                href="/"
                className="hover:text-foreground transition-colors"
              >
                Back to home
              </Link>
              <Link
                href="/terms"
                className="hover:text-foreground transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/cookies"
                className="hover:text-foreground transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
