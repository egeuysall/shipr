# Multi Tenancy

## Overview

This branch implements a B2B shared-user-pool architecture using Clerk Organizations and Convex tenant-scoped data.

- Users sign in once and can belong to multiple organizations.
- The active Clerk organization (`orgId`) is the tenant context.
- Personal workspaces are disabled in-app (`hidePersonal=true`).
- Users without an active organization are redirected to `/onboarding`.

## Tenancy Model

### Tenant boundary

All workspace data uses Clerk `orgId` as the primary tenant key.

- `files.orgId`
- `chatThreads.orgId`
- `chatMessages.orgId`

### Per-user data

User profile and onboarding remain account-level and are stored in `users` by Clerk user ID (`clerkId`).

## RBAC Model

RBAC constants live in `src/lib/auth/rbac.ts` and are enforced in Convex via `convex/lib/auth.ts`.

### Roles

- `org:admin`
- `org:member`

### Permissions

- `org:files:read`
- `org:files:create`
- `org:files:delete`
- `org:chat:read`
- `org:chat:create`
- `org:workspace_settings:manage`
- `org:workspace_members:manage`
- `org:workspace_billing:manage`

### Default fallback matrix

- `org:admin`: all permissions
- `org:member`: read/create for files and chat
- Destructive/governance actions (for example file deletion) are admin-only by default.

## Convex Access Control

Convex functions fail closed if:

- user is unauthenticated
- active organization is missing
- organization role is missing
- required permission is not satisfied

Guards are centralized in `convex/lib/auth.ts`.

## Route Guards

`src/proxy.ts` enforces:

- auth protection for `/dashboard(.*)` and `/onboarding(.*)`
- redirect to `/onboarding` when authenticated but no active org

## Billing Scope

Billing checks are organization-scoped.

- `PricingTable` is configured as `<PricingTable for="organization" />`
- plan checks use Clerk `has({ plan: "pro" })` in active org context

## Workspace Features

### Files

Files are workspace-shared.

- Upload/read scoped to active org
- Delete is admin-only by default matrix
- Metadata validation and upload abuse protections remain enabled

### Chat

Chat threads/messages are workspace-shared.

- list/read/create scoped to active org
- thread and message bounds still enforced via `chatHistoryConfig`

## Clerk Setup Checklist

1. Enable Organizations in Clerk.
2. Configure organization roles (`org:admin`, `org:member`).
3. (Optional) Configure custom permissions matching keys above.
4. If using Clerk Billing, configure organization plans/features.
5. Ensure Convex auth issuer is set via `CLERK_JWT_ISSUER_DOMAIN`.

## Security Notes

- Every Convex workspace read/write checks `orgId`.
- Cross-tenant access is blocked by tenant key checks and permission checks.
- API routes enforce auth and active organization before processing.
- Failures return explicit `401`/`403` responses.
