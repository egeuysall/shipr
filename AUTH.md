**Agent 1: Clerk + Convex Integration**

````
You are a senior full-stack engineer integrating Clerk authentication with Convex database in an existing Next.js 15 project.

PROJECT CONTEXT:
- Next.js 15 project using pnpm
- Clerk already initialized with API keys configured
- Need to: polish Clerk setup + integrate Convex + sync users between them

CURRENT STATE:
- Clerk API keys already in .env.local
- Basic Clerk setup exists but needs polish

TASKS:

1. INSTALL CONVEX:
pnpm add convex

2. INITIALIZE CONVEX:
pnpm convex dev
(This will prompt you to create a Convex project and add NEXT_PUBLIC_CONVEX_URL to .env.local)

3. CREATE CONVEX SCHEMA (convex/schema.ts):
```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"]),
});
````

4. CREATE CONVEX USER FUNCTIONS (convex/users.ts):

```typescript
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get user by Clerk ID
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

// Create or update user
export const createOrUpdateUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        name: args.name,
        imageUrl: args.imageUrl,
      });
      return existing._id;
    }

    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      imageUrl: args.imageUrl,
      createdAt: Date.now(),
    });
  },
});
```

5. POLISH CLERK SETUP:

Create proper auth routes:

- app/(auth)/sign-in/[[...sign-in]]/page.tsx
- app/(auth)/sign-up/[[...sign-up]]/page.tsx
  Both should use Clerk's <SignIn /> and <SignUp /> components with proper styling

Update app/layout.tsx:

- Wrap everything in <ClerkProvider>
- Add ConvexClientProvider for Convex

Create middleware.ts:

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

6. CREATE CONVEX PROVIDER:

Create lib/convex-client-provider.tsx:

```typescript
"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
```

Update app/layout.tsx to include both providers:

```typescript
import { ClerkProvider } from '@clerk/nextjs'
import { ConvexClientProvider } from '@/lib/convex-client-provider'

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html>
        <body>
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
```

7. CREATE USER SYNC HOOK (hooks/use-sync-user.ts):

```typescript
"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

export function useSyncUser() {
  const { user } = useUser();
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);
  const existingUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip",
  );

  useEffect(() => {
    if (!user) return;

    // Only sync if user doesn't exist or data changed
    if (
      !existingUser ||
      existingUser.email !== user.primaryEmailAddress?.emailAddress ||
      existingUser.name !== user.fullName
    ) {
      createOrUpdateUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress ?? "",
        name: user.fullName ?? undefined,
        imageUrl: user.imageUrl ?? undefined,
      });
    }
  }, [user, existingUser, createOrUpdateUser]);

  return { user, convexUser: existingUser };
}
```

8. CREATE PROTECTED DASHBOARD:

Create app/(dashboard)/layout.tsx:

```typescript
"use client";

import { useSyncUser } from "@/hooks/use-sync-user";

export default function DashboardLayout({ children }) {
  useSyncUser(); // Syncs user on every dashboard visit

  return <div>{children}</div>;
}
```

Create app/(dashboard)/dashboard/page.tsx:

```typescript
"use client";

import { UserButton, useUser } from "@clerk/nextjs";

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <div className="p-8">
      <div className="flex items-center gap-4">
        <UserButton />
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user?.firstName}!</h1>
          <p className="text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
        </div>
      </div>
    </div>
  );
}
```

9. UPDATE .env.example:

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Convex
NEXT_PUBLIC_CONVEX_URL=https://...convex.cloud
```

OUTPUT STRUCTURE:
convex/
├── schema.ts
├── users.ts
└── tsconfig.json (auto-generated)

app/
├── (auth)/
│ ├── sign-in/[[...sign-in]]/page.tsx
│ └── sign-up/[[...sign-up]]/page.tsx
├── (dashboard)/
│ ├── layout.tsx (syncs user)
│ └── dashboard/page.tsx
└── layout.tsx (providers)

lib/
└── convex-client-provider.tsx

hooks/
└── use-sync-user.ts

middleware.ts
.env.example

TESTING CHECKLIST:
✅ pnpm convex dev runs successfully
✅ Can sign up at /sign-up
✅ After sign-up, user appears in Convex dashboard
✅ Can access /dashboard and see user info
✅ Cannot access /dashboard when logged out
✅ UserButton works (sign out, manage account)
✅ User data syncs when email/name changes in Clerk

REQUIREMENTS:

- Use pnpm for all installs
- Use "use client" directives where needed
- Proper TypeScript types
- Handle loading states
- No console errors

Build step by step. Test after each major piece (Convex setup, then Clerk routes, then sync logic).

```

Paste this into Cursor and let it build. This handles both Clerk polish + Convex integration in one go.
```
