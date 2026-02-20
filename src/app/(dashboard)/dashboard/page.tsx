"use client";

import { useUser } from "@clerk/nextjs";
import { useUserPlan } from "@/hooks/use-user-plan";
import { UpgradeButton } from "@/components/billing/upgrade-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ChatEdit01Icon,
  Mail01Icon,
  Calendar03Icon,
  CrownIcon,
} from "@hugeicons/core-free-icons";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { isOrganizationsPlan, plan, isLoading } = useUserPlan();

  if (!isLoaded || isLoading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.firstName}
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your account today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Plan Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <HugeiconsIcon
              icon={CrownIcon}
              strokeWidth={2}
              className="h-4 w-4"
            />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold capitalize">{plan}</div>
              <Badge variant={isOrganizationsPlan ? "default" : "outline"}>
                {isOrganizationsPlan ? "Active" : "Limited"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isOrganizationsPlan
                ? "Enjoying all Organizations features"
                : "Upgrade to unlock more features"}
            </p>
            {!isOrganizationsPlan && (
              <div className="mt-4">
                <UpgradeButton />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Email Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Address</CardTitle>
            <HugeiconsIcon
              icon={Mail01Icon}
              strokeWidth={2}
              className="h-4 w-4"
            />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium truncate">
              {user?.primaryEmailAddress?.emailAddress}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Primary email</p>
          </CardContent>
        </Card>

        {/* Member Since Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Member Since</CardTitle>
            <HugeiconsIcon
              icon={Calendar03Icon}
              strokeWidth={2}
              className="h-4 w-4"
            />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {user?.createdAt &&
                new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Account created
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Prompt (for free users) */}
      {!isOrganizationsPlan && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={ChatEdit01Icon}
                strokeWidth={2}
                className="h-5 w-5"
              />
              <CardTitle>Unlock Organizations Features</CardTitle>
            </div>
            <CardDescription>
              Get access to unlimited features and priority support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-foreground" />
                Unlimited projects
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-foreground" />
                Advanced analytics
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-foreground" />
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
