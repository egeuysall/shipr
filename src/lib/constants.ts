// Site-wide constants for SEO, branding, and configuration

/**
 * Core site configuration used across metadata, structured data, and UI.
 * Update these values when branding or domain changes.
 */
export const SITE_CONFIG = {
  name: "Shipr",
  tagline: "Ship Your SaaS This Weekend.",
  description:
    "Shipr is a free, open-source SaaS starter that helps you go from zero to launch in 48 hours with Next.js, Convex, Clerk, auth, database wiring, analytics, docs, dashboard, secure uploads, and AI-ready foundations.",
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

/**
 * Metadata defaults used in the root layout's `metadata` export.
 * `titleTemplate` injects the page title via `%s`.
 */
export const METADATA_DEFAULTS = {
  titleTemplate: `%s | ${SITE_CONFIG.name}`,
  titleDefault: `${SITE_CONFIG.name}: ${SITE_CONFIG.tagline}`,
  descriptionMaxLength: 160,
  titleMaxLength: 60,
} as const;

/** Default OpenGraph image dimensions and alt text. */
export const OG_IMAGE_DEFAULTS = {
  width: 1200,
  height: 630,
  type: "image/png",
  alt: `${SITE_CONFIG.name}: ${SITE_CONFIG.tagline}`,
} as const;

/**
 * Centralised route map for the entire app.
 * Referenced by sitemap, robots, navigation, and link components.
 */
export const ROUTES = {
  public: {
    home: "/",
    features: "/features",
    pricing: "/pricing",
    about: "/about",
    docs: "/docs",
    blog: "/blog",
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

/** Routes included in `sitemap.xml` - public and legal pages only. */
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
    path: ROUTES.public.blog,
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

/** Routes blocked in `robots.txt` - auth, API, and internal paths. */
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

/**
 * Per-page SEO metadata (title, description, keywords).
 * Consumed by each route's `metadata` export.
 */
export const PAGE_SEO = {
  home: {
    title: "Shipr: Ship Your SaaS This Weekend",
    description:
      "Launch your SaaS in 48 hours with Shipr. Get a production-ready Next.js starter with Convex, Clerk, auth, database wiring, analytics, docs, dashboard, secure uploads, and AI-ready building blocks.",
    keywords: [
      "SaaS starter kit",
      "Next.js boilerplate",
      "SaaS template",
      "launch SaaS fast",
      "Next.js Convex Clerk starter",
    ],
  },
  features: {
    title: "Features: Complete SaaS Infrastructure Out of the Box",
    description:
      "Explore Shipr's complete SaaS stack: Next.js, Convex, Clerk, full auth and DB setup, analytics, docs, dashboard, secure file uploads, and AI-ready foundations.",
    keywords: [
      "SaaS features",
      "SaaS infrastructure",
      "Next.js starter features",
      "auth and database starter",
      "AI-ready SaaS template",
    ],
  },
  pricing: {
    title: "Pricing: Simple, Transparent Plans",
    description:
      "Start free and upgrade when you are ready. Shipr offers transparent pricing for teams that want to launch quickly and scale with confidence.",
    keywords: [
      "SaaS pricing",
      "free plan",
      "pro plan",
      "subscription pricing",
      "affordable SaaS",
    ],
  },
  about: {
    title: "About Shipr: Built to Help You Launch Faster",
    description:
      "Learn why Shipr was built: to remove SaaS boilerplate and help founders and teams launch production-ready products in a weekend.",
    keywords: [
      "about Shipr",
      "our mission",
      "open-source SaaS starter",
      "launch SaaS faster",
    ],
  },
  docs: {
    title: "Documentation: Build with Shipr",
    description:
      "Get started with Shipr quickly. Explore setup guides, usage docs, and practical references to build and ship your SaaS product.",
    keywords: [
      "Shipr documentation",
      "SaaS starter docs",
      "Next.js starter guide",
      "developer documentation",
      "Shipr setup",
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

/**
 * JSON-LD structured data objects injected into `<head>`.
 * Used by components in `src/lib/structured-data.tsx`.
 */
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
