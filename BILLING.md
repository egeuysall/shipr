# Agent 2: Clerk Billing + Vercel-Style Dashboard

````
You are a senior full-stack engineer building a production-grade SaaS dashboard with Clerk Billing integration. Design inspiration: Vercel dashboard (clean, minimal, professional).

PROJECT CONTEXT:
- Next.js 15 project using pnpm
- Clerk + Convex already working
- shadcn/ui already initialized
- Need: Clerk Billing + Vercel-style dashboard with sidebar

DESIGN PRINCIPLES (Vercel Style):
- Clean, minimal, lots of white space
- Subtle borders and shadows
- Muted color palette
- Smooth transitions
- Mobile-first responsive
- Professional typography

═══════════════════════════════════════════════════════════════════

PART 1: INSTALL REQUIRED SHADCN COMPONENTS
═══════════════════════════════════════════════════════════════════

Run these commands:
```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add badge
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add separator
pnpm dlx shadcn@latest add sheet
pnpm dlx shadcn@latest add dropdown-menu
pnpm dlx shadcn@latest add avatar
pnpm dlx shadcn@latest add skeleton
````

═══════════════════════════════════════════════════════════════════

PART 2: CLERK BILLING SETUP
═══════════════════════════════════════════════════════════════════

1. CREATE BILLING HOOK (hooks/use-user-plan.ts):

```typescript
"use client";

import { useUser } from "@clerk/nextjs";

export type Plan = "free" | "pro";

export function useUserPlan(): {
  plan: Plan;
  isLoading: boolean;
  isPro: boolean;
  isFree: boolean;
} {
  const { user, isLoaded } = useUser();

  // Clerk Billing stores subscription info in publicMetadata
  const plan = (user?.publicMetadata?.plan as Plan) || "free";
  const isPro = plan === "pro";
  const isFree = plan === "free";

  return {
    plan,
    isLoading: !isLoaded,
    isPro,
    isFree,
  };
}
```

2. CREATE UPGRADE BUTTON (components/billing/upgrade-button.tsx):

```typescript
"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { useUserPlan } from "@/hooks/use-user-plan";

export function UpgradeButton() {
  const { user } = useUser();
  const { isPro } = useUserPlan();
  const [isLoading, setIsLoading] = useState(false);

  if (isPro) return null;

  const handleUpgrade = async () => {
    if (!user) return;

    setIsLoading(true);

    // TODO: After setting up Clerk Billing in Clerk Dashboard:
    // 1. Go to Clerk Dashboard → Billing
    // 2. Connect Stripe
    // 3. Create Pro plan ($15/month)
    // 4. Replace URL below with your Clerk billing URL
    const checkoutUrl = `https://YOUR_CLERK_DOMAIN.clerk.accounts.dev/user/billing`;

    window.location.href = checkoutUrl;
  };

  return (
    <Button
      onClick={handleUpgrade}
      disabled={isLoading}
      className="gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
      Upgrade to Pro
    </Button>
  );
}
```

═══════════════════════════════════════════════════════════════════

PART 3: VERCEL-STYLE SIDEBAR
═══════════════════════════════════════════════════════════════════

Create components/dashboard/sidebar.tsx:

```typescript
"use client";

import { cn } from "@/lib/utils";
import { useUserPlan } from "@/hooks/use-user-plan";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Settings,
  Menu,
  Sparkles,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { UpgradeButton } from "@/components/billing/upgrade-button";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings
  },
];

function SidebarContent() {
  const pathname = usePathname();
  const { plan, isPro } = useUserPlan();
  const { user } = useUser();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">F</span>
          </div>
          <span className="font-semibold text-lg">Foundry</span>
        </Link>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 font-normal",
                  isActive && "bg-secondary"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Upgrade CTA (if free plan) */}
      {!isPro && (
        <div className="p-4">
          <div className="rounded-lg border bg-gradient-to-br from-primary/10 via-primary/5 to-background p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">Upgrade to Pro</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Unlock unlimited features and priority support
            </p>
            <UpgradeButton />
          </div>
        </div>
      )}

      {/* User section */}
      <div className="p-4">
        <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/50">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <div className="flex items-center gap-2">
              <Badge
                variant={isPro ? "default" : "secondary"}
                className="text-[10px] px-1.5 py-0"
              >
                {plan}
              </Badge>
            </div>
          </div>
          <UserButton
            afterSignOutUrl="/sign-in"
            appearance={{
              elements: {
                avatarBox: "h-8 w-8"
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r bg-background">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-40"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
```

═══════════════════════════════════════════════════════════════════

PART 4: VERCEL-STYLE TOP NAV
═══════════════════════════════════════════════════════════════════

Create components/dashboard/top-nav.tsx:

```typescript
"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export function TopNav() {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname.includes("settings")) return "Settings";
    return "Page";
  };

  const getPageDescription = () => {
    if (pathname === "/dashboard") return "Overview of your account";
    if (pathname.includes("settings")) return "Manage your account settings";
    return "";
  };

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-6 md:px-8">
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{getPageTitle()}</h2>
        </div>
      </div>
    </div>
  );
}
```

═══════════════════════════════════════════════════════════════════

PART 5: UPDATE DASHBOARD LAYOUT
═══════════════════════════════════════════════════════════════════

Update app/(dashboard)/layout.tsx:

```typescript
"use client";

