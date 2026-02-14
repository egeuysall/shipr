"use client";

import { UserButton, useUser } from "@clerk/nextjs";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-4">
        <UserButton />
        <div>
          <h1 className="text-2xl font-bold">
            Welcome, {user?.firstName}!
          </h1>
          <p className="text-muted-foreground">
            {user?.primaryEmailAddress?.emailAddress}
          </p>
        </div>
      </div>
    </div>
  );
}
