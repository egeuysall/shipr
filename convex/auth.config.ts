import { AuthConfig } from "convex/server";

const issuerDomains = (
  process.env.CLERK_JWT_ISSUER_DOMAINS ??
  process.env.CLERK_JWT_ISSUER_DOMAIN ??
  ""
)
  .split(",")
  .map((domain) => domain.trim())
  .filter(Boolean);

const applicationID = process.env.CLERK_JWT_APPLICATION_ID;

export default {
  providers: issuerDomains.map((domain) => ({
    // Supports single-domain and migration scenarios:
    // CLERK_JWT_ISSUER_DOMAIN=https://clerk.example.com
    // or CLERK_JWT_ISSUER_DOMAINS=https://old.example.com,https://new.example.com
    domain,
    ...(applicationID ? { applicationID } : {}),
  })),
} satisfies AuthConfig;
