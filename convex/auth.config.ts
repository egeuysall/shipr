import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      // The Clerk JWT issuer domain. Configure CLERK_JWT_ISSUER_DOMAIN
      // on the Convex Dashboard for both dev and prod deployments.
      // See https://docs.convex.dev/auth/clerk#configuring-dev-and-prod-instances
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