import { useSyncUser } from "@/hooks/use-sync-user";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopNav } from "@/components/dashboard/top-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useSyncUser();

  return (
    <div className="min-h-screen">
      <Sidebar />

      {/* Main content area - offset for sidebar on desktop */}
      <div className="md:pl-64">
        <TopNav />

        <main className="min-h-[calc(100vh-3.5rem)]">
          <div className="container max-w-7xl mx-auto p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
```

═══════════════════════════════════════════════════════════════════

PART 6: VERCEL-STYLE DASHBOARD PAGE
═══════════════════════════════════════════════════════════════════

Update app/(dashboard)/dashboard/page.tsx:

```typescript
"use client";

import { useUser } from "@clerk/nextjs";
import { useUserPlan } from "@/hooks/use-user-plan";
import { UpgradeButton } from "@/components/billing/upgrade-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sparkles,
  User,
  Mail,
  Calendar,
  Crown
} from "lucide-react";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { isPro, plan, isLoading } = useUserPlan();

  if (!isLoaded || isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back, {user?.firstName}
        </h1>
        <p className="text-sm text-muted-foreground">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Plan Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Plan
            </CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold capitalize">{plan}</div>
              <Badge variant={isPro ? "default" : "secondary"}>
                {isPro ? "Active" : "Limited"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isPro
                ? "Enjoying all Pro features"
                : "Upgrade to unlock more features"
              }
            </p>
            {!isPro && (
              <div className="mt-4">
                <UpgradeButton />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Email Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Email Address
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium truncate">
              {user?.primaryEmailAddress?.emailAddress}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Primary email
            </p>
          </CardContent>
        </Card>

        {/* Member Since Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Member Since
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {user?.createdAt &&
                new Date(user.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })
              }
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Account created
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Prompt (for free users) */}
      {!isPro && (
        <Card className="border-primary/50 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>Unlock Pro Features</CardTitle>
            </div>
            <CardDescription>
              Get access to unlimited features and priority support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Unlimited projects
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Advanced analytics
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Priority support
              </li>
            </ul>
            <UpgradeButton />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

═══════════════════════════════════════════════════════════════════

PART 7: ADD MISSING SHADCN COMPONENTS
═══════════════════════════════════════════════════════════════════

If not already installed, run:

```bash
pnpm dlx shadcn@latest add avatar
pnpm dlx shadcn@latest add skeleton
```

═══════════════════════════════════════════════════════════════════

OUTPUT STRUCTURE
═══════════════════════════════════════════════════════════════════

hooks/
└── use-user-plan.ts

components/
├── dashboard/
│ ├── sidebar.tsx
│ └── top-nav.tsx
├── billing/
│ └── upgrade-button.tsx
└── ui/
├── button.tsx
├── badge.tsx
├── card.tsx
├── separator.tsx
├── sheet.tsx
├── dropdown-menu.tsx
├── avatar.tsx
└── skeleton.tsx

app/(dashboard)/
├── layout.tsx
└── dashboard/page.tsx

═══════════════════════════════════════════════════════════════════

TESTING CHECKLIST
═══════════════════════════════════════════════════════════════════

✅ Sidebar shows on desktop (fixed, 256px wide)
✅ Mobile shows menu button, opens sheet drawer
✅ Navigation items highlight active page
✅ User avatar and info display correctly
✅ Plan badge shows "free" by default
✅ Upgrade button appears for free users only
✅ Dashboard cards display user info
✅ All shadcn components render properly
✅ Responsive on mobile, tablet, desktop
✅ Smooth transitions and animations
✅ Vercel-style aesthetic (clean, minimal)

═══════════════════════════════════════════════════════════════════

DESIGN REQUIREMENTS
═══════════════════════════════════════════════════════════════════

COLORS:

- Use default shadcn theme colors
- Primary for CTAs and accents
- Muted backgrounds for cards
- Subtle borders

SPACING:

- Consistent padding (px-4, px-6, p-4, p-6)
- Generous white space
- Logical content grouping

TYPOGRAPHY:

- font-semibold for headings
- font-medium for labels
- text-muted-foreground for descriptions
- Proper text sizing hierarchy

COMPONENTS:

- Rounded corners (rounded-lg)
- Subtle shadows on cards
- Smooth hover states
- Clean, minimal icons (lucide-react)

═══════════════════════════════════════════════════════════════════

CLERK BILLING MANUAL SETUP (TODO AFTER CODE IS DONE)
═══════════════════════════════════════════════════════════════════

After code is complete:

1. Go to Clerk Dashboard → Billing
2. Click "Enable Billing"
3. Connect your Stripe account
4. In Stripe (via Clerk), create products:
   - Free Plan: $0/month
   - Pro Plan: $15/month
5. Copy the billing portal URL from Clerk
6. Update upgrade-button.tsx with real URL
7. Test upgrade flow end-to-end

═══════════════════════════════════════════════════════════════════

Build this step by step. Test each component before moving to the next.
Use Vercel dashboard as design reference for clean, professional aesthetic.
All components must use shadcn/ui - no custom components for basic UI elements.

```

```
