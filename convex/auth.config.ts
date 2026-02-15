import { AuthConfig } from "convex/server";

const issuerDomains = (
  process.env.CLERK_JWT_ISSUER_DOMAINS ??
  process.env.CLERK_JWT_ISSUER_DOMAIN ??
  ""
)
  .split(",")
  .map((domain) => domain.trim())
  .filter(Boolean);

const applicationIDs = (
  process.env.CLERK_JWT_APPLICATION_IDS ??
  process.env.CLERK_JWT_APPLICATION_ID ??
  "convex"
)
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

export default {
  providers: issuerDomains.flatMap((domain) =>
    applicationIDs.map((applicationID) => ({
      // Supports migration scenarios:
      // CLERK_JWT_ISSUER_DOMAINS=https://old.example.com,https://new.example.com
      // CLERK_JWT_APPLICATION_IDS=convex,https://your-app.example.com
      domain,
      applicationID,
    })),
  ),
} satisfies AuthConfig;
