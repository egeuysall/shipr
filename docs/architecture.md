# Architecture

## Tech Stack

| Layer          | Tool                       |
| -------------- | -------------------------- |
| Framework      | Next.js 16 (App Router)    |
| Auth           | Clerk (Organizations)      |
| Database       | Convex                     |
| Styling        | Tailwind CSS 4             |
| Analytics      | PostHog + Vercel Analytics |
| Error Tracking | Sentry                     |
| Payments       | Clerk Billing              |
| Email          | Resend                     |

## Multi-tenant Model

This branch is organization-first.

- Tenant boundary: Clerk active organization (`orgId`)
- Workspace data: organization-scoped Convex records
- Personal workspace path: hidden in organization picker
- Billing scope: active organization plan

## Route Groups

```
src/app/
├── (auth)/
├── (dashboard)/
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── files/page.tsx
│   │   ├── chat/page.tsx
│   └── onboarding/page.tsx
├── (legal)/
├── (marketing)/
└── api/
```

## Middleware + Guarding

`src/proxy.ts` enforces:

- auth protection on `/dashboard(.*)` and `/onboarding(.*)`
- redirect to `/onboarding` when signed in without active org

## Provider Stack

Providers in `src/app/layout.tsx`:

```
ThemeProvider
  PostHogProvider
    ClerkProvider
      PostHogIdentify
      PostHogPageview
      TooltipProvider
        ConvexProviderWithClerk
```

## Data Model

### Account-level

`users` table remains per user (`clerkId` keyed):

- profile
- onboarding state
- synced plan snapshot

### Organization-level

`files`, `chatThreads`, and `chatMessages` are organization-scoped via `orgId`.

## Access Control

- Shared RBAC constants: `src/lib/auth/rbac.ts`
- Convex auth guards: `convex/lib/auth.ts`
- API routes enforce active org context
- Convex functions fail closed on missing auth/org/permissions

## Billing Flow

- Pricing table uses organization billing mode.
- Plan checks use active-org Clerk context.

## Key Files

| File                                  | Purpose                                      |
| ------------------------------------- | -------------------------------------------- |
| `src/lib/auth/rbac.ts`                | Shared role/permission constants + helpers   |
| `convex/lib/auth.ts`                  | Convex auth/org/permission guard helpers     |
| `convex/schema.ts`                    | Org-scoped data schema                       |
| `convex/files.ts`                     | Workspace file access + validation           |
| `convex/chat.ts`                      | Workspace chat access + persistence          |
| `convex/users.ts`                     | Account-level user sync + onboarding         |
| `src/proxy.ts`                        | Auth + org-required route guarding           |
| `src/components/app-sidebar.tsx`      | Sidebar navigation + OrganizationSwitcher    |
| `src/app/(dashboard)/onboarding/page.tsx` | Organization selection/creation entry screen |
