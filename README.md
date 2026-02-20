# Shipr (Multi-tenant Variant)

This branch (`feat/multi-tenancy`) is a dedicated multi-tenant version of Shipr.

- Tenant boundary: Clerk Organizations
- Backend data isolation: Convex organization-scoped records
- Billing scope: organization plan checks
- Access model: role/permission scaffold (`org:admin`, `org:member`)

This branch is intended for SaaS products that require B2B multi-tenancy and is maintained separately from `master`.

Important: this variant uses a fresh Convex baseline for tenant-scoped `files` and `chat` data. Do not deploy it over existing single-tenant datasets from `master` without clearing/backfilling those tables first.

See `/docs/multi-tenancy.md` for architecture and implementation details.
