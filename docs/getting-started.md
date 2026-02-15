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
│   │   ├── email/       # Send transactional emails via Resend
│   │   └── health/      # Health check endpoint (rate-limited)
│   ├── onboarding/      # Multi-step onboarding flow for new users
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
│   ├── use-mobile.ts      # Responsive breakpoint hook
│   ├── use-onboarding.ts  # Check onboarding status & redirect logic
│   ├── use-sync-user.ts   # Syncs Clerk user to Convex
│   └── use-user-plan.ts   # Reads current billing plan
├── lib/
│   ├── blog.ts          # Blog post data & helpers
│   ├── constants.ts     # SEO, routes, structured data config
│   ├── emails/          # Email templates + Resend send helper
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

| Variable                        | Purpose                                                        |
| ------------------------------- | -------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`          | Canonical site URL                                             |
| `NEXT_PUBLIC_CLERK_*`           | Clerk auth config                                              |
| `NEXT_PUBLIC_CONVEX_URL`        | Convex deployment URL                                          |
| `CLERK_JWT_ISSUER_DOMAIN`       | Clerk JWT issuer (Convex)                                      |
| `RESEND_API_KEY`                | Resend API key for transactional emails                        |
| `RESEND_FROM_EMAIL`             | Sender address (optional, defaults to `onboarding@resend.dev`) |
| `NEXT_PUBLIC_POSTHOG_KEY`       | PostHog project API key                                        |
| `NEXT_PUBLIC_POSTHOG_HOST`      | PostHog ingest host                                            |
| `SENTRY_ORG` / `SENTRY_PROJECT` | Sentry source map uploads                                      |

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

- `GET /api/health` - returns uptime and a timestamp, rate-limited to 30 req/min per IP.
- `POST /api/email` - sends a transactional email to the authenticated user via Resend. Protected by Clerk auth and rate-limited to 10 req/min per IP. See the [Email (Resend)](#email-resend) section below.

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

## Email (Resend)

Transactional emails are sent via [Resend](https://resend.com). Templates and the send helper live in `src/lib/emails/`.

### Setup

1. Create an account at [resend.com](https://resend.com) and grab your API key.
2. Add the key to `.env`:
   ```
   RESEND_API_KEY=re_...
   RESEND_FROM_EMAIL=hello@yourdomain.com
   ```
3. If you are testing locally without a verified domain, leave `RESEND_FROM_EMAIL` unset and Resend will use its sandbox sender (`onboarding@resend.dev`).

### Templates

Each template exports a function returning `{ subject, html }`:

- `welcomeEmail({ name })` - welcome email for new sign-ups
- `planChangedEmail({ name, previousPlan, newPlan })` - plan upgrade/downgrade notification

### Sending emails server-side

Use the `sendEmail` helper in any server context (API routes, server actions):

```ts
import { sendEmail, welcomeEmail } from "@/lib/emails";

const { subject, html } = welcomeEmail({ name: "Ege" });
const result = await sendEmail({ to: "ege@example.com", subject, html });

if (!result.success) {
  console.error("Email failed:", result.error);
}
```

### API route

`POST /api/email` sends a template email to the currently authenticated user. It reads the user's email from Clerk, so the caller only provides the template and its data.

```json
{ "template": "welcome", "name": "Ege" }
```

```json
{
  "template": "plan-changed",
  "name": "Ege",
  "previousPlan": "free",
  "newPlan": "pro"
}
```

The route is Clerk-authenticated and rate-limited to 10 requests per minute.

## Onboarding

New users are automatically redirected to `/onboarding` on their first dashboard visit. The onboarding flow is a clean, multi-step process that:

- Welcomes users and shows what to expect
- Reviews their profile information from Clerk
- Shows next steps and tips
- Tracks completion state in Convex

### How it works

1. **Tracking**: The `onboardingCompleted` and `onboardingStep` fields in the Convex `users` table track progress.
2. **Hook**: The `useOnboarding` hook checks status and redirects appropriately.
3. **Auto-redirect**: The `DashboardShell` component calls `useOnboarding()` to enforce the flow.
4. **Skip option**: Users can skip onboarding and come back later.

### Customizing steps

Edit `src/app/(dashboard)/onboarding/page.tsx` to add your own steps. The current steps are:

1. **Welcome** - Introduction and overview
2. **Profile** - Show user info from Clerk
3. **Preferences** - Final step before completion

Add new steps by:

1. Adding the step to the `STEPS` array
2. Adding a case to the `renderStep()` function
3. Updating the `OnboardingStep` type in `convex/users.ts`

### Reset onboarding

For testing, you can reset a user's onboarding via the Convex dashboard or by calling the `resetOnboarding` mutation.
