import { DashboardShell } from "./dashboard-shell";
import { ReactNode } from "react";

// Prevent static prerendering of dashboard pages
// since they require authentication and Convex
export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
