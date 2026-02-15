# SEO

How Shipr handles search engine optimization out of the box.

## Metadata

Global metadata is configured in `src/app/layout.tsx` using Next.js App Router's `Metadata` API. All values pull from `src/lib/constants.ts` so you only need to update one file.

Key constants:

- **`SITE_CONFIG`** - site name, URL, description, socials
- **`METADATA_DEFAULTS`** - title template (`%s | Shipr`), default title
- **`OG_IMAGE_DEFAULTS`** - Open Graph image dimensions and alt text
- **`PAGE_SEO`** - per-page title, description, and keywords

### Per-page metadata

Each route exports its own `metadata` object. Example from `src/app/(marketing)/page.tsx`:

```tsx
export const metadata: Metadata = {
  title: PAGE_SEO.home.title,
  description: PAGE_SEO.home.description,
  keywords: [...PAGE_SEO.home.keywords],
  alternates: { canonical: SITE_CONFIG.url },
};
```

To add a new page, add an entry to `PAGE_SEO` in `constants.ts` and export metadata in your page file.

## Sitemap

`src/app/sitemap.ts` generates `/sitemap.xml` at build time. Routes come from `SITEMAP_ROUTES` in constants. Each entry has a path, priority, and change frequency.

Add new public routes to `SITEMAP_ROUTES` - they'll appear in the sitemap automatically.

## Robots

`src/app/robots.ts` generates `/robots.txt`. Protected and internal routes are blocked via `ROBOTS_DISALLOWED` in constants.

## Structured Data (JSON-LD)

`src/lib/structured-data.tsx` provides server-safe JSON-LD components:

| Component                   | Schema Type         | Where to use         |
| --------------------------- | ------------------- | -------------------- |
| `OrganizationJsonLd`        | Organization        | Root layout `<head>` |
| `WebSiteJsonLd`             | WebSite             | Root layout `<head>` |
| `SoftwareApplicationJsonLd` | SoftwareApplication | Home / pricing pages |
| `ProductJsonLd`             | Product             | Pricing page         |
| `FaqJsonLd`                 | FAQPage             | Any page with FAQs   |
| `BreadcrumbJsonLd`          | BreadcrumbList      | Nested pages         |
| `ArticleJsonLd`             | Article             | Blog posts           |

### Adding a new schema

1. Define the data shape as a TypeScript interface.
2. Create a component that renders `<JsonLd data={...} />`.
3. Drop it into the relevant page or layout.

## Open Graph & Twitter Images

Static image files live in `src/app/`:

- `opengraph-image.png` (1200×630)
- `twitter-image.png` (1200×630)
- `apple-touch-icon.png`
- `favicon.ico` / `icon.svg`

Next.js automatically serves these at the correct routes.
