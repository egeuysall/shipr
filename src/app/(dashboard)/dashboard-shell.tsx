"use client";

import { useSyncUser } from "@/hooks/use-sync-user";
import { ReactNode } from "react";

export function DashboardShell({ children }: { children: ReactNode }) {
  const { isLoaded } = useSyncUser();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return <div>{children}</div>;
}
