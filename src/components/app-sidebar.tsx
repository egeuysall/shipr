"use client";

import * as React from "react";
import { OrganizationSwitcher, useOrganization } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ChatEdit01Icon,
  DashboardSquare01Icon,
  FileAttachmentIcon,
  User03Icon,
} from "@hugeicons/core-free-icons";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <HugeiconsIcon icon={DashboardSquare01Icon} strokeWidth={2} />,
    },
    {
      title: "Files",
      url: "/dashboard/files",
      icon: <HugeiconsIcon icon={FileAttachmentIcon} strokeWidth={2} />,
    },
    {
      title: "Chat",
      url: "/dashboard/chat",
      icon: <HugeiconsIcon icon={ChatEdit01Icon} strokeWidth={2} />,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "mailto:hi@egeuysal.com",
      icon: <HugeiconsIcon icon={User03Icon} strokeWidth={2} />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { organization } = useOrganization();
  const { resolvedTheme } = useTheme();

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      className="border-r"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <OrganizationSwitcher
              hidePersonal
              afterCreateOrganizationUrl="/onboarding"
              afterSelectOrganizationUrl="/onboarding"
              appearance={{
                baseTheme: resolvedTheme === "dark" ? dark : undefined,
              }}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
