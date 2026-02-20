import type { Doc } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import {
  hasOrgPermission,
  normalizeOrganizationBillingPlan,
  type OrganizationBillingPlan,
  type OrgPermission,
} from "../../src/lib/auth/rbac";

type ConvexCtx = QueryCtx | MutationCtx;

type AuthIdentity = NonNullable<
  Awaited<ReturnType<ConvexCtx["auth"]["getUserIdentity"]>>
>;

export interface OrganizationAuthContext {
  identity: AuthIdentity;
  clerkId: string;
  orgId: string;
  orgRole: string;
  orgPermissions: string[];
  orgPlan: OrganizationBillingPlan;
}

function getStringClaim(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

function getStringArrayClaim(value: unknown): string[] {
  if (typeof value === "string" && value.trim().length > 0) {
    return value
      .split(/[,\s]+/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter((item) => item.length > 0);
}

function getObjectClaim(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function getClaimFromSources<T>(
  identityClaims: Record<string, unknown>,
  parser: (value: unknown) => T,
  isValid: (value: T) => boolean,
  keys: string[],
): T | null {
  const nestedObjects = Object.values(identityClaims)
    .map((value) => getObjectClaim(value))
    .filter((value): value is Record<string, unknown> => value !== null);

  const sources = [identityClaims, ...nestedObjects];

  for (const source of sources) {
    for (const key of keys) {
      const parsed = parser(source[key]);
      if (isValid(parsed)) {
        return parsed;
      }
    }
  }

  return null;
}

function collectStringArrayClaims(
  identityClaims: Record<string, unknown>,
  keys: string[],
): string[] {
  const nestedObjects = Object.values(identityClaims)
    .map((value) => getObjectClaim(value))
    .filter((value): value is Record<string, unknown> => value !== null);
  const sources = [identityClaims, ...nestedObjects];

  const values = new Set<string>();
  for (const source of sources) {
    for (const key of keys) {
      for (const claim of getStringArrayClaim(source[key])) {
        values.add(claim);
      }
    }
  }

  return [...values];
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

  const orgId = getClaimFromSources(
    identityClaims,
    getStringClaim,
    (value): value is string => Boolean(value),
    [
      "org_id",
      "orgId",
      "organization_id",
      "organizationId",
      "https://clerk.dev/org_id",
      "https://clerk.dev/organization_id",
    ],
  );
  const orgRole = getClaimFromSources(
    identityClaims,
    getStringClaim,
    (value): value is string => Boolean(value),
    [
      "org_role",
      "orgRole",
      "organization_role",
      "organizationRole",
      "https://clerk.dev/org_role",
      "https://clerk.dev/organization_role",
    ],
  );
  const orgPermissions = collectStringArrayClaims(identityClaims, [
    "org_permissions",
    "orgPermissions",
    "organization_permissions",
    "organizationPermissions",
    "https://clerk.dev/org_permissions",
    "https://clerk.dev/organization_permissions",
  ]);
  const orgPlanClaim = getClaimFromSources(
    identityClaims,
    getStringClaim,
    (value): value is string => Boolean(value),
    [
      "org_plan",
      "orgPlan",
      "organization_plan",
      "organizationPlan",
      "https://clerk.dev/org_plan",
      "https://clerk.dev/organization_plan",
      "plan",
    ],
  );

  if (!orgId) {
    throw new Error(
      "Forbidden: active organization required (missing org claim in Convex token)",
    );
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
    orgPlan: normalizeOrganizationBillingPlan(orgPlanClaim),
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

export function resolveOrganizationBillingPlanForUser(params: {
  auth: OrganizationAuthContext;
}): OrganizationBillingPlan {
  const { auth } = params;
  return auth.orgPlan;
}
