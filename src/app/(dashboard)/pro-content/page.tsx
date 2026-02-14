"use client";

import { Protect } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles, Zap } from "lucide-react";

/**
 * Example page demonstrating Clerk's <Protect> component for client-side access control.
 *
 * This page is only accessible to users with the "pro" plan.
 * If a user without the plan tries to access it, they'll see the fallback UI.
 *
 * For more granular control, you can also use Features:
 * <Protect feature="premium_widgets" fallback={...}>
 */
export default function ProContentPage() {
  return (
    <Protect
      plan="pro"
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Crown className="h-16 w-16 text-muted-foreground" />
          <h1 className="text-3xl font-bold">Pro Plan Required</h1>
          <p className="text-muted-foreground text-center max-w-md">
            This content is only available to Pro subscribers. Upgrade your plan to access exclusive features.
          </p>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Badge variant="default" className="gap-1">
            <Crown className="h-3 w-3" />
            Pro Content
          </Badge>
          <h1 className="text-3xl font-bold">Exclusive Pro Features</h1>
        </div>

        {/* Pro Features Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle>Advanced Analytics</CardTitle>
              </div>
              <CardDescription>
                Get detailed insights into your data with advanced analytics tools.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This feature is only available to Pro subscribers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle>Priority Support</CardTitle>
              </div>
              <CardDescription>
                Get faster response times and dedicated support from our team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Available 24/7 for all Pro subscribers.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/50 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
          <CardHeader>
            <CardTitle>Welcome to Pro! 🎉</CardTitle>
            <CardDescription>
              You now have access to all premium features and benefits.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Unlimited projects
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Advanced analytics dashboard
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Priority email and chat support
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Early access to new features
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Protect>
  );
}
