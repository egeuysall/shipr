"use client";

import { usePathname } from "next/navigation";

export function TopNav() {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname.includes("settings")) return "Settings";
    return "Page";
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
