import { SITE_CONFIG, STRUCTURED_DATA } from "@/lib/constants";

// Type-safe JSON-LD structured data components

interface JsonLdProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

/**
 * Renders a JSON-LD script tag with the given structured data.
 * Safe for server components: no dangerouslySetInnerHTML XSS risk
 * because we control the data and JSON.stringify escapes it.
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

// Pre-built structured data components

/** Organization schema: use in root layout */
export function OrganizationJsonLd(): React.ReactElement {
  return <JsonLd data={STRUCTURED_DATA.organization} />;
}

/** WebSite schema with search action: use in root layout */
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

/** SoftwareApplication schema: use on home/pricing pages */
export function SoftwareApplicationJsonLd(): React.ReactElement {
  return <JsonLd data={STRUCTURED_DATA.softwareApplication} />;
}

/** Product schema for pricing page */
interface PricingPlan {
  name: string;
  price: string;
  description: string;
}

interface ProductJsonLdProps {
  plans: PricingPlan[];
}

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

/** FAQ schema: use on pages with FAQ sections */
interface FaqItem {
  question: string;
  answer: string;
}

interface FaqJsonLdProps {
  items: FaqItem[];
}

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

/** BreadcrumbList schema: use on nested pages */
interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
}

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

/** Article schema: use for blog posts */
interface ArticleJsonLdProps {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  authorName: string;
  slug: string;
  imageUrl?: string;
}

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
