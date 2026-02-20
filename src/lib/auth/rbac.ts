export const ORG_ROLES = {
  ADMIN: "org:admin",
  MEMBER: "org:member",
} as const;

export const ORG_PERMISSIONS = {
  FILES_READ: "org:files:read",
  FILES_CREATE: "org:files:create",
  FILES_DELETE: "org:files:delete",
  CHAT_READ: "org:chat:read",
  CHAT_CREATE: "org:chat:create",
  WORKSPACE_SETTINGS_MANAGE: "org:workspace_settings:manage",
  WORKSPACE_MEMBERS_MANAGE: "org:workspace_members:manage",
  WORKSPACE_BILLING_MANAGE: "org:workspace_billing:manage",
} as const;

export const ORG_BILLING_PLAN_KEYS = {
  ORGANIZATIONS: "organizations",
} as const;

export const ORG_BILLING_PLANS = {
  FREE: "free",
  ORGANIZATIONS: "organizations",
} as const;

export type OrganizationBillingPlan =
  (typeof ORG_BILLING_PLANS)[keyof typeof ORG_BILLING_PLANS];

export type OrgRole = (typeof ORG_ROLES)[keyof typeof ORG_ROLES] | string;
export type OrgPermission =
  (typeof ORG_PERMISSIONS)[keyof typeof ORG_PERMISSIONS];

export const ALL_ORG_PERMISSIONS: OrgPermission[] = [
  ORG_PERMISSIONS.FILES_READ,
  ORG_PERMISSIONS.FILES_CREATE,
  ORG_PERMISSIONS.FILES_DELETE,
  ORG_PERMISSIONS.CHAT_READ,
  ORG_PERMISSIONS.CHAT_CREATE,
  ORG_PERMISSIONS.WORKSPACE_SETTINGS_MANAGE,
  ORG_PERMISSIONS.WORKSPACE_MEMBERS_MANAGE,
  ORG_PERMISSIONS.WORKSPACE_BILLING_MANAGE,
];

const MEMBER_DEFAULT_PERMISSIONS = new Set<OrgPermission>([
  ORG_PERMISSIONS.FILES_READ,
  ORG_PERMISSIONS.FILES_CREATE,
  ORG_PERMISSIONS.CHAT_READ,
  ORG_PERMISSIONS.CHAT_CREATE,
]);

export type PermissionCheckHasFn =
  | ((params: any) => boolean)
  | null
  | undefined;

export function isOrgAdmin(role: string | null | undefined): boolean {
  return role === ORG_ROLES.ADMIN;
}

export function roleHasPermission(
  role: string | null | undefined,
  permission: OrgPermission,
): boolean {
  if (isOrgAdmin(role)) {
    return true;
  }

  if (role === ORG_ROLES.MEMBER) {
    return MEMBER_DEFAULT_PERMISSIONS.has(permission);
  }

  return false;
}

export function hasOrgPermission(params: {
  orgRole: string | null | undefined;
  permission: OrgPermission;
  has?: PermissionCheckHasFn;
  orgPermissions?: string[] | null;
}): boolean {
  const { orgRole, permission, has, orgPermissions } = params;

  if (roleHasPermission(orgRole, permission)) {
    return true;
  }

  if (orgPermissions?.includes(permission)) {
    return true;
  }

  if (!has) {
    return false;
  }

  try {
    return has({ permission });
  } catch {
    return false;
  }
}

export function hasOrganizationPlanOrganizations(params: {
  orgId: string | null | undefined;
  has?: PermissionCheckHasFn;
}): boolean {
  const { orgId, has } = params;

  if (!orgId || !has) {
    return false;
  }

  try {
    return has({ plan: ORG_BILLING_PLAN_KEYS.ORGANIZATIONS });
  } catch {
    return false;
  }
}

export function normalizeOrganizationBillingPlan(
  value: string | null | undefined,
): OrganizationBillingPlan {
  return value === ORG_BILLING_PLAN_KEYS.ORGANIZATIONS
    ? ORG_BILLING_PLANS.ORGANIZATIONS
    : ORG_BILLING_PLANS.FREE;
}

export function resolveOrganizationBillingPlanFromHas(params: {
  orgId: string | null | undefined;
  has?: PermissionCheckHasFn;
}): OrganizationBillingPlan {
  return hasOrganizationPlanOrganizations(params)
    ? ORG_BILLING_PLANS.ORGANIZATIONS
    : ORG_BILLING_PLANS.FREE;
}
