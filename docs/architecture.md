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
| Email          | Resend                     |

## Route Groups

```
src/app/
├── (auth)/          # Sign-in, sign-up pages (Clerk)
├── (dashboard)/     # Protected pages (requires auth)
├── (legal)/         # Privacy, terms, cookies
├── (marketing)/     # Landing, features, pricing, about, docs, blog
│   └── blog/        # Blog index + [slug] detail pages
├── api/
│   ├── email/       # Send transactional emails via Resend
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

- `POST /api/email` - sends a transactional email to the authenticated user via Resend. Protected by Clerk auth and rate-limited to 10 req/min per IP. Accepts a JSON body with a `template` field (`"welcome"` or `"plan-changed"`) and the template's required data.
- `GET /api/health` - returns `{ status, timestamp, uptime }`. Rate-limited to 30 req/min per IP via the in-memory sliding window limiter in `src/lib/rate-limit.ts`.

## Blog

Posts are defined as a simple array in `src/lib/blog.ts`. No MDX or CMS - just add an object to `BLOG_POSTS` and the blog index + detail page + sitemap + JSON-LD are generated automatically.

## Email (Resend)

Transactional emails are sent via [Resend](https://resend.com). Everything lives in `src/lib/emails/`:

- `send.ts` - `sendEmail()` helper that wraps the Resend SDK (lazily initialized)
- `welcome.ts` - `welcomeEmail({ name })` returns `{ subject, html }`
- `plan-changed.ts` - `planChangedEmail({ name, previousPlan, newPlan })` returns `{ subject, html }`
- `index.ts` - barrel exports for all templates and the send helper

Use `sendEmail()` in any server context (API routes, server actions):

```ts
import { sendEmail, welcomeEmail } from "@/lib/emails";

const { subject, html } = welcomeEmail({ name: "Ege" });
await sendEmail({ to: "ege@example.com", subject, html });
```

Requires `RESEND_API_KEY` in `.env`. Optionally set `RESEND_FROM_EMAIL` to override the default sender address.

## Rate Limiting

`src/lib/rate-limit.ts` provides a sliding window rate limiter for API routes. In-memory - suitable for single-instance or low-traffic Vercel serverless. Swap with Upstash Redis for multi-instance production.

## Key Files

| File                                 | Purpose                             |
| ------------------------------------ | ----------------------------------- |
| `src/lib/constants.ts`               | SEO config, routes, structured data |
| `src/lib/structured-data.tsx`        | JSON-LD components for SEO          |
| `src/lib/blog.ts`                    | Blog post data & helpers            |
| `src/lib/rate-limit.ts`              | In-memory rate limiter              |
| `src/lib/emails/send.ts`             | Resend sendEmail helper             |
| `src/lib/emails/`                    | Email templates (welcome, plan)     |
| `src/app/api/email/route.ts`         | Send email API route                |
| `src/lib/sentry.ts`                  | Error tracking helpers              |
| `src/lib/convex-client-provider.tsx` | Convex + Clerk integration          |
| `src/hooks/use-sync-user.ts`         | Clerk to Convex user sync           |
| `src/hooks/use-user-plan.ts`         | Plan gating hook                    |
| `src/hooks/use-mobile.ts`            | Responsive breakpoint detection     |
| `convex/schema.ts`                   | Database schema                     |
| `convex/users.ts`                    | User CRUD mutations/queries         |
