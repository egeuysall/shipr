"use client";

import { useSyncUser } from "@/hooks/use-sync-user";
import { useOnboarding } from "@/hooks/use-onboarding";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

interface BreadcrumbData {
  parent: string | null;
  current: string;
}

const DASHBOARD_ROUTE_LABELS: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/files": "Files",
  "/dashboard/chat": "Chat",
};

function getBreadcrumbsFromPathname(pathname: string): BreadcrumbData {
  if (DASHBOARD_ROUTE_LABELS[pathname]) {
    if (pathname === "/dashboard") {
      return { parent: null, current: DASHBOARD_ROUTE_LABELS[pathname] };
    }

    return { parent: "Dashboard", current: DASHBOARD_ROUTE_LABELS[pathname] };
  }

  const segments = pathname.split("/").filter(Boolean);

  const lastSegment = segments[segments.length - 1];
  const current = lastSegment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return { parent: "Dashboard", current };
}

export function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  useSyncUser();
  useOnboarding();
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbsFromPathname(pathname);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.parent && (
                  <>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="/dashboard">
                        {breadcrumbs.parent}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </>
                )}
                <BreadcrumbItem>
                  <BreadcrumbPage>{breadcrumbs.current}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
