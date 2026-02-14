import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { ClerkProviderWrapper } from "@/components/clerk-provider-wrapper";
import { ConvexClientProvider } from "@/lib/convex-client-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { PostHogProvider } from "@/components/posthog-provider";
import { PostHogIdentify } from "@/components/posthog-identify";
import { PostHogPageview } from "@/components/posthog-pageview";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/lib/structured-data";
import {
  SITE_CONFIG,
  METADATA_DEFAULTS,
  OG_IMAGE_DEFAULTS,
} from "@/lib/constants";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: METADATA_DEFAULTS.titleDefault,
    template: METADATA_DEFAULTS.titleTemplate,
  },
  description: SITE_CONFIG.description,
  applicationName: SITE_CONFIG.name,
  authors: [{ name: SITE_CONFIG.creator, url: SITE_CONFIG.social.github }],
  creator: SITE_CONFIG.creator,
  publisher: SITE_CONFIG.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: {
      default: METADATA_DEFAULTS.titleDefault,
      template: METADATA_DEFAULTS.titleTemplate,
    },
    description: SITE_CONFIG.description,
    images: [
      {
        url: "/opengraph-image.png",
        width: OG_IMAGE_DEFAULTS.width,
        height: OG_IMAGE_DEFAULTS.height,
        type: OG_IMAGE_DEFAULTS.type,
        alt: OG_IMAGE_DEFAULTS.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: SITE_CONFIG.social.twitterHandle,
    site: SITE_CONFIG.social.twitterHandle,
    title: {
      default: METADATA_DEFAULTS.titleDefault,
      template: METADATA_DEFAULTS.titleTemplate,
    },
    description: SITE_CONFIG.description,
    images: [
      {
        url: "/twitter-image.png",
        width: OG_IMAGE_DEFAULTS.width,
        height: OG_IMAGE_DEFAULTS.height,
        type: OG_IMAGE_DEFAULTS.type,
        alt: OG_IMAGE_DEFAULTS.alt,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={SITE_CONFIG.language}
      className={cn(
        GeistSans.variable,
        GeistMono.variable,
        GeistPixelSquare.variable,
      )}
      suppressHydrationWarning
    >
      <head>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </head>
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
