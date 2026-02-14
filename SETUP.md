You are a senior DevOps/analytics engineer tasked with preparing a production-ready Next.js SaaS application for deployment. The project uses Next.js 15 + pnpm + TypeScript, with Clerk for authentication, Convex for the database, and Clerk Billing. The Dashboard, Settings, and Landing page are complete. Vercel Analytics and Speed Insights are already set up.

Your task is to generate a **step-by-step setup plan** including:

1. **Clerk + Convex Integration**
   - Create and configure the required Convex tables to support users, profiles, subscriptions, and any SaaS-related data.
   - Map Clerk user IDs to Convex user records.
   - Include instructions for handling user creation, updates, and deletion with Clerk webhooks if needed.
   - Ensure role-based access or permissions can be enforced in Convex using Clerk auth.
   - List all necessary environment variables for Clerk + Convex.

2. **PostHog Analytics Integration**
   - Initialize PostHog client on the client side only.
   - Provide a provider/wrapper for the app to handle page views and custom event tracking.
   - Track relevant events tied to user activity in Clerk and Convex.
   - List required environment variables.

3. **Sentry Error Tracking**
   - Follow Sentry setup wizard for Next.js.
   - Provide helper functions for capturing errors and messages.
   - Include a global error boundary for the app.
   - List required environment variables.

4. **Code Polish Recommendations**
   - Remove all console logs.
   - Add proper TypeScript types.
   - Fix ESLint warnings.
   - Clean up unused imports and commented-out code.
   - Organize file structure for maintainability.

5. **Documentation**
   - Create a comprehensive README.md covering: project overview, quick start, environment variables, project structure, customization, deployment instructions, and troubleshooting.

6. **Environment Variables**
   - List all necessary environment variables for Clerk, Convex, Clerk Billing, PostHog, Sentry, and Vercel.

7. **Deployment Steps to Vercel**
   - Push code to GitHub and import into Vercel.
   - Add all environment variables in Vercel dashboard.
   - Deploy and verify production functionality.
   - Include a post-deployment checklist covering auth flows, Convex tables, database reads/writes, billing, analytics tracking, and error reporting.

Output the **full setup plan in a structured format**, with clear step-by-step instructions, checklists, and best practices for local setup, production deployment, and post-deployment verification. **Do not write implementation code**, only describe steps, configurations, and setup tasks.
