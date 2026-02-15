import { SITE_CONFIG, STRUCTURED_DATA } from "@/lib/constants";

// Type-safe JSON-LD structured data components

interface JsonLdProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

/**
 * Renders a `<script type="application/ld+json">` tag with structured data.
 *
 * Safe for Server Components - no XSS risk because we control the data
 * and `JSON.stringify` escapes all values.
 *
 * @param data - A plain object that will be merged with `@context: "https://schema.org"`.
 */
function JsonLd({ data }: JsonLdProps): React.ReactElement {
  const jsonLd = {
    "@context": "https://schema.org",
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ---------------------------------------------------------------------------
// Pre-built structured data components
// ---------------------------------------------------------------------------

/**
 * Organization schema - renders company info, logo, and social links.
 *
 * Place in the root layout `<head>` so every page inherits it.
 */
export function OrganizationJsonLd(): React.ReactElement {
  return <JsonLd data={STRUCTURED_DATA.organization} />;
}

/**
 * WebSite schema - tells search engines the site name, URL, and publisher.
 *
 * Place in the root layout `<head>` alongside `OrganizationJsonLd`.
 */
export function WebSiteJsonLd(): React.ReactElement {
  return (
    <JsonLd
      data={{
        "@type": "WebSite",
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        description: SITE_CONFIG.description,
        publisher: {
          "@type": "Organization",
          name: SITE_CONFIG.name,
        },
      }}
    />
  );
}

/**
 * SoftwareApplication schema - describes the app and its pricing offers.
 *
 * Use on the home page or pricing page to enable rich results in search.
 */
export function SoftwareApplicationJsonLd(): React.ReactElement {
  return <JsonLd data={STRUCTURED_DATA.softwareApplication} />;
}

/** A single pricing plan used by {@link ProductJsonLd}. */
interface PricingPlan {
  name: string;
  price: string;
  description: string;
}

interface ProductJsonLdProps {
  plans: PricingPlan[];
}

/**
 * Product schema with multiple pricing offers.
 *
 * Use on the pricing page to surface plan details in Google rich results.
 *
 * @param plans - Array of pricing plans to render as `Offer` entries.
 */
export function ProductJsonLd({
  plans,
}: ProductJsonLdProps): React.ReactElement {
  return (
    <JsonLd
      data={{
        "@type": "Product",
        name: SITE_CONFIG.name,
        description: SITE_CONFIG.description,
        brand: {
          "@type": "Organization",
          name: SITE_CONFIG.name,
        },
        offers: plans.map((plan) => ({
          "@type": "Offer",
          name: plan.name,
          price: plan.price,
          priceCurrency: "USD",
          description: plan.description,
          availability: "https://schema.org/InStock",
        })),
      }}
    />
  );
}

/** A single FAQ entry used by {@link FaqJsonLd}. */
interface FaqItem {
  question: string;
  answer: string;
}

interface FaqJsonLdProps {
  items: FaqItem[];
}

/**
 * FAQPage schema - generates rich FAQ snippets in search results.
 *
 * @param items - Array of question/answer pairs.
 */
export function FaqJsonLd({ items }: FaqJsonLdProps): React.ReactElement {
  return (
    <JsonLd
      data={{
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }}
    />
  );
}

/** A single breadcrumb entry used by {@link BreadcrumbJsonLd}. */
interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
}

/**
 * BreadcrumbList schema - helps search engines understand page hierarchy.
 *
 * @param items - Ordered array of breadcrumb links (home to current page).
 */
export function BreadcrumbJsonLd({
  items,
}: BreadcrumbJsonLdProps): React.ReactElement {
  return (
    <JsonLd
      data={{
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: `${SITE_CONFIG.url}${item.href}`,
        })),
      }}
    />
  );
}

interface ArticleJsonLdProps {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  authorName: string;
  slug: string;
  imageUrl?: string;
}

/**
 * Article schema - use on blog posts or content pages.
 *
 * Enables rich article snippets with author, date, and image in search.
 *
 * @param title - The article headline.
 * @param description - A short summary of the article.
 * @param publishedAt - ISO 8601 publish date.
 * @param updatedAt - Optional ISO 8601 last-modified date.
 * @param authorName - Author's display name.
 * @param slug - URL slug (appended to `/blog/`).
 * @param imageUrl - Optional hero image URL.
 */
export function ArticleJsonLd({
  title,
  description,
  publishedAt,
  updatedAt,
  authorName,
  slug,
  imageUrl,
}: ArticleJsonLdProps): React.ReactElement {
  return (
    <JsonLd
      data={{
        "@type": "Article",
        headline: title,
        description,
        datePublished: publishedAt,
        ...(updatedAt && { dateModified: updatedAt }),
        author: {
          "@type": "Person",
          name: authorName,
        },
        publisher: {
          "@type": "Organization",
          name: SITE_CONFIG.name,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_CONFIG.url}/icon.svg`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${SITE_CONFIG.url}/blog/${slug}`,
        },
        ...(imageUrl && {
          image: {
            "@type": "ImageObject",
            url: imageUrl,
          },
        }),
      }}
    />
  );
}
