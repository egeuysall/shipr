# Deployment

## Environment Variables

Copy `.env.example` and fill values:

```sh
cp .env.example .env
```

Key required variables:

| Variable                            | Description                                        |
| ----------------------------------- | -------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`              | Production URL                                     |
| `NEXT_PUBLIC_CONVEX_URL`            | Convex deployment URL                              |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key                              |
| `CLERK_SECRET_KEY`                  | Clerk secret key                                   |
| `CLERK_JWT_ISSUER_DOMAIN`           | Clerk JWT issuer for Convex                        |
| `AI_GATEWAY_API_KEY`                | Vercel AI Gateway key for dashboard chat           |
| `RESEND_API_KEY`                    | Resend API key for transactional email             |

## Multi-tenant Requirements

This branch requires Clerk Organizations.

Before deploying:

1. Enable Organizations in Clerk.
2. Ensure users can create/join organizations.
3. Configure organization roles (`org:admin`, `org:member`).
4. (Optional) Configure custom permissions matching `src/lib/auth/rbac.ts`.
5. If using paid plans, configure Clerk Billing for organizations.
6. Configure Clerk JWT template `convex` with `org_id`, `org_role`, and `org_permissions` claims.

## Vercel

1. Push branch to GitHub.
2. Import in [Vercel](https://vercel.com/new).
3. Add environment variables.
4. Deploy with `pnpm build`.

## Convex

1. Run `npx convex dev` locally while developing.
2. Deploy with `npx convex deploy`.
3. Ensure `CLERK_JWT_ISSUER_DOMAIN` is configured in Convex auth settings.

## Clerk

1. Create/select your Clerk project.
2. Configure sign-in/sign-up URLs.
3. Enable Organizations.
4. Verify active-org claims are available in sessions.

## Security Checklist

- Confirm `/dashboard` and `/onboarding` are protected.
- Confirm authenticated users without active org are redirected to `/onboarding`.
- Confirm cross-org data reads/writes are denied in Convex.
