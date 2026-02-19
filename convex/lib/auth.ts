import type { Doc } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import {
  hasOrgPermission,
  type OrgPermission,
} from "../../src/lib/auth/rbac";

type ConvexCtx = QueryCtx | MutationCtx;

type AuthIdentity = NonNullable<Awaited<ReturnType<ConvexCtx["auth"]["getUserIdentity"]>>>;

export interface OrganizationAuthContext {
  identity: AuthIdentity;
  clerkId: string;
  orgId: string;
  orgRole: string;
  orgPermissions: string[];
}

function getStringClaim(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

function getStringArrayClaim(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter((item) => item.length > 0);
}

export async function requireAuthenticatedIdentity(
  ctx: ConvexCtx,
): Promise<AuthIdentity> {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new Error("Unauthorized: authentication required");
  }

  return identity;
}

export async function requireOrganizationContext(
  ctx: ConvexCtx,
): Promise<OrganizationAuthContext> {
  const identity = await requireAuthenticatedIdentity(ctx);
  const identityClaims = identity as Record<string, unknown>;

  const orgId =
    getStringClaim(identityClaims.org_id) ??
    getStringClaim(identityClaims.orgId);
  const orgRole =
    getStringClaim(identityClaims.org_role) ??
    getStringClaim(identityClaims.orgRole);
  const orgPermissions = [
    ...getStringArrayClaim(identityClaims.org_permissions),
    ...getStringArrayClaim(identityClaims.orgPermissions),
  ];

  if (!orgId) {
    throw new Error("Forbidden: active organization required");
  }

  if (!orgRole) {
    throw new Error("Forbidden: organization role is missing");
  }

  return {
    identity,
    clerkId: identity.subject,
    orgId,
    orgRole,
    orgPermissions,
  };
}

export function requireOrgPermission(
  authContext: OrganizationAuthContext,
  permission: OrgPermission,
): void {
  const allowed = hasOrgPermission({
    orgRole: authContext.orgRole,
    orgPermissions: authContext.orgPermissions,
    permission,
  });

  if (!allowed) {
    throw new Error(`Forbidden: missing permission ${permission}`);
  }
}

export async function requireCurrentUser(
  ctx: ConvexCtx,
): Promise<{ auth: OrganizationAuthContext; user: Doc<"users"> }> {
  const auth = await requireOrganizationContext(ctx);

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", auth.clerkId))
    .first();

  if (!user) {
    throw new Error("User not found");
  }

  return { auth, user };
}
