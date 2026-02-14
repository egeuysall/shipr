import type { Metadata } from "next";
import { ClerkProviderWrapper } from "@/components/clerk-provider-wrapper";
import { ConvexClientProvider } from "@/lib/convex-client-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shipr",
  description: "Ship faster",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProviderWrapper>
            <TooltipProvider>
              <ConvexClientProvider>{children}</ConvexClientProvider>
            </TooltipProvider>
          </ClerkProviderWrapper>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
