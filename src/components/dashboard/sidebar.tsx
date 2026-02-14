"use client";

import { cn } from "@/lib/utils";
import { useUserPlan } from "@/hooks/use-user-plan";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  Settings01Icon,
  Menu01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { UpgradeButton } from "@/components/billing/upgrade-button";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: DashboardSquare01Icon,
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings01Icon,
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
            <span className="text-primary-foreground font-bold text-sm">S</span>
          </div>
          <span className="font-semibold text-lg">Shipr</span>
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
                  isActive && "bg-secondary",
                )}
              >
                <HugeiconsIcon
                  icon={Icon}
                  strokeWidth={2}
                  className="h-4 w-4"
                />
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
              <HugeiconsIcon
                icon={SparklesIcon}
                strokeWidth={2}
                className="h-4 w-4 text-primary"
              />
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
          <Avatar>
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
                avatarBox: "h-8 w-8",
              },
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
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden fixed top-4 left-4 z-40"
            />
          }
        >
          <HugeiconsIcon
            icon={Menu01Icon}
            strokeWidth={2}
            className="h-5 w-5"
          />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0" showCloseButton={false}>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
