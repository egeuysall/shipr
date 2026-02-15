import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Shipr Dashboard",
  },
  description: "Manage your Shipr workspace, files, and AI chat.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <DashboardShell>{children}</DashboardShell>;
}
