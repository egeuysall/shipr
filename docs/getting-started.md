# Getting Started

## Stack

| Layer          | Tech                                 |
| -------------- | ------------------------------------ |
| Framework      | Next.js 16 (App Router)              |
| Auth           | Clerk                                |
| Database       | Convex                               |
| Styling        | Tailwind CSS 4 + shadcn/ui + Base UI |
| Analytics      | PostHog (reverse-proxied)            |
| Error Tracking | Sentry                               |
| Fonts          | Geist Sans / Mono / Pixel Square     |
| Deployment     | Vercel                               |

## Prerequisites

- Node.js 18+
- pnpm
- A Clerk account
- A Convex project
- (Optional) PostHog & Sentry accounts

## Setup

```bash
git clone <repo-url> && cd shipr
pnpm install
cp .env.example .env
```

Fill in your `.env` values, then:

```bash
npx convex dev   # start Convex dev server
pnpm dev         # start Next.js dev server
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Sign-in & sign-up pages (Clerk)
│   ├── (dashboard)/     # Protected dashboard
│   ├── (legal)/         # Privacy, terms, cookies
│   ├── (marketing)/     # Landing, features, pricing, about, docs, blog
│   │   └── blog/        # Blog index + [slug] detail pages
│   ├── api/
│   │   └── health/      # Health check endpoint (rate-limited)
│   ├── layout.tsx       # Root layout (providers, metadata, fonts)
│   ├── not-found.tsx    # Custom 404 page
│   ├── error.tsx        # App-level error boundary
│   ├── global-error.tsx # Root error boundary
│   ├── robots.ts        # Robots.txt generation
│   └── sitemap.ts       # Sitemap generation
├── components/
│   ├── ui/              # shadcn/ui primitives
│   ├── billing/         # Upgrade button, plan gating
│   ├── dashboard/       # Dashboard shell, sidebar, top nav
│   ├── posthog-*.tsx    # PostHog provider, pageview, identify
│   ├── theme-toggle.tsx # Light/dark/system theme switcher
│   ├── header.tsx       # Marketing header
│   └── footer-1.tsx     # Marketing footer (includes theme toggle)
├── hooks/
│   ├── use-mobile.ts    # Responsive breakpoint hook
│   ├── use-sync-user.ts # Syncs Clerk user to Convex
│   └── use-user-plan.ts # Reads current billing plan
├── lib/
│   ├── blog.ts          # Blog post data & helpers
│   ├── constants.ts     # SEO, routes, structured data config
│   ├── emails/          # HTML email templates (welcome, plan-changed)
│   ├── rate-limit.ts    # In-memory sliding window rate limiter
│   ├── structured-data.tsx  # JSON-LD components
│   ├── sentry.ts        # Sentry helper wrappers
│   ├── convex-client-provider.tsx # Convex + Clerk provider
│   └── utils.ts         # cn() class merge utility
convex/
├── schema.ts            # Database schema
├── users.ts             # User queries & mutations
└── auth.config.ts       # Clerk JWT config for Convex
```

## Environment Variables

See `.env.example` for the full list. Key ones:

| Variable                        | Purpose                   |
| ------------------------------- | ------------------------- |
| `NEXT_PUBLIC_SITE_URL`          | Canonical site URL        |
| `NEXT_PUBLIC_CLERK_*`           | Clerk auth config         |
| `NEXT_PUBLIC_CONVEX_URL`        | Convex deployment URL     |
| `CLERK_JWT_ISSUER_DOMAIN`       | Clerk JWT issuer (Convex) |
| `NEXT_PUBLIC_POSTHOG_KEY`       | PostHog project API key   |
| `NEXT_PUBLIC_POSTHOG_HOST`      | PostHog ingest host       |
| `SENTRY_ORG` / `SENTRY_PROJECT` | Sentry source map uploads |

## Scripts

```bash
pnpm dev        # Start dev server
pnpm build      # Production build
pnpm start      # Start production server
pnpm lint       # ESLint
npx convex dev  # Convex dev mode
```

## Blog

Posts live in `src/lib/blog.ts` as a simple array, no MDX or CMS needed. Add a new object to `BLOG_POSTS` and it appears on `/blog` with its own `/blog/[slug]` page, sitemap entry, and JSON-LD structured data automatically.

## API Routes

A health check endpoint is available at `GET /api/health`. It returns uptime and a timestamp, and is rate-limited to 30 requests per minute per IP using the in-memory limiter from `src/lib/rate-limit.ts`.

## Rate Limiting

`src/lib/rate-limit.ts` provides a sliding window rate limiter. Use it in any API route:

```ts
import { rateLimit } from "@/lib/rate-limit";

const limiter = rateLimit({ interval: 60_000, limit: 10 });

export async function GET(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const { success, remaining, reset } = limiter.check(ip);

  if (!success) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  return Response.json({ ok: true });
}
```

> **Note:** This is in-memory and resets on cold starts. For production multi-instance deployments, swap it with Upstash Redis or similar.

## Email Templates

HTML email templates live in `src/lib/emails/`. Each exports a function that returns ready-to-send HTML:

- `welcomeEmail({ name })` - welcome email for new sign-ups
- `planChangedEmail({ name, previousPlan, newPlan })` - plan upgrade/downgrade notification

Use them with any email provider (Resend, SendGrid, etc.):

```ts
import { welcomeEmail } from "@/lib/emails";

const { subject, html } = welcomeEmail({ name: "Ege" });
// Pass subject + html to your email provider's send function
```
