import type { Metadata } from "next";
import { Suspense } from "react";
import { ClerkProviderWrapper } from "@/components/clerk-provider-wrapper";
import { ConvexClientProvider } from "@/lib/convex-client-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { PostHogProvider } from "@/components/posthog-provider";
import { PostHogIdentify } from "@/components/posthog-identify";
import { PostHogPageview } from "@/components/posthog-pageview";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
      className={cn(
        GeistSans.variable,
        GeistMono.variable,
        GeistPixelSquare.variable,
      )}
      suppressHydrationWarning
    >
      <body className={cn("antialiased", GeistSans.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PostHogProvider>
            <ClerkProviderWrapper>
              <PostHogIdentify />
              <Suspense fallback={null}>
                <PostHogPageview />
              </Suspense>
              <TooltipProvider>
                <ConvexClientProvider>{children}</ConvexClientProvider>
              </TooltipProvider>
            </ClerkProviderWrapper>
          </PostHogProvider>
          <Toaster />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
