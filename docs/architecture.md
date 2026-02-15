# Architecture

## Tech Stack

| Layer          | Tool                       |
| -------------- | -------------------------- |
| Framework      | Next.js 16 (App Router)    |
| Auth           | Clerk                      |
| Database       | Convex                     |
| Styling        | Tailwind CSS 4             |
| Analytics      | PostHog + Vercel Analytics |
| Error Tracking | Sentry                     |
| Payments       | Clerk Billing              |

## Route Groups

```
src/app/
├── (auth)/          # Sign-in, sign-up pages (Clerk)
├── (dashboard)/     # Protected pages (requires auth)
├── (legal)/         # Privacy, terms, cookies
├── (marketing)/     # Landing, features, pricing, about, docs, blog
│   └── blog/        # Blog index + [slug] detail pages
├── api/
│   └── health/      # Health check endpoint (rate-limited)
├── layout.tsx       # Root layout - providers, fonts, metadata
├── not-found.tsx    # Custom 404 page
├── error.tsx        # App-level error boundary
└── global-error.tsx # Root error boundary (catches layout errors)
```

### (marketing)

Public pages with `HeroHeader` and `Footer`. No auth required. Includes the blog at `/blog` with individual post pages at `/blog/[slug]`.

### (auth)

Clerk's sign-in/sign-up catch-all routes. Centered layout.

### (dashboard)

Protected area. Uses sidebar layout with `useSyncUser` to keep Convex in sync with Clerk.

### (legal)

Static legal pages sharing a minimal layout.

## Provider Stack

Providers wrap the app in this order (see `layout.tsx`):

```
ThemeProvider          - next-themes (light/dark/system)
  PostHogProvider      - Analytics client
    ClerkProvider      - Auth (adapts to theme)
      PostHogIdentify  - Links Clerk user to PostHog
      PostHogPageview  - Tracks route changes
      TooltipProvider  - UI tooltips
        ConvexProvider - Realtime database (uses Clerk auth)
```

## Data Flow

### User Sync

```
Clerk (auth source of truth)
  > useSyncUser hook (client-side)
    > Convex createOrUpdateUser mutation
      > Convex users table
```

The `useSyncUser` hook runs on auth'd pages. It compares the Clerk user with the Convex record and only writes when data has changed (email, name, avatar, plan).

### Plan Detection

```
Clerk Billing (has plan: "pro")
  > useUserPlan hook
    > returns { plan, isPro, isFree, isLoading }
```

No separate billing table - plan is derived from Clerk's `has()` check and synced to Convex for server-side access.

## API Routes

- `GET /api/health` - returns `{ status, timestamp, uptime }`. Rate-limited to 30 req/min per IP via the in-memory sliding window limiter in `src/lib/rate-limit.ts`.

## Blog

Posts are defined as a simple array in `src/lib/blog.ts`. No MDX or CMS - just add an object to `BLOG_POSTS` and the blog index + detail page + sitemap + JSON-LD are generated automatically.

## Email Templates

HTML email templates live in `src/lib/emails/`. Each exports a function returning raw HTML compatible with any email provider (Resend, SendGrid, etc.):

- `welcomeEmail({ name })` - new user welcome
- `planChangedEmail({ name, previousPlan, newPlan })` - plan upgrade/downgrade

## Rate Limiting

`src/lib/rate-limit.ts` provides a sliding window rate limiter for API routes. In-memory - suitable for single-instance or low-traffic Vercel serverless. Swap with Upstash Redis for multi-instance production.

## Key Files

| File                                 | Purpose                             |
| ------------------------------------ | ----------------------------------- |
| `src/lib/constants.ts`               | SEO config, routes, structured data |
| `src/lib/structured-data.tsx`        | JSON-LD components for SEO          |
| `src/lib/blog.ts`                    | Blog post data & helpers            |
| `src/lib/rate-limit.ts`              | In-memory rate limiter              |
| `src/lib/emails/`                    | HTML email templates                |
| `src/lib/sentry.ts`                  | Error tracking helpers              |
| `src/lib/convex-client-provider.tsx` | Convex + Clerk integration          |
| `src/hooks/use-sync-user.ts`         | Clerk to Convex user sync           |
| `src/hooks/use-user-plan.ts`         | Plan gating hook                    |
| `src/hooks/use-mobile.ts`            | Responsive breakpoint detection     |
| `convex/schema.ts`                   | Database schema                     |
| `convex/users.ts`                    | User CRUD mutations/queries         |
