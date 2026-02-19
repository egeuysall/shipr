# Shipr (Multi-tenant Variant)

This branch (`feat/multi-tenancy`) is a dedicated multi-tenant version of Shipr.

- Tenant boundary: Clerk Organizations
- Backend data isolation: Convex organization-scoped records
- Billing scope: organization plan checks
- Access model: role/permission scaffold (`org:admin`, `org:member`)

This branch is intended for SaaS products that require B2B multi-tenancy and is maintained separately from `master`.

See `/docs/multi-tenancy.md` for architecture and implementation details.
