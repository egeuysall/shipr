# Authentication

Shipr multi-tenant variant uses [Clerk](https://clerk.com) for authentication + organizations and [Convex](https://convex.dev) for backend data.

## How It Works

1. Clerk handles sign-in/sign-up/session state.
2. Clerk active organization (`orgId`) defines tenant context.
3. Convex validates auth, org context, and permissions on each protected function.
4. `useSyncUser` syncs account-level user profile data into Convex `users`.

## Organization-Required Flow

- Authenticated users without an active organization are redirected to `/onboarding`.
- Personal workspace mode is hidden in Clerk organization components.
- Dashboard features are available only after selecting/creating an organization.

## Providers

Providers are nested in `src/app/layout.tsx`:

```tsx
<ThemeProvider>
  <PostHogProvider>
    <ClerkProviderWrapper>
      <ConvexClientProvider>{children}</ConvexClientProvider>
    </ClerkProviderWrapper>
  </PostHogProvider>
</ThemeProvider>
```

### ClerkProviderWrapper

`src/components/clerk-provider-wrapper.tsx`

Wraps `ClerkProvider` and applies theme-aware Clerk styling.

### ConvexClientProvider

`src/lib/convex-client-provider.tsx`

Bridges Clerk auth to Convex with `ConvexProviderWithClerk`.

## User Sync

`src/hooks/use-sync-user.ts`

- Reads current Clerk user and org-scoped billing plan
- Upserts Convex `users` record only when values changed
- `clerkId` is derived server-side in Convex (not client-supplied)

## Convex Schema

### Users (account-level)

- `clerkId`
- `email`
- `name`
- `imageUrl`
- `plan`
- `onboardingCompleted`
- `onboardingStep`

### Workspace-scoped tables

- `files.orgId`
- `chatThreads.orgId`
- `chatMessages.orgId`

## Environment Variables

| Variable                            | Description                 |
| ----------------------------------- | --------------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key       |
| `CLERK_SECRET_KEY`                  | Clerk secret key            |
| `NEXT_PUBLIC_CONVEX_URL`            | Convex deployment URL       |
| `CLERK_JWT_ISSUER_DOMAIN`           | Clerk JWT issuer for Convex |

## Security

- Convex functions require authenticated identity.
- Workspace functions require active organization context.
- Workspace actions require role/permission checks.
- Cross-tenant reads/writes are blocked by explicit `orgId` checks.
