import { auth } from "@clerk/nextjs/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Lock } from "lucide-react";

/**
 * Example page demonstrating server-side access control using Clerk's has() method.
 *
 * This is the RECOMMENDED approach for protecting sensitive content or API routes.
 * The has() method checks access on the server before rendering, providing better security.
 *
 * You can check for:
 * - Plans: has({ plan: 'pro' })
 * - Features: has({ feature: 'premium_widgets' })
 * - Roles: has({ role: 'admin' })
 * - Permissions: has({ permission: 'org:settings:manage' })
 */
export default async function ServerProtectedPage() {
  const { has } = await auth();

  // Check if user has the "pro" plan using Clerk's recommended has() method
  const hasProPlan = has({ plan: "pro" });

  if (!hasProPlan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Lock className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground text-center max-w-md">
          This page uses server-side protection. Only Pro subscribers can access this content.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Server-Protected Content</h1>
          <p className="text-muted-foreground">
            This page uses the <code className="text-xs bg-muted px-1 py-0.5 rounded">has()</code> method for server-side protection
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Why Server-Side Protection?</CardTitle>
          <CardDescription>
            Understanding the benefits of server-side access control
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">✅ More Secure</h3>
            <p className="text-sm text-muted-foreground">
              Access checks happen on the server before any content is sent to the client,
              preventing unauthorized users from even seeing the HTML.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">✅ Better for SEO</h3>
            <p className="text-sm text-muted-foreground">
              Content is conditionally rendered on the server, so search engines see the appropriate content.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">✅ No Flash of Unauthorized Content</h3>
            <p className="text-sm text-muted-foreground">
              Unlike client-side protection, users never see protected content flash before being hidden.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/50">
        <CardHeader>
          <CardTitle>Example Code</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
            <code>{`import { auth } from "@clerk/nextjs/server";

export default async function Page() {
  const { has } = await auth();

  // Check for a plan
  const hasProPlan = has({ plan: "pro" });

  // Or check for a feature
  const hasFeature = has({ feature: "premium_widgets" });

  if (!hasProPlan) {
    return <AccessDenied />;
  }

  return <ProtectedContent />;
}`}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
