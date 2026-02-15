# Authentication

Shipr uses [Clerk](https://clerk.com) for authentication and [Convex](https://convex.dev) for the backend database.

## How It Works

1. **Clerk** handles sign-in, sign-up, session management, and billing plans
2. **Convex** stores user data synced from Clerk via the `useSyncUser` hook
3. Users are identified by their Clerk ID across both systems

## Architecture

```
User signs in via Clerk
        |
ClerkProviderWrapper (adapts to dark/light theme)
        |
ConvexProviderWithClerk (passes Clerk auth to Convex)
        |
useSyncUser hook (syncs Clerk user data to Convex DB)
```

## Providers

Providers are nested in the root layout (`src/app/layout.tsx`):

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

Wraps `ClerkProvider` and automatically applies the dark theme based on `next-themes`.

### ConvexClientProvider

`src/lib/convex-client-provider.tsx`

Creates a singleton `ConvexReactClient` and bridges Clerk auth into Convex via `ConvexProviderWithClerk`.

## User Sync

The `useSyncUser` hook (`src/hooks/use-sync-user.ts`) runs on authenticated pages and:

- Reads the current Clerk user + billing plan
- Checks if the Convex user record exists and is up-to-date
- Creates or patches the Convex record only when data has changed

## Convex Schema

Users table (`convex/schema.ts`):

| Field      | Type      | Description             |
| ---------- | --------- | ----------------------- |
| `clerkId`  | `string`  | Clerk user ID (indexed) |
| `email`    | `string`  | Primary email           |
| `name`     | `string?` | Full name               |
| `imageUrl` | `string?` | Profile image URL       |
| `plan`     | `string?` | `"free"` or `"pro"`     |

## Environment Variables

| Variable                            | Description                 |
| ----------------------------------- | --------------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key       |
| `CLERK_SECRET_KEY`                  | Clerk secret key            |
| `NEXT_PUBLIC_CONVEX_URL`            | Convex deployment URL       |
| `CLERK_JWT_ISSUER_DOMAIN`           | Clerk JWT issuer for Convex |

## Route Groups

- `(auth)` - Sign-in and sign-up pages using Clerk's prebuilt components
- `(dashboard)` - Protected pages that require authentication
- `(marketing)` - Public pages (no auth required)

## Security

All Convex mutations and queries enforce ownership checks - users can only read, update, or delete their own records. The `identity.subject` from Clerk JWT is compared against the `clerkId` argument on every operation.
