"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare02Icon,
  Settings05Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { useUser } from "@clerk/nextjs";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { useUserPlan } from "@/hooks/use-user-plan";
import { UpgradeButton } from "@/components/billing/upgrade-button";
import { Separator } from "@/components/ui/separator";

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: DashboardSquare02Icon,
  },
  {
    title: "Pro Content",
    url: "/dashboard/pro-content",
    icon: SparklesIcon,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings05Icon,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  const { isPro } = useUserPlan();

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/dashboard" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-md border border-sidebar-border bg-background">
                <span className="text-lg font-bold">S</span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Shipr</span>
                <span className="truncate text-xs">Ship faster</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    render={<Link href={item.url} />}
                  >
                    <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Upgrade CTA for free users */}
        {!isPro && (
          <SidebarGroup className="mt-auto">
            <div className="space-y-2">
              <div className="py-2">
                <UpgradeButton />
              </div>
            </div>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
