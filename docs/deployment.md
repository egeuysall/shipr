# Deployment

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```sh
cp .env.example .env
```

| Variable                            | Description                                        | Required |
| ----------------------------------- | -------------------------------------------------- | -------- |
| `NEXT_PUBLIC_SITE_URL`              | Your production URL (e.g. `https://shipr.dev`)     | Yes      |
| `NEXT_PUBLIC_CONVEX_URL`            | Convex deployment URL                              | Yes      |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key                              | Yes      |
| `CLERK_SECRET_KEY`                  | Clerk secret key                                   | Yes      |
| `CLERK_JWT_ISSUER_DOMAIN`           | Clerk JWT issuer for Convex auth                   | Yes      |
| `RESEND_API_KEY`                    | Resend API key for transactional emails            | Yes      |
| `RESEND_FROM_EMAIL`                 | Sender address (defaults to onboarding@resend.dev) | Optional |
| `NEXT_PUBLIC_POSTHOG_KEY`           | PostHog project API key                            | Optional |
| `NEXT_PUBLIC_POSTHOG_HOST`          | PostHog ingest host                                | Optional |
| `SENTRY_AUTH_TOKEN`                 | Sentry auth token for source maps                  | Optional |

## Vercel

1. Push your repo to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Add all environment variables in the Vercel dashboard
4. Deploy - Vercel auto-detects Next.js

### Build settings

Vercel should auto-detect these, but if not:

- **Framework:** Next.js
- **Build command:** `pnpm build`
- **Output directory:** `.next`

## Convex

1. Install the CLI: `pnpm add -g convex`
2. Run `npx convex dev` locally to sync your schema
3. For production, deploy with `npx convex deploy`
4. Set `CLERK_JWT_ISSUER_DOMAIN` in the [Convex dashboard](https://dashboard.convex.dev) under Authentication

## Clerk

1. Create a project at [clerk.com](https://clerk.com)
2. Copy your keys to `.env`
3. Enable Clerk Billing if you want Pro/Free plan gating
4. Configure the JWT issuer domain for Convex integration

## Sentry

1. Create a project at [sentry.io](https://sentry.io)
2. Add `SENTRY_AUTH_TOKEN` to your environment
3. Source maps are uploaded automatically during build via `@sentry/nextjs`
4. Error tracking works out of the box - see `src/lib/sentry.ts` for helpers

## Resend

1. Create an account at [resend.com](https://resend.com)
2. Add a verified domain (or use the sandbox sender for testing)
3. Copy your API key and add `RESEND_API_KEY` to `.env`
4. Optionally set `RESEND_FROM_EMAIL` to your verified sender address (e.g. `hello@yourdomain.com`)
5. The `POST /api/email` route and the `sendEmail` helper in `src/lib/emails/send.ts` will use these values at runtime

## PostHog

1. Create a project at [posthog.com](https://posthog.com)
2. Add `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env`
3. The app uses a reverse proxy via Next.js rewrites to bypass ad blockers (configured in `next.config.ts`)
