# Shipr -- Production Setup Plan

> Comprehensive step-by-step guide for preparing this Next.js SaaS application for production deployment.
> This document covers integration configuration, analytics, error tracking, code quality, documentation, environment variables, and deployment.

---

## Table of Contents

1. [Clerk + Convex Integration](#1-clerk--convex-integration)
2. [PostHog Analytics Integration](#2-posthog-analytics-integration)
3. [Sentry Error Tracking](#3-sentry-error-tracking)
4. [Code Polish Recommendations](#4-code-polish-recommendations)
5. [Documentation (README.md)](#5-documentation-readmemd)
6. [Environment Variables](#6-environment-variables)
7. [Deployment Steps to Vercel](#7-deployment-steps-to-vercel)

---

## 1. Clerk + Convex Integration

### 1.1 Current State Assessment

The project already has:

- A `users` table in `convex/schema.ts` with fields: `clerkId`, `email`, `name`, `imageUrl`, `createdAt`
- An index `by_clerk_id` on the users table
- A `createOrUpdateUser` mutation and `getUserByClerkId` query in `convex/users.ts`
- A `useSyncUser` hook (`src/hooks/use-sync-user.ts`) that syncs Clerk user data to Convex on the client side
- A `useUserPlan` hook that reads the plan from Clerk `publicMetadata`
- Clerk middleware in `src/proxy.ts` protecting `/dashboard(.*)` routes
- Clerk Billing via `<PricingTable>` on the `/pricing` page

### 1.2 Extend the Convex Schema

Add the following tables to `convex/schema.ts` to support subscriptions and role-based data:

**subscriptions table:**

- `userId` (string) -- references `users.clerkId`
- `plan` (string) -- e.g. "free", "pro"
- `status` (string) -- e.g. "active", "canceled", "past_due"
- `clerkSubscriptionId` (optional string) -- Clerk Billing subscription ID
- `currentPeriodEnd` (optional number) -- Unix timestamp of billing period end
- `createdAt` (number)
- `updatedAt` (number)
- Index: `by_user_id` on `["userId"]`
- Index: `by_clerk_subscription_id` on `["clerkSubscriptionId"]`

**Best practice:** Keep `users` as the source of truth for identity. Keep `subscriptions` as the source of truth for billing state. The `useUserPlan` hook currently reads from Clerk `publicMetadata`, which is fine -- Clerk Billing automatically sets this when a subscription is created/changed.

### 1.3 Clerk Webhooks for User Lifecycle

Set up Clerk webhooks to handle server-side user lifecycle events. This is more reliable than the current client-side-only `useSyncUser` approach, which misses cases where users never visit the dashboard.

**Steps:**

1. **Create a webhook endpoint** at `src/app/api/webhooks/clerk/route.ts`
   - This is a Next.js API route (App Router) that receives POST requests from Clerk
   - Install the `svix` package (`pnpm add svix`) for webhook signature verification

2. **Configure in Clerk Dashboard:**
   - Go to Clerk Dashboard -> Webhooks -> Add Endpoint
   - URL: `https://your-domain.com/api/webhooks/clerk`
   - Subscribe to events:
     - `user.created` -- Create a new user record in Convex
     - `user.updated` -- Update email, name, imageUrl in Convex
     - `user.deleted` -- Soft-delete or hard-delete user record in Convex
   - Copy the **Signing Secret** (starts with `whsec_`)

3. **Webhook handler logic:**
   - Verify the webhook signature using `svix` and the `CLERK_WEBHOOK_SECRET` env var
   - Parse the event type from the payload
   - For `user.created`: call a Convex mutation (via Convex HTTP client) to insert a new user
   - For `user.updated`: call a Convex mutation to update the user record
   - For `user.deleted`: call a Convex mutation to delete or mark the user as deleted
   - Return 200 on success, 400 on verification failure

4. **Convex HTTP client for server-side mutations:**
   - Use `ConvexHttpClient` from `convex/browser` in the webhook route
   - Initialize with `NEXT_PUBLIC_CONVEX_URL`
   - Call mutations like `client.mutation(api.users.createOrUpdateUser, { ... })`

5. **Add a `deleteUser` mutation to `convex/users.ts`:**
   - Accept `clerkId` as an argument
   - Find the user by the `by_clerk_id` index
   - Delete the document (or add an `isDeleted` flag for soft delete)

6. **Keep `useSyncUser` as a fallback:** The client-side hook provides real-time sync for profile changes. The webhook provides reliability for events that happen outside the app (account deletion, admin changes).

### 1.4 Clerk Billing Webhook Events

If using Clerk Billing (which this project does via `<PricingTable>`), also subscribe to these webhook events:

- `subscription.created` -- Record the new subscription in the Convex `subscriptions` table
- `subscription.updated` -- Update plan, status, and period end
- `subscription.deleted` -- Mark subscription as canceled

Clerk Billing automatically updates `publicMetadata.plan` on the Clerk user object, so the `useUserPlan` hook will continue to work without changes. The Convex `subscriptions` table serves as a queryable audit trail and enables server-side plan checks.

### 1.5 Convex Authentication with Clerk

To enforce auth in Convex mutations and queries (so users cannot read/write other users' data):

1. **Configure Clerk as an auth provider in Convex:**
   - Create `convex/auth.config.ts` with the Clerk issuer domain
   - The issuer domain is `https://<your-clerk-instance>.clerk.accounts.dev` (found in Clerk Dashboard -> API Keys)
   - Run `npx convex deploy` or `npx convex dev` to push the config

2. **Use `ctx.auth.getUserIdentity()` in Convex functions:**
   - In any query or mutation, call `const identity = await ctx.auth.getUserIdentity()`
   - If `identity` is null, the user is not authenticated -- throw an error or return null
   - Access `identity.subject` to get the Clerk user ID (same as `clerkId`)
   - Use this to scope all data access to the authenticated user

3. **Update `convex-client-provider.tsx`:**
   - Replace `ConvexProvider` with `ConvexProviderWithClerk` from `convex/react-clerk`
   - Pass the Clerk `useAuth` hook to enable automatic token forwarding
   - This ensures all Convex queries/mutations include the Clerk JWT

### 1.6 Role-Based Access Control

For enforcing permissions in Convex:

1. **Use Clerk `publicMetadata` for roles:**
   - Set roles (e.g., `admin`, `member`) in Clerk Dashboard or via Clerk Backend API
   - Access in Convex via `identity.publicMetadata` after configuring custom claims

2. **Create a helper function in Convex:**
   - `assertAuthenticated(ctx)` -- throws if user is not logged in
   - `assertPlan(ctx, requiredPlan)` -- checks the user's plan from the subscriptions table
   - Use these at the top of any mutation/query that requires auth or a specific plan

### 1.7 Environment Variables for Clerk + Convex

```
# Clerk (already present)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Clerk Webhooks (new)
CLERK_WEBHOOK_SECRET=whsec_...

# Convex (already present)
NEXT_PUBLIC_CONVEX_URL=https://...convex.cloud

# Convex Deploy Key (for CI/CD and production deploys)
CONVEX_DEPLOY_KEY=prod:...
```

### 1.8 Checklist

- [ ] Extend `convex/schema.ts` with `subscriptions` table
- [ ] Add `deleteUser` mutation to `convex/users.ts`
- [ ] Create `convex/auth.config.ts` with Clerk issuer domain
- [ ] Update `convex-client-provider.tsx` to use `ConvexProviderWithClerk`
- [ ] Create webhook route at `src/app/api/webhooks/clerk/route.ts`
- [ ] Install `svix` package for webhook verification
- [ ] Configure Clerk Dashboard webhooks (user.created, user.updated, user.deleted)
- [ ] Configure Clerk Billing webhook events if desired
- [ ] Add `CLERK_WEBHOOK_SECRET` to `.env` and `.env.example`
- [ ] Add auth helper functions in Convex for role/plan checks
- [ ] Test user creation, update, and deletion flows end-to-end
- [ ] Test billing subscription lifecycle

---

## 2. PostHog Analytics Integration

### 2.1 Account Setup

1. **Create a PostHog account** at https://posthog.com (or use PostHog Cloud)
2. **Create a new project** for Shipr
3. **Copy the Project API Key** (starts with `phc_`) and the **Host** URL
   - Cloud US: `https://us.i.posthog.com`
   - Cloud EU: `https://eu.i.posthog.com`
   - Self-hosted: your PostHog instance URL

### 2.2 Install the SDK

```
pnpm add posthog-js
```

### 2.3 Create a PostHog Provider (Client-Side Only)

Create `src/components/posthog-provider.tsx`:

- Mark with `"use client"` directive
- Import `posthog-js` and `PostHogProvider` from `posthog-js/react`
- Initialize PostHog only once using `useEffect` or a module-level check
- Configuration options:
  - `api_host`: from `NEXT_PUBLIC_POSTHOG_HOST` env var
  - `capture_pageview`: set to `false` (handle manually for Next.js App Router)
  - `capture_pageleave`: set to `true`
  - `person_profiles`: set to `"identified_only"`
- Wrap children with `<PostHogProvider client={posthogClient}>`

### 2.4 Create a Page View Tracker Component

Create `src/components/posthog-pageview.tsx`:

- Mark with `"use client"` directive
- Use `usePathname()` and `useSearchParams()` from `next/navigation`
- Call `posthog.capture('$pageview')` whenever the pathname or search params change
- Wrap in `useEffect` with `pathname` and `searchParams` as dependencies
- Wrap the component in `<Suspense>` when used in layout to handle search params

### 2.5 Add to Root Layout

In `src/app/layout.tsx`:

- Import and wrap the app with `<PostHogProvider>`
- Place `<PostHogPageview />` component inside the provider
- Position the PostHog provider inside `<ClerkProviderWrapper>` but outside `<ConvexClientProvider>` (PostHog does not depend on Convex)

### 2.6 Identify Users After Auth

- After a user signs in (or in the `useSyncUser` hook), call `posthog.identify(user.id, { email, name, plan })`
- On sign-out, call `posthog.reset()` to clear the identified user
- This links anonymous events to authenticated user profiles

### 2.7 Custom Events to Track

Track these events throughout the app by calling `posthog.capture('event_name', { properties })`:

| Event Name               | Where to Trigger                 | Properties                    |
| ------------------------ | -------------------------------- | ----------------------------- |
| `user_signed_up`         | After Clerk sign-up completes    | `method` (email, OAuth)       |
| `user_signed_in`         | After Clerk sign-in completes    | `method`                      |
| `pricing_page_viewed`    | `/pricing` page load             | `plan_current`                |
| `upgrade_button_clicked` | `UpgradeButton` component        | `source` (dashboard, sidebar) |
| `plan_subscribed`        | After successful subscription    | `plan`, `price`               |
| `plan_canceled`          | After subscription cancellation  | `plan`, `reason`              |
| `dashboard_viewed`       | `/dashboard` page load           | `plan`                        |
| `feature_used`           | When a user uses a gated feature | `feature_name`, `plan`        |

### 2.8 Environment Variables for PostHog

```
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Both must be prefixed with `NEXT_PUBLIC_` since PostHog runs client-side only.

### 2.9 Checklist

- [ ] Create PostHog account and project
- [ ] Install `posthog-js` package
- [ ] Create `src/components/posthog-provider.tsx` (client-side only)
- [ ] Create `src/components/posthog-pageview.tsx` for route tracking
- [ ] Add PostHog provider and pageview tracker to root layout
- [ ] Identify users after auth with `posthog.identify()`
- [ ] Reset PostHog on sign-out with `posthog.reset()`
- [ ] Instrument custom events (sign-up, upgrade click, plan subscribe, etc.)
- [ ] Add `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env` and `.env.example`
- [ ] Verify events appear in PostHog dashboard after testing locally
- [ ] Optionally configure PostHog feature flags for gradual rollouts

---

## 3. Sentry Error Tracking

### 3.1 Account Setup

1. **Create a Sentry account** at https://sentry.io
2. **Create a new project** -- select "Next.js" as the platform
3. **Copy the DSN** (Data Source Name) from the project settings

### 3.2 Run the Sentry Wizard

The Sentry wizard handles most of the configuration automatically:

```
pnpm dlx @sentry/wizard@latest -i nextjs
```

The wizard will:

- Install `@sentry/nextjs` package
- Create `sentry.client.config.ts` -- client-side Sentry initialization
- Create `sentry.server.config.ts` -- server-side Sentry initialization
- Create `sentry.edge.config.ts` -- edge runtime initialization
- Update `next.config.ts` to wrap with `withSentryConfig()`
- Create `src/app/global-error.tsx` -- global error boundary component
- Create `.env.sentry-build-plugin` with auth token (already in `.gitignore`)

### 3.3 Configuration Details

**`sentry.client.config.ts` (project root):**

- Set `dsn` to the Sentry DSN from env var `NEXT_PUBLIC_SENTRY_DSN`
- Set `tracesSampleRate` to `1.0` in development, `0.1` to `0.3` in production
- Set `replaysSessionSampleRate` to `0.1` (10% of sessions recorded)
- Set `replaysOnErrorSampleRate` to `1.0` (100% of error sessions recorded)
- Add `Sentry.replayIntegration()` for session replay
- Set `environment` based on `process.env.NODE_ENV`

**`sentry.server.config.ts` (project root):**

- Set `dsn` from env var `NEXT_PUBLIC_SENTRY_DSN`
- Set `tracesSampleRate` to `0.1` to `0.3` in production
- Set `environment` based on `process.env.NODE_ENV`

**`sentry.edge.config.ts` (project root):**

- Same DSN and sample rate as server config
- Required for middleware and edge API routes

**`next.config.ts` updates:**

- Wrap the existing config with `withSentryConfig(nextConfig, sentryOptions)`
- Set `org` and `project` in Sentry options to match your Sentry organization and project slugs
- Set `silent: !process.env.CI` to suppress build logs locally
- Enable source map upload: `widenClientFileUpload: true`
- Optionally enable `tunnelRoute: "/monitoring"` to proxy Sentry events through your domain (avoids ad blockers)
- Set `disableLogger: true` to remove Sentry logger statements from production bundle

### 3.4 Global Error Boundary

The wizard creates `src/app/global-error.tsx`. Verify it:

- Catches all unhandled errors at the app level
- Reports errors to Sentry via `Sentry.captureException(error)`
- Renders a user-friendly fallback UI with a "Try again" button
- Must be a Client Component (`"use client"`)
- Receives `error` and `reset` props

Also consider creating route-level `error.tsx` files:

- `src/app/(dashboard)/error.tsx` -- dashboard-specific error UI
- `src/app/(marketing)/error.tsx` -- marketing-specific error UI

These catch errors within their route segment and show contextual recovery UI.

### 3.5 Sentry User Context

After a user authenticates, set Sentry user context so errors are associated with users:

- In the `useSyncUser` hook or a dedicated component, call:
  ```
  Sentry.setUser({ id: user.id, email: user.email, username: user.fullName })
  ```
- On sign-out, call `Sentry.setUser(null)` to clear the context

### 3.6 Helper Functions

Create `src/lib/sentry.ts` with utility functions:

- `captureError(error, context?)` -- wraps `Sentry.captureException()` with optional additional context
- `captureMessage(message, level?)` -- wraps `Sentry.captureMessage()` for non-error events
- `addBreadcrumb(category, message, data?)` -- wraps `Sentry.addBreadcrumb()` for tracking user actions

Use these throughout the app instead of direct Sentry imports to centralize configuration and make it easy to swap providers.

### 3.7 Environment Variables for Sentry

```
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_AUTH_TOKEN=sntrys_...
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=shipr
```

Note: `SENTRY_AUTH_TOKEN` is only needed at build time for source map uploads. It should be set in CI/CD (Vercel) but never committed. The `.env.sentry-build-plugin` file is already in `.gitignore`.

### 3.8 Checklist

- [ ] Create Sentry account and project (Next.js platform)
- [ ] Run `pnpm dlx @sentry/wizard@latest -i nextjs`
- [ ] Review and configure `sentry.client.config.ts` (DSN, sample rates, replay)
- [ ] Review and configure `sentry.server.config.ts` (DSN, sample rates)
- [ ] Review and configure `sentry.edge.config.ts` (DSN, sample rates)
- [ ] Verify `next.config.ts` is wrapped with `withSentryConfig()`
- [ ] Verify `src/app/global-error.tsx` exists and renders a proper fallback
- [ ] Optionally create route-level `error.tsx` files for dashboard and marketing
- [ ] Create `src/lib/sentry.ts` with helper functions
- [ ] Set Sentry user context after auth, clear on sign-out
- [ ] Add all Sentry env vars to `.env`, `.env.example`, and Vercel
- [ ] Test by throwing a test error and verifying it appears in the Sentry dashboard
- [ ] Configure Sentry alerts (email/Slack notifications) for new errors

---

## 4. Code Polish Recommendations

### 4.1 Console Logs

**Current status:** No `console.log`, `console.warn`, `console.error`, `console.debug`, or `console.info` calls found in `src/` or `convex/` directories. No action needed.

**Best practice going forward:** Add an ESLint rule to prevent accidental console logs in production:

- Add `"no-console": ["warn", { "allow": ["warn", "error"] }]` to the ESLint config
- This allows `console.warn` and `console.error` while flagging `console.log`

### 4.2 ESLint Errors and Warnings

**Current issues (23 total -- 19 errors, 4 warnings):**

**19 errors -- Unescaped entities in legal pages:**

- `src/app/(legal)/cookies/page.tsx` -- 5 instances of unescaped `'` and `"`
- `src/app/(legal)/privacy/page.tsx` -- 6 instances of unescaped `"`
- `src/app/(legal)/terms/page.tsx` -- 8 instances of unescaped `"`

**Fix:** Replace raw `"` with `&quot;` and raw `'` with `&apos;` in JSX text content across all three legal pages.

**4 warnings -- Unused eslint-disable directives in Convex generated files:**

- `convex/_generated/api.js`
- `convex/_generated/dataModel.d.ts`
- `convex/_generated/server.d.ts`
- `convex/_generated/server.js`

**Fix:** Add `convex/_generated/` to the ESLint `globalIgnores` array in `eslint.config.mjs`. These files are auto-generated by Convex and should not be linted.

### 4.3 TypeScript Improvements

**Items to address:**

1. **Middleware file naming:** The Clerk middleware is in `src/proxy.ts`. Next.js expects middleware at `src/middleware.ts` (or `middleware.ts` at the root). Verify that this file is actually being picked up -- if it works, it may be using a Clerk-specific convention, but renaming to `middleware.ts` is the standard approach and is more maintainable.

2. **`useMemo` missing dependency in `convex-client-provider.tsx`:**
   - Line 9: `useMemo(() => { ... }, [])` has an empty dependency array but references `CONVEX_URL` which is a module-level constant. This is technically fine since module constants never change, but adding a comment explaining this suppresses confusion.

3. **Add explicit return types to custom hooks:**
   - `useSyncUser` -- add a return type annotation: `{ user, convexUser, isLoaded }`
   - The `useUserPlan` hook already has an explicit return type, which is good

4. **Component prop types:**
   - Review all components for proper TypeScript interfaces/types on props
   - The `AppSidebar` uses `React.ComponentProps<typeof Sidebar>` spread which is correct

### 4.4 TODO Comments

**Found 2 TODO comments:**

1. `src/app/(marketing)/docs/page.tsx` line 39:

   ```
   // TODO: Replace with actual documentation content or link to external docs site
   ```

   **Action:** Either replace the placeholder content before launch or remove the docs page from navigation if not ready.

2. `src/app/(marketing)/about/page.tsx` line 10:
   ```
   // TODO: Replace placeholder content with actual company info, team photos, and mission statement
   ```
   **Action:** Replace placeholder content with real company information before launch.

### 4.5 File Structure Organization

The current structure is well-organized with route groups. Recommended improvements:

```
src/
  app/
    (auth)/          -- sign-in, sign-up (good)
    (dashboard)/     -- dashboard routes (good)
    (legal)/         -- terms, privacy, cookies (good)
    (marketing)/     -- landing, pricing, features, about, docs (good)
    api/
      webhooks/
        clerk/
          route.ts   -- NEW: Clerk webhook handler
    layout.tsx       -- root layout
    globals.css
    global-error.tsx -- NEW: Sentry error boundary
  components/
    billing/         -- billing-related components (good)
    dashboard/       -- dashboard-specific components (good)
    ui/              -- shadcn/ui components (good)
    posthog-provider.tsx   -- NEW: PostHog wrapper
    posthog-pageview.tsx   -- NEW: page view tracker
  hooks/             -- custom hooks (good)
  lib/
    utils.ts         -- utility functions (good)
    convex-client-provider.tsx  -- Convex provider (good)
    sentry.ts        -- NEW: Sentry helper functions
convex/
  schema.ts          -- database schema
  users.ts           -- user mutations/queries
  auth.config.ts     -- NEW: Clerk auth config for Convex
  _generated/        -- auto-generated (gitignored)
```

### 4.6 Unused Imports and Dead Code

Run `pnpm lint` after fixing the ESLint issues to verify no unused imports remain. Additionally:

- Check for any unused components in `src/components/` (e.g., `example.tsx` -- review if this is a template file that should be removed)
- Check for unused UI components in `src/components/ui/` -- keep them even if currently unused since they are shadcn/ui library components that may be used as the app grows

### 4.7 Checklist

- [ ] Fix 19 unescaped entity errors in legal pages (cookies, privacy, terms)
- [ ] Add `convex/_generated/` to ESLint `globalIgnores`
- [ ] Verify middleware file (`src/proxy.ts`) is correctly picked up or rename to `src/middleware.ts`
- [ ] Address TODO comments in docs and about pages
- [ ] Add `no-console` ESLint rule (warn level, allow warn/error)
- [ ] Review and remove `src/components/example.tsx` if it is a template placeholder
- [ ] Run `pnpm lint` and verify zero errors and zero warnings
- [ ] Run `pnpm build` and verify zero TypeScript errors

---

## 5. Documentation (README.md)

### 5.1 Structure for README.md

Replace the current minimal README with a comprehensive document covering these sections:

**1. Project Header**

- Project name, one-line description, badges (build status, license, Node version)
- Screenshot or GIF of the landing page / dashboard

**2. Overview**

- What Shipr is: a production-ready Next.js SaaS starter kit
- Key selling points: auth, billing, database, analytics, error tracking out of the box
- Tech stack summary table

**3. Tech Stack**
| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Package Manager | pnpm |
| Authentication | Clerk |
| Database | Convex |
| Billing | Clerk Billing |
| UI Components | shadcn/ui (Base Nova style) |
| Styling | Tailwind CSS v4 |
| Analytics | Vercel Analytics, PostHog |
| Error Tracking | Sentry |
| Deployment | Vercel |

**4. Quick Start**

- Prerequisites: Node.js >= 18, pnpm >= 9, Clerk account, Convex account
- Clone the repository
- Install dependencies: `pnpm install`
- Copy `.env.example` to `.env` and fill in values
- Start Convex dev server: `npx convex dev`
- Start Next.js dev server: `pnpm dev`
- Open `http://localhost:3000`

**5. Environment Variables**

- Link to or embed the complete environment variable table from Section 6 of this document
- Explain which are required vs. optional
- Explain the `NEXT_PUBLIC_` prefix convention

**6. Project Structure**

- Tree diagram of the `src/` and `convex/` directories
- Brief description of each directory and key file

**7. Features**

- Authentication (sign-in, sign-up, user management via Clerk)
- Billing and subscriptions (Clerk Billing, pricing page, plan gating)
- Dashboard (sidebar layout, breadcrumbs, user profile sync)
- Landing page (hero, features, testimonials, pricing, FAQs, CTA)
- Legal pages (terms, privacy, cookies)
- Dark mode support
- Responsive design

**8. Customization Guide**

- How to change branding (logo, colors, fonts)
- How to add new dashboard pages
- How to add new Convex tables and functions
- How to modify the pricing plans (Clerk Billing dashboard + pricing component)
- How to add custom PostHog events
- How to configure Sentry alert rules

**9. Deployment**

- Link to Section 7 of this document for detailed steps
- Quick summary: push to GitHub, import in Vercel, set env vars, deploy

**10. Scripts**
| Command | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `npx convex dev` | Start Convex dev server |
| `npx convex deploy` | Deploy Convex to production |

**11. Troubleshooting**

- Common issues and solutions:
  - "Convex not connecting": check `NEXT_PUBLIC_CONVEX_URL`
  - "Clerk auth not working": verify publishable key and secret key match the environment
  - "Webhook verification failing": ensure `CLERK_WEBHOOK_SECRET` matches the Clerk dashboard
  - "PostHog events not appearing": check `NEXT_PUBLIC_POSTHOG_KEY` and verify the host URL
  - "Sentry errors not showing": verify DSN and check sample rate configuration
  - "Build failing on Vercel": ensure all required env vars are set in the Vercel dashboard

**12. Contributing**

- Link to CODE_OF_CONDUCT.md
- Link to SECURITY.md
- PR guidelines

**13. License**

- Reference the LICENSE file in the repository

### 5.2 Checklist

- [ ] Write full README.md following the structure above
- [ ] Add a screenshot of the landing page
- [ ] Add a screenshot of the dashboard
- [ ] Verify all links in the README work
- [ ] Ensure the quick start instructions work on a clean clone

---

## 6. Environment Variables

### 6.1 Complete Variable Reference

Below is the complete list of environment variables needed across all services. Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

#### Clerk Authentication

| Variable                            | Required | Public | Description                                                      |
| ----------------------------------- | -------- | ------ | ---------------------------------------------------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes      | Yes    | Clerk publishable API key (starts with `pk_test_` or `pk_live_`) |
| `CLERK_SECRET_KEY`                  | Yes      | No     | Clerk secret API key (starts with `sk_test_` or `sk_live_`)      |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL`     | Yes      | Yes    | Sign-in page path (default: `/sign-in`)                          |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL`     | Yes      | Yes    | Sign-up page path (default: `/sign-up`)                          |
| `CLERK_WEBHOOK_SECRET`              | Yes      | No     | Webhook signing secret from Clerk (starts with `whsec_`)         |

#### Convex Database

| Variable                 | Required   | Public | Description                                                        |
| ------------------------ | ---------- | ------ | ------------------------------------------------------------------ |
| `NEXT_PUBLIC_CONVEX_URL` | Yes        | Yes    | Convex deployment URL (e.g., `https://xxx.convex.cloud`)           |
| `CONVEX_DEPLOY_KEY`      | CI/CD only | No     | Convex deploy key for production deployments (starts with `prod:`) |

#### Clerk Billing

No additional environment variables required. Clerk Billing is configured through the Clerk Dashboard and uses the same `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.

#### PostHog Analytics

| Variable                   | Required | Public | Description                                         |
| -------------------------- | -------- | ------ | --------------------------------------------------- |
| `NEXT_PUBLIC_POSTHOG_KEY`  | Yes      | Yes    | PostHog project API key (starts with `phc_`)        |
| `NEXT_PUBLIC_POSTHOG_HOST` | Yes      | Yes    | PostHog API host (e.g., `https://us.i.posthog.com`) |

#### Sentry Error Tracking

| Variable                 | Required   | Public | Description                                                      |
| ------------------------ | ---------- | ------ | ---------------------------------------------------------------- |
| `NEXT_PUBLIC_SENTRY_DSN` | Yes        | Yes    | Sentry Data Source Name (full URL)                               |
| `SENTRY_AUTH_TOKEN`      | Build only | No     | Sentry auth token for source map uploads (starts with `sntrys_`) |
| `SENTRY_ORG`             | Build only | No     | Sentry organization slug                                         |
| `SENTRY_PROJECT`         | Build only | No     | Sentry project slug                                              |

#### Vercel (Automatic)

These are automatically set by Vercel when deploying. No manual configuration needed:

| Variable     | Description                               |
| ------------ | ----------------------------------------- |
| `VERCEL`     | Set to `1` when running on Vercel         |
| `VERCEL_ENV` | `production`, `preview`, or `development` |
| `VERCEL_URL` | Auto-generated deployment URL             |

### 6.2 Updated .env.example

The `.env.example` file should be updated to include all variables:

```
# ============================================
# Clerk Authentication
# ============================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
CLERK_WEBHOOK_SECRET=whsec_...

# ============================================
# Convex Database
# ============================================
NEXT_PUBLIC_CONVEX_URL=https://...convex.cloud

# ============================================
# PostHog Analytics
# ============================================
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# ============================================
# Sentry Error Tracking
# ============================================
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=shipr
# SENTRY_AUTH_TOKEN is stored in .env.sentry-build-plugin (gitignored)
```

### 6.3 Checklist

- [ ] Update `.env.example` with all variables listed above
- [ ] Verify `.env` is in `.gitignore` (confirmed: it is)
- [ ] Verify `.env.sentry-build-plugin` is in `.gitignore` (confirmed: it is)
- [ ] Document which variables are required vs. optional in `.env.example` with comments
- [ ] Ensure no secrets are committed to the repository

---

## 7. Deployment Steps to Vercel

### 7.1 Pre-Deployment Preparation

1. **Verify local build succeeds:**

   ```
   pnpm build
   ```

   Fix any TypeScript errors or build warnings before proceeding.

2. **Run linting:**

   ```
   pnpm lint
   ```

   Fix all errors. Warnings in `convex/_generated/` can be ignored (add to ESLint ignores).

3. **Test locally:**
   - Test sign-up and sign-in flows
   - Test dashboard access and user sync
   - Test pricing page and billing flow (if Clerk Billing is configured in test mode)
   - Verify Convex queries and mutations work

4. **Push code to GitHub:**
   ```
   git add .
   git commit -m "Prepare for production deployment"
   git push origin master
   ```

### 7.2 Convex Production Deployment

Deploy Convex before Vercel, since the Next.js app depends on Convex being available.

1. **Create a Convex production deployment:**

   ```
   npx convex deploy
   ```

   This deploys the schema, functions, and auth config to the production Convex instance.

2. **Copy the production Convex URL:**
   - This will be a different URL from your dev deployment (e.g., `https://xxx.convex.cloud`)
   - Use this URL for `NEXT_PUBLIC_CONVEX_URL` in Vercel

3. **Get the Convex deploy key:**
   - In the Convex dashboard, go to Settings -> Deploy Keys
   - Create a deploy key for CI/CD usage
   - Store as `CONVEX_DEPLOY_KEY` in Vercel

### 7.3 Clerk Production Configuration

1. **Switch to Production instance in Clerk Dashboard:**
   - Clerk has separate Development and Production instances
   - Go to the Clerk Dashboard -> Instance -> switch to Production
   - Or create a new Production instance

2. **Configure production keys:**
   - Copy the Production `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_live_`)
   - Copy the Production `CLERK_SECRET_KEY` (starts with `sk_live_`)

3. **Configure production webhooks:**
   - In Clerk Dashboard (Production) -> Webhooks -> Add Endpoint
   - URL: `https://your-production-domain.com/api/webhooks/clerk`
   - Subscribe to: `user.created`, `user.updated`, `user.deleted`
   - Copy the new signing secret for production `CLERK_WEBHOOK_SECRET`

4. **Configure Clerk Billing for production:**
   - In Clerk Dashboard (Production) -> Billing
   - Set up your Stripe account connection
   - Create production pricing plans

5. **Set the production domain:**
   - In Clerk Dashboard (Production) -> Domains
   - Add your production domain (e.g., `shipr.dev`)

### 7.4 Vercel Project Setup

1. **Import project in Vercel:**
   - Go to https://vercel.com/new
   - Import the GitHub repository
   - Select the `master` branch
   - Framework preset: Next.js (auto-detected)
   - Build command: `pnpm build` (auto-detected)
   - Output directory: `.next` (auto-detected)
   - Install command: `pnpm install` (auto-detected)

2. **Add environment variables in Vercel Dashboard:**

   Go to Project Settings -> Environment Variables and add all of the following:

   **Production environment:**
   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_live_...` |
   | `CLERK_SECRET_KEY` | `sk_live_...` |
   | `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
   | `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
   | `CLERK_WEBHOOK_SECRET` | `whsec_...` (production) |
   | `NEXT_PUBLIC_CONVEX_URL` | `https://...convex.cloud` (production) |
   | `CONVEX_DEPLOY_KEY` | `prod:...` |
   | `NEXT_PUBLIC_POSTHOG_KEY` | `phc_...` |
   | `NEXT_PUBLIC_POSTHOG_HOST` | `https://us.i.posthog.com` |
   | `NEXT_PUBLIC_SENTRY_DSN` | `https://...@sentry.io/...` |
   | `SENTRY_AUTH_TOKEN` | `sntrys_...` |
   | `SENTRY_ORG` | `your-org-slug` |
   | `SENTRY_PROJECT` | `shipr` |

   **Preview environment (optional):**
   - Use Clerk Development/Test keys for preview deployments
   - Use a separate Convex dev deployment URL
   - Use the same PostHog and Sentry projects (they can differentiate by environment tag)

3. **Configure the production domain:**
   - Go to Project Settings -> Domains
   - Add your custom domain (e.g., `shipr.dev`)
   - Configure DNS records as instructed by Vercel
   - Wait for SSL certificate provisioning

4. **Deploy:**
   - Trigger a deployment from the Vercel dashboard, or push to `master`
   - Monitor the build logs for errors
   - Verify the deployment completes successfully

### 7.5 Post-Deployment Configuration

1. **Update Clerk webhook URL:**
   - Update the webhook endpoint in Clerk Dashboard to use the production domain
   - `https://your-domain.com/api/webhooks/clerk`

2. **Update Convex auth config:**
   - If the Clerk issuer domain changes between dev and prod, update `convex/auth.config.ts`
   - Re-deploy Convex: `npx convex deploy`

3. **Configure PostHog:**
   - Verify the production project is receiving events
   - Set up any dashboards, funnels, or cohorts you need

4. **Configure Sentry:**
   - Verify source maps are uploading correctly
   - Set up alert rules for new errors
   - Configure release tracking

### 7.6 Post-Deployment Verification Checklist

Test each of the following on the production deployment:

**Authentication Flows:**

- [ ] Visit the landing page as an unauthenticated user
- [ ] Sign up with email -- verify user is created in Clerk and Convex
- [ ] Sign up with OAuth (Google, GitHub, etc.) if configured
- [ ] Sign in with existing credentials
- [ ] Sign out and verify redirect to landing page
- [ ] Visit `/dashboard` while signed out -- verify redirect to `/sign-in`
- [ ] Visit `/sign-in` while signed in -- verify redirect to `/dashboard`
- [ ] Visit `/` while signed in -- verify redirect to `/dashboard`

**Convex Database:**

- [ ] After sign-up, verify user record exists in Convex Dashboard (users table)
- [ ] Update profile in Clerk -- verify Convex user record updates
- [ ] Verify `clerkId` index is working (check Convex Dashboard -> Indexes)

**Billing and Subscriptions:**

- [ ] Visit `/pricing` page -- verify Clerk PricingTable renders
- [ ] Complete a test subscription (use Stripe test mode if available)
- [ ] Verify plan updates in Clerk `publicMetadata`
- [ ] Verify `useUserPlan` hook returns correct plan
- [ ] Verify upgrade button appears for free users and hides for pro users
- [ ] Test subscription cancellation

**Analytics Tracking:**

- [ ] Verify Vercel Analytics is receiving page views (Vercel Dashboard -> Analytics)
- [ ] Verify Vercel Speed Insights is collecting data (Vercel Dashboard -> Speed Insights)
- [ ] Verify PostHog is receiving page view events (PostHog Dashboard -> Events)
- [ ] Verify PostHog user identification after sign-in
- [ ] Verify custom events are firing (upgrade button click, etc.)

**Error Tracking:**

- [ ] Trigger a test error and verify it appears in Sentry
- [ ] Verify Sentry user context is set after auth
- [ ] Verify source maps are working (stack traces show original source, not minified)
- [ ] Verify the global error boundary renders a fallback UI on unhandled errors

**General:**

- [ ] All pages load without errors (landing, features, about, docs, pricing, terms, privacy, cookies)
- [ ] Dark mode toggle works correctly across all pages
- [ ] Responsive design works on mobile, tablet, and desktop
- [ ] No mixed content warnings (all resources loaded over HTTPS)
- [ ] Favicon and metadata (title, description) are correct
- [ ] Open Graph / social sharing meta tags are present (if applicable)
- [ ] Performance: check Lighthouse score (aim for 90+ on Performance, Accessibility, Best Practices, SEO)

### 7.7 Production Monitoring Setup

After successful deployment, set up ongoing monitoring:

1. **Sentry Alerts:**
   - Create alert rule: notify on first occurrence of any new error
   - Create alert rule: notify if error rate exceeds threshold (e.g., > 10 errors/hour)
   - Set up Slack or email notifications

2. **Vercel Monitoring:**
   - Enable deployment notifications
   - Set up status checks for the production domain

3. **PostHog Dashboards:**
   - Create a "Key Metrics" dashboard: daily active users, sign-ups, plan conversions
   - Create a "Funnel" for: landing page -> sign-up -> dashboard -> upgrade
   - Set up session recordings for debugging user issues

4. **Uptime Monitoring (optional but recommended):**
   - Use a service like Better Uptime, Checkly, or Vercel's built-in monitoring
   - Monitor the production URL and key API endpoints
   - Set up alerts for downtime

### 7.8 Deployment Checklist Summary

- [ ] Local build passes (`pnpm build`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Convex deployed to production (`npx convex deploy`)
- [ ] Clerk production instance configured
- [ ] Clerk production webhooks configured
- [ ] Clerk Billing configured for production
- [ ] GitHub repository up to date
- [ ] Vercel project created and linked to GitHub
- [ ] All environment variables set in Vercel (production)
- [ ] Custom domain configured and SSL provisioned
- [ ] Post-deployment verification checklist completed
- [ ] Sentry alerts configured
- [ ] PostHog dashboards created
- [ ] Monitoring and uptime checks set up

---

## Appendix: Quick Reference Commands

```bash
# Local development
pnpm install                    # Install dependencies
pnpm dev                        # Start Next.js dev server
npx convex dev                  # Start Convex dev server (run in parallel)
pnpm lint                       # Run ESLint
pnpm build                      # Production build

# Convex
npx convex deploy               # Deploy Convex to production
npx convex dashboard            # Open Convex dashboard

# Sentry
pnpm dlx @sentry/wizard@latest -i nextjs   # Initial Sentry setup

# Vercel
vercel                          # Deploy to preview
vercel --prod                   # Deploy to production
vercel env pull .env.local      # Pull env vars from Vercel
```

# Convex & Clerk

[Clerk](https://clerk.com) is an authentication platform providing login via passwords, social identity providers, one-time email or SMS access codes, and multi-factor authentication and user management.

## Get started[​](#get-started "Direct link to Get started")

Convex offers a provider that is specifically for integrating with Clerk called `<ConvexProviderWithClerk>`. It works with any of Clerk's React-based SDKs, such as the Next.js and Expo SDKs.

See the following sections for the Clerk SDK that you're using:

- [React](#react) - Use this as a starting point if your SDK is not listed
- [Next.js](#nextjs)
- [TanStack Start](#tanstack-start)

### React[​](#react "Direct link to React")

**Example:** [React with Convex and Clerk](https://github.com/get-convex/template-react-vite-clerk)

This guide assumes you already have a working React app with Convex. If not follow the [Convex React Quickstart](/quickstart/react.md) first. Then:

1. Sign up for Clerk

   Sign up for a free Clerk account at [clerk.com/sign-up](https://dashboard.clerk.com/sign-up).

   ![Sign up to Clerk](/screenshots/clerk-signup.png)

2. Create an application in Clerk

   Choose how you want your users to sign in.

   ![Create a Clerk application](/screenshots/clerk-createapp.png)

3. Create a JWT Template

   In the Clerk Dashboard, navigate to the [JWT templates](https://dashboard.clerk.com/last-active?path=jwt-templates) page.

   Select _New template_ and then from the list of templates, select _Convex_. You'll be redirected to the template's settings page. **Do NOT rename the JWT token. It must be called `convex`.**

   Copy and save the _Issuer_ URL somewhere secure. This URL is the issuer domain for Clerk's JWT templates, which is your Clerk app's _Frontend API URL_. In development, it's format will be `https://verb-noun-00.clerk.accounts.dev`. In production, it's format will be `https://clerk.<your-domain>.com`.

   ![Create a JWT template](/screenshots/clerk-createjwt.png)

4. Configure Convex with the Clerk issuer domain

   In your app's `convex` folder, create a new file `auth.config.ts` with the following code. This is the server-side configuration for validating access tokens.

   convex/auth.config.ts

   TS

   ```
   import { AuthConfig } from "convex/server";

   export default {
     providers: [
       {
         // Replace with your own Clerk Issuer URL from your "convex" JWT template
         // or with `process.env.CLERK_JWT_ISSUER_DOMAIN`
         // and configure CLERK_JWT_ISSUER_DOMAIN on the Convex Dashboard
         // See https://docs.convex.dev/auth/clerk#configuring-dev-and-prod-instances
         domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
         applicationID: "convex",
       },
     ]
   } satisfies AuthConfig;
   ```

5. Deploy your changes

   Run `npx convex dev` to automatically sync your configuration to your backend.

   ```
   npx convex dev
   ```

6. Install clerk

   In a new terminal window, install the Clerk React SDK:

   ```
   npm install @clerk/clerk-react
   ```

7. Set your Clerk API keys

   In the Clerk Dashboard, navigate to the [**API keys**](https://dashboard.clerk.com/last-active?path=api-keys) page. In the **Quick Copy** section, copy your Clerk Publishable Key and set it as the `CLERK_PUBLISHABLE_KEY` environment variable. If you're using Vite, you will need to prefix it with `VITE_`.

   .env

   ```
   VITE_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
   ```

8. Configure ConvexProviderWithClerk

   Both Clerk and Convex have provider components that are required to provide authentication and client context.

   You should already have `<ConvexProvider>` wrapping your app. Replace it with `<ConvexProviderWithClerk>`, and pass Clerk's `useAuth()` hook to it.

   Then, wrap it with `<ClerkProvider>`. `<ClerkProvider>` requires a `publishableKey` prop, which you can set to the `VITE_CLERK_PUBLISHABLE_KEY` environment variable.

   src/main.tsx

   TS

   ```
   import React from "react";
   import ReactDOM from "react-dom/client";
   import App from "./App";
   import "./index.css";
   import { ClerkProvider, useAuth } from "@clerk/clerk-react";
   import { ConvexProviderWithClerk } from "convex/react-clerk";
   import { ConvexReactClient } from "convex/react";

   const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

   ReactDOM.createRoot(document.getElementById("root")!).render(
     <React.StrictMode>
       <ClerkProvider publishableKey="pk_test_...">
         <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
           <App />
         </ConvexProviderWithClerk>
       </ClerkProvider>
     </React.StrictMode>,
   );
   ```

9. Show UI based on authentication state

   You can control which UI is shown when the user is signed in or signed out using Convex's `<Authenticated>`, `<Unauthenticated>` and `<AuthLoading>` helper components. These should be used instead of Clerk's `<SignedIn>`, `<SignedOut>` and `<ClerkLoading>` components, respectively.

   It's important to use the [`useConvexAuth()`](/api/modules/react.md#useconvexauth) hook instead of Clerk's `useAuth()` hook when you need to check whether the user is logged in or not. The `useConvexAuth()` hook makes sure that the browser has fetched the auth token needed to make authenticated requests to your Convex backend, and that the Convex backend has validated it.

   In the following example, the `<Content />` component is a child of `<Authenticated>`, so its content and any of its child components are guaranteed to have an authenticated user, and Convex queries can require authentication.

   src/App.tsx

   TS

   ```
   import { SignInButton, UserButton } from "@clerk/clerk-react";
   import { Authenticated, Unauthenticated, AuthLoading, useQuery } from "convex/react";
   import { api } from "../convex/_generated/api";

   function App() {
     return (
       <main>
         <Unauthenticated>
           <SignInButton />
         </Unauthenticated>
         <Authenticated>
           <UserButton />
           <Content />
         </Authenticated>
         <AuthLoading>
           <p>Still loading</p>
         </AuthLoading>
       </main>
     );
   }

   function Content() {
     const messages = useQuery(api.messages.getForCurrentUser);
     return <div>Authenticated content: {messages?.length}</div>;
   }

   export default App;
   ```

10. Use authentication state in your Convex functions

    If the client is authenticated, you can access the information stored in the JWT via `ctx.auth.getUserIdentity`.

    If the client isn't authenticated, `ctx.auth.getUserIdentity` will return `null`.

    **Make sure that the component calling this query is a child of `<Authenticated>` from `convex/react`**. Otherwise, it will throw on page load.

    convex/messages.ts

    TS

    ```
    import { query } from "./_generated/server";

    export const getForCurrentUser = query({
      args: {},
      handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (identity === null) {
          throw new Error("Not authenticated");
        }
        return await ctx.db
          .query("messages")
          .withIndex("by_author", (q) => q.eq("author", identity.email))
          .collect();
      },
    });
    ```

### Next.js[​](#nextjs "Direct link to Next.js")

**Example:** [Next.js with Convex and Clerk](https://github.com/get-convex/template-nextjs-clerk)

This guide assumes you already have a working Next.js app with Convex. If not follow the [Convex Next.js Quickstart](/quickstart/nextjs.md) first. Then:

1. Sign up for Clerk

   Sign up for a free Clerk account at [clerk.com/sign-up](https://dashboard.clerk.com/sign-up).

   ![Sign up to Clerk](/screenshots/clerk-signup.png)

2. Create an application in Clerk

   Choose how you want your users to sign in.

   ![Create a Clerk application](/screenshots/clerk-createapp.png)

3. Create a JWT Template

   In the Clerk Dashboard, navigate to the [JWT templates](https://dashboard.clerk.com/last-active?path=jwt-templates) page.

   Select _New template_ and then from the list of templates, select _Convex_. You'll be redirected to the template's settings page. **Do NOT rename the JWT token. It must be called `convex`.**

   Copy and save the _Issuer_ URL somewhere secure. This URL is the issuer domain for Clerk's JWT templates, which is your Clerk app's _Frontend API URL_. In development, it's format will be `https://verb-noun-00.clerk.accounts.dev`. In production, it's format will be `https://clerk.<your-domain>.com`.

   ![Create a JWT template](/screenshots/clerk-createjwt.png)

4. Configure Convex with the Clerk issuer domain

   In your app's `convex` folder, create a new file `auth.config.ts` with the following code. This is the server-side configuration for validating access tokens.

   convex/auth.config.ts

   TS

   ```
   import { AuthConfig } from "convex/server";

   export default {
     providers: [
       {
         // Replace with your own Clerk Issuer URL from your "convex" JWT template
         // or with `process.env.CLERK_JWT_ISSUER_DOMAIN`
         // and configure CLERK_JWT_ISSUER_DOMAIN on the Convex Dashboard
         // See https://docs.convex.dev/auth/clerk#configuring-dev-and-prod-instances
         domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
         applicationID: "convex",
       },
     ]
   } satisfies AuthConfig;
   ```

5. Deploy your changes

   Run `npx convex dev` to automatically sync your configuration to your backend.

   ```
   npx convex dev
   ```

6. Install clerk

   In a new terminal window, install the Clerk Next.js SDK:

   ```
   npm install @clerk/nextjs
   ```

7. Set your Clerk API keys

   In the Clerk Dashboard, navigate to the [**API keys**](https://dashboard.clerk.com/last-active?path=api-keys) page. In the **Quick Copy** section, copy your Clerk Publishable and Secret Keys and set them as the `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` environment variables, respectively.

   .env

   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
   CLERK_SECRET_KEY=YOUR_SECRET_KEY
   ```

8. Add Clerk middleware

   Clerk's `clerkMiddleware()` helper grants you access to user authentication state throughout your app.

   Create a `middleware.ts` file.

   In your `middleware.ts` file, export the `clerkMiddleware()` helper:

   ```
   import { clerkMiddleware } from '@clerk/nextjs/server'

   export default clerkMiddleware()

   export const config = {
     matcher: [
       // Skip Next.js internals and all static files, unless found in search params
       '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
       // Always run for API routes
       '/(api|trpc)(.*)',
     ],
   }
   ```

   By default, `clerkMiddleware()` will not protect any routes. All routes are public and you must opt-in to protection for routes.<https://clerk.com/docs/references/nextjs/clerk-middleware>) to learn how to require authentication for specific routes.

9. Configure ConvexProviderWithClerk

   Both Clerk and Convex have provider components that are required to provide authentication and client context.

   Typically, you'd replace `<ConvexProvider>` with `<ConvexProviderWithClerk>`, but with Next.js App Router, things are a bit more complex.

   `<ConvexProviderWithClerk>` calls `ConvexReactClient()` to get Convex's client, so it must be used in a Client Component. Your `app/layout.tsx`, where you would use `<ConvexProviderWithClerk>`, is a Server Component, and a Server Component cannot contain Client Component code. To solve this, you must first create a _wrapper_ Client Component around `<ConvexProviderWithClerk>`.

   ```
   'use client'

   import { ReactNode } from 'react'
   import { ConvexReactClient } from 'convex/react'
   import { ConvexProviderWithClerk } from 'convex/react-clerk'
   import { useAuth } from '@clerk/nextjs'

   if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
     throw new Error('Missing NEXT_PUBLIC_CONVEX_URL in your .env file')
   }

   const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)

   export default function ConvexClientProvider({ children }: { children: ReactNode }) {
     return (
       <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
         {children}
       </ConvexProviderWithClerk>
     )
   }
   ```

10. Wrap your app in Clerk and Convex

    Now, your Server Component, `app/layout.tsx`, can render `<ConvexClientProvider>` instead of rendering `<ConvexProviderWithClerk>` directly. It's important that `<ClerkProvider>` wraps `<ConvexClientProvider>`, and not the other way around, as Convex needs to be able to access the Clerk context.

    ```
    import type { Metadata } from 'next'
    import { Geist, Geist_Mono } from 'next/font/google'
    import './globals.css'
    import { ClerkProvider } from '@clerk/nextjs'
    import ConvexClientProvider from '@/components/ConvexClientProvider'

    const geistSans = Geist({
      variable: '--font-geist-sans',
      subsets: ['latin'],
    })

    const geistMono = Geist_Mono({
      variable: '--font-geist-mono',
      subsets: ['latin'],
    })

    export const metadata: Metadata = {
      title: 'Clerk Next.js Quickstart',
      description: 'Generated by create next app',
    }

    export default function RootLayout({
      children,
    }: Readonly<{
      children: React.ReactNode
    }>) {
      return (
        <html lang="en">
          <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <ClerkProvider>
              <ConvexClientProvider>{children}</ConvexClientProvider>
            </ClerkProvider>
          </body>
        </html>
      )
    }
    ```

11. Show UI based on authentication state

    You can control which UI is shown when the user is signed in or signed out using Convex's `<Authenticated>`, `<Unauthenticated>` and `<AuthLoading>` helper components. These should be used instead of Clerk's `<SignedIn>`, `<SignedOut>` and `<ClerkLoading>` components, respectively.

    It's important to use the [`useConvexAuth()`](/api/modules/react.md#useconvexauth) hook instead of Clerk's `useAuth()` hook when you need to check whether the user is logged in or not. The `useConvexAuth()` hook makes sure that the browser has fetched the auth token needed to make authenticated requests to your Convex backend, and that the Convex backend has validated it.

    In the following example, the `<Content />` component is a child of `<Authenticated>`, so its content and any of its child components are guaranteed to have an authenticated user, and Convex queries can require authentication.

    app/page.tsx

    TS

    ```
    "use client";

    import { Authenticated, Unauthenticated } from "convex/react";
    import { SignInButton, UserButton } from "@clerk/nextjs";
    import { useQuery } from "convex/react";
    import { api } from "../convex/_generated/api";

    export default function Home() {
      return (
        <>
          <Authenticated>
            <UserButton />
            <Content />
          </Authenticated>
          <Unauthenticated>
            <SignInButton />
          </Unauthenticated>
        </>
      );
    }

    function Content() {
      const messages = useQuery(api.messages.getForCurrentUser);
      return <div>Authenticated content: {messages?.length}</div>;
    }
    ```

12. Use authentication state in your Convex functions

    If the client is authenticated, you can access the information stored in the JWT via `ctx.auth.getUserIdentity`.

    If the client isn't authenticated, `ctx.auth.getUserIdentity` will return `null`.

    **Make sure that the component calling this query is a child of `<Authenticated>` from `convex/react`**. Otherwise, it will throw on page load.

    convex/messages.ts

    TS

    ```
    import { query } from "./_generated/server";

    export const getForCurrentUser = query({
      args: {},
      handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (identity === null) {
          throw new Error("Not authenticated");
        }
        return await ctx.db
          .query("messages")
          .withIndex("by_author", (q) => q.eq("author", identity.email))
          .collect();
      },
    });
    ```

### TanStack Start[​](#tanstack-start "Direct link to TanStack Start")

**Example:** [TanStack Start with Convex and Clerk](https://github.com/get-convex/templates/tree/main/template-tanstack-start)

See the [TanStack Start with Clerk guide](/client/tanstack/tanstack-start/clerk.md) for more information.

## Next steps[​](#next-steps "Direct link to Next steps")

### Accessing user information in functions[​](#accessing-user-information-in-functions "Direct link to Accessing user information in functions")

See [Auth in Functions](/auth/functions-auth.md) to learn about how to access information about the authenticated user in your queries, mutations and actions.

See [Storing Users in the Convex Database](/auth/database-auth.md) to learn about how to store user information in the Convex database.

### Accessing user information client-side[​](#accessing-user-information-client-side "Direct link to Accessing user information client-side")

To access the authenticated user's information, use Clerk's `User` object, which can be accessed using Clerk's [`useUser()`](https://clerk.com/docs/hooks/use-user) hook. For more information on the `User` object, see the [Clerk docs](https://clerk.com/docs/references/javascript/user).

components/Badge.tsx

TS

```
export default function Badge() {
  const { user } = useUser();

  return <span>Logged in as {user.fullName}</span>;
}
```

## Configuring dev and prod instances[​](#configuring-dev-and-prod-instances "Direct link to Configuring dev and prod instances")

To configure a different Clerk instance between your Convex development and production deployments, you can use environment variables configured on the Convex dashboard.

### Configuring the backend[​](#configuring-the-backend "Direct link to Configuring the backend")

In the Clerk Dashboard, navigate to the [**API keys**](https://dashboard.clerk.com/last-active?path=api-keys) page. Copy your Clerk Frontend API URL. This URL is the issuer domain for Clerk's JWT templates, and is necessary for Convex to validate access tokens. In development, it's format will be `https://verb-noun-00.clerk.accounts.dev`. In production, it's format will be `https://clerk.<your-domain>.com`.

Paste your Clerk Frontend API URL into your `.env` file, set it as the `CLERK_JWT_ISSUER_DOMAIN` environment variable.

.env

```
CLERK_JWT_ISSUER_DOMAIN=https://verb-noun-00.clerk.accounts.dev
```

Then, update your `auth.config.ts` file to use the environment variable.

convex/auth.config.ts

TS

```
import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
```

**Development configuration**

In the left sidenav of the Convex [dashboard](https://dashboard.convex.dev), switch to your development deployment and set the values for your development Clerk instance.

<!-- -->

![Convex dashboard dev deployment settings](/screenshots/clerk-convex-dashboard.png)

Then, to switch your deployment to the new configuration, run `npx convex dev`.

**Production configuration**

In the left sidenav of the Convex [dashboard](https://dashboard.convex.dev), switch to your production deployment and set the values for your production Clerk instance.

<!-- -->

Then, to switch your deployment to the new configuration, run `npx convex deploy`.

### Configuring Clerk's API keys[​](#configuring-clerks-api-keys "Direct link to Configuring Clerk's API keys")

Clerk's API keys differ depending on whether they are for development or production. Don't forget to update the environment variables in your `.env` file as well as your hosting platform, such as Vercel or Netlify.

**Development configuration**

Clerk's Publishable Key for development follows the format `pk_test_...`.

.env.local

```
VITE_CLERK_PUBLISHABLE_KEY="pk_test_..."
```

**Production configuration**

Clerk's Publishable Key for production follows the format `pk_live_...`.

.env

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_..."
```

## Debugging authentication[​](#debugging-authentication "Direct link to Debugging authentication")

If a user goes through the Clerk login flow successfully, and after being redirected back to your page, `useConvexAuth()` returns `isAuthenticated: false`, it's possible that your backend isn't correctly configured.

The `auth.config.ts` file contains a list of configured authentication providers. You must run `npx convex dev` or `npx convex deploy` after adding a new provider to sync the configuration to your backend.

For more thorough debugging steps, see [Debugging Authentication](/auth/debug.md).

## Under the hood[​](#under-the-hood "Direct link to Under the hood")

The authentication flow looks like this under the hood:

1. The user clicks a login button
2. The user is redirected to a page where they log in via whatever method you configure in
   <!-- -->
   Clerk
3. After a successful login
   <!-- -->
   Clerk
   <!-- -->
   redirects back to your page, or a different page which you configure via
   <!-- -->
   the
   <!-- -->
   [`afterSignIn`](https://clerk.com/docs/authentication/sign-in#override-ur-ls)
   <!-- -->
   prop
   <!-- -->
   .
4. The `ClerkProvider` now knows that the user is authenticated.
5. The `ConvexProviderWithClerk` fetches an auth token from
   <!-- -->
   Clerk
   <!-- -->
   .
6. The `ConvexReactClient` passes this token down to your Convex backend to validate
7. Your Convex backend retrieves the public key from
   <!-- -->
   Clerk
   <!-- -->
   to check that the token's signature is valid.
8. The `ConvexReactClient` is notified of successful authentication, and `ConvexProviderWithClerk` now knows that the user is authenticated with Convex. `useConvexAuth` returns `isAuthenticated: true` and the `Authenticated` component renders its children.

`ConvexProviderWithClerk` takes care of refetching the token when needed to make sure the user stays authenticated with your backend.
