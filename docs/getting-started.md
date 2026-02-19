# Getting Started

## Stack

| Layer          | Tech                                 |
| -------------- | ------------------------------------ |
| Framework      | Next.js 16 (App Router)              |
| Auth           | Clerk (Organizations)                |
| Database       | Convex                               |
| Styling        | Tailwind CSS 4 + shadcn/ui + Base UI |
| Analytics      | PostHog (reverse-proxied)            |
| Error Tracking | Sentry                               |
| Fonts          | Geist Sans / Mono / Pixel Square     |
| Deployment     | Vercel                               |

## Branch Scope

This branch is the dedicated multi-tenant variant (`feat/multi-tenancy`) and is intended for apps that require organization-based tenancy.

## Prerequisites

- Node.js 18+
- pnpm
- Clerk project with Organizations enabled
- Convex project
- (Optional) PostHog and Sentry accounts

## Setup

```bash
git clone <repo-url> && cd shipr
pnpm install
cp .env.example .env
```

Fill `.env`, then run:

```bash
npx convex dev
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Clerk Setup (Required for Tenancy)

1. Enable Organizations in Clerk Dashboard.
2. Ensure org roles are available (`org:admin`, `org:member`).
3. (Optional) Configure custom organization permissions matching `src/lib/auth/rbac.ts`.
4. Configure org billing plans if using paid tiers.

## Route Behavior

- Signed-out users are redirected to sign-in for protected routes.
- Signed-in users without an active org are redirected to `/onboarding`.
- Dashboard usage requires an active organization context.

## Project Structure Highlights

```
src/
├── app/
│   ├── (dashboard)/onboarding/page.tsx
│   ├── api/chat/route.ts
│   └── api/email/route.ts
├── lib/
│   ├── auth/rbac.ts
│   └── convex-client-provider.tsx
convex/
├── lib/auth.ts
├── schema.ts
├── users.ts
├── files.ts
└── chat.ts
```

## Environment Variables

See `.env.example` for full list.

| Variable                                 | Purpose                                                                 |
| ---------------------------------------- | ----------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                   | Canonical site URL                                                      |
| `NEXT_PUBLIC_CLERK_*`                    | Clerk auth config                                                       |
| `NEXT_PUBLIC_CONVEX_URL`                 | Convex deployment URL                                                   |
| `CLERK_JWT_ISSUER_DOMAIN`                | Clerk JWT issuer (Convex)                                               |
| `AI_GATEWAY_API_KEY`                     | Vercel AI Gateway key for `/api/chat`                                   |
| `RESEND_API_KEY`                         | Resend API key for transactional emails                                 |
| `NEXT_PUBLIC_POSTHOG_KEY`                | PostHog project API key                                                 |
| `NEXT_PUBLIC_POSTHOG_HOST`               | PostHog ingest host                                                     |

## Notes

- Chat and file modules are workspace-shared and org-scoped.
- Onboarding remains account-level per user.
- Billing checks are organization-scoped in this branch.
