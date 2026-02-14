// Site-wide constants for SEO, branding, and configuration

export const SITE_CONFIG = {
  name: "Shipr",
  tagline: "Ship faster. Integrate smarter.",
  description:
    "Shipr is your all-in-one engine for adding seamless integrations to your app. Production-ready SaaS starter with auth, billing, and beautiful UI.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://shipr.dev",
  locale: "en_US",
  language: "en",
  creator: "Ege Uysal",
  email: "hi@egeuysal.com",
  social: {
    github: "https://github.com/egeuysall",
    twitter: "https://x.com/egewrk",
    twitterHandle: "@egewrk",
  },
} as const;

// Metadata defaults & templates

export const METADATA_DEFAULTS = {
  titleTemplate: `%s | ${SITE_CONFIG.name}`,
  titleDefault: `${SITE_CONFIG.name}: ${SITE_CONFIG.tagline}`,
  descriptionMaxLength: 160,
  titleMaxLength: 60,
} as const;

// OG Image defaults

export const OG_IMAGE_DEFAULTS = {
  width: 1200,
  height: 630,
  type: "image/png",
  alt: `${SITE_CONFIG.name}: ${SITE_CONFIG.tagline}`,
} as const;

// Route definitions for sitemap, robots, and navigation

export const ROUTES = {
  public: {
    home: "/",
    features: "/features",
    pricing: "/pricing",
    about: "/about",
    docs: "/docs",
  },
  legal: {
    privacy: "/privacy",
    terms: "/terms",
    cookies: "/cookies",
  },
  auth: {
    signIn: "/sign-in",
    signUp: "/sign-up",
  },
  protected: {
    dashboard: "/dashboard",
  },
} as const;

/** Routes to include in sitemap.xml (public & legal only) */
export const SITEMAP_ROUTES = [
  {
    path: ROUTES.public.home,
    priority: 1.0,
    changeFrequency: "weekly" as const,
  },
  {
    path: ROUTES.public.features,
    priority: 0.9,
    changeFrequency: "weekly" as const,
  },
  {
    path: ROUTES.public.pricing,
    priority: 0.9,
    changeFrequency: "weekly" as const,
  },
  {
    path: ROUTES.public.about,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  },
  {
    path: ROUTES.public.docs,
    priority: 0.8,
    changeFrequency: "weekly" as const,
  },
  {
    path: ROUTES.legal.privacy,
    priority: 0.3,
    changeFrequency: "yearly" as const,
  },
  {
    path: ROUTES.legal.terms,
    priority: 0.3,
    changeFrequency: "yearly" as const,
  },
  {
    path: ROUTES.legal.cookies,
    priority: 0.3,
    changeFrequency: "yearly" as const,
  },
] as const;

/** Routes to disallow in robots.txt */
export const ROBOTS_DISALLOWED = [
  "/dashboard",
  "/dashboard/*",
  "/api",
  "/api/*",
  "/sign-in",
  "/sign-up",
  "/monitoring",
  "/ingest",
  "/ingest/*",
] as const;

// SEO keyword targeting per page

export const PAGE_SEO = {
  home: {
    title: "Shipr: Ship Faster. Integrate Smarter.",
    description:
      "Build and ship your SaaS in days, not weeks. Shipr is a production-ready starter with auth, billing, integrations, and beautiful UI built on Next.js, Clerk, and Convex.",
    keywords: [
      "SaaS starter kit",
      "Next.js boilerplate",
      "SaaS template",
      "ship faster",
      "integration platform",
    ],
  },
  features: {
    title: "Features: Powerful Tools to Build & Scale",
    description:
      "Explore Shipr's powerful features: seamless integrations, authentication, billing, analytics, and more. Everything you need to build, connect, and scale.",
    keywords: [
      "SaaS features",
      "integration tools",
      "developer tools",
      "API integrations",
      "workflow automation",
    ],
  },
  pricing: {
    title: "Pricing: Simple, Transparent Plans",
    description:
      "Start for free, upgrade as you grow. Shipr offers simple, transparent pricing with no hidden fees. Free and Pro plans available.",
    keywords: [
      "SaaS pricing",
      "free plan",
      "pro plan",
      "subscription pricing",
      "affordable SaaS",
    ],
  },
  about: {
    title: "About: Our Mission & Story",
    description:
      "Learn about Shipr's mission to make integrations effortless. We're building the future of connecting tools so teams can focus on shipping great products.",
    keywords: [
      "about Shipr",
      "our mission",
      "integration platform company",
      "developer tools company",
    ],
  },
  docs: {
    title: "Documentation: Guides, APIs & Tutorials",
    description:
      "Get started with Shipr in minutes. Explore guides, API references, SDK documentation, and step-by-step integration tutorials.",
    keywords: [
      "Shipr documentation",
      "API reference",
      "integration guides",
      "developer docs",
      "SDK",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    description:
      "Read Shipr's privacy policy. Learn how we collect, use, and protect your personal data.",
  },
  terms: {
    title: "Terms of Service",
    description:
      "Read Shipr's terms of service. Understand the rules and guidelines for using our platform.",
  },
  cookies: {
    title: "Cookie Policy",
    description:
      "Read Shipr's cookie policy. Understand how we use cookies and how to manage your preferences.",
  },
} as const;

// Structured data constants

export const STRUCTURED_DATA = {
  organization: {
    "@type": "Organization" as const,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/icon.svg`,
    sameAs: [SITE_CONFIG.social.github, SITE_CONFIG.social.twitter],
    contactPoint: {
      "@type": "ContactPoint" as const,
      email: SITE_CONFIG.email,
      contactType: "customer support",
    },
  },
  softwareApplication: {
    "@type": "SoftwareApplication" as const,
    name: SITE_CONFIG.name,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: [
      {
        "@type": "Offer" as const,
        price: "0",
        priceCurrency: "USD",
        name: "Free",
      },
      {
        "@type": "Offer" as const,
        price: "12",
        priceCurrency: "USD",
        name: "Pro",
        priceValidUntil: new Date(
          new Date().getFullYear() + 1,
          11,
          31,
        ).toISOString(),
      },
    ],
  },
} as const;
