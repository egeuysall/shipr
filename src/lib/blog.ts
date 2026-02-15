import { SITE_CONFIG } from "@/lib/constants";

/** A single blog post entry. */
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  readingTime: string;
}

/**
 * All blog posts. Add new entries here. They'll appear on the blog
 * index and get their own `/blog/[slug]` page automatically.
 *
 * Content is plain HTML so you don't need MDX or a CMS.
 */
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "shipping-your-saas-in-a-weekend",
    title: "How to Ship Your SaaS in a Weekend",
    description:
      "A practical guide to going from idea to production in 48 hours using a modern boilerplate stack.",
    content: `
      <p>Building a SaaS from scratch used to take months. With the right boilerplate, you can compress that into a weekend. Here's how.</p>

      <h2>Start with Auth</h2>
      <p>Authentication is the first thing every SaaS needs and the last thing you want to build from scratch. Clerk gives you sign-in, sign-up, session management, and billing out of the box. Plug it in, configure your routes, and move on.</p>

      <h2>Pick a Database That Stays Out of Your Way</h2>
      <p>Convex handles real-time sync, schema validation, and server functions in one package. No ORMs, no migration headaches for prototyping. Define your schema, write your queries, and you're live.</p>

      <h2>Don't Skip Analytics</h2>
      <p>You need to know what users are doing from day one. PostHog gives you event tracking, session replay, and feature flags. Reverse-proxy it through Next.js rewrites so ad blockers don't eat your data.</p>

      <h2>Ship It</h2>
      <p>Deploy to Vercel, point your domain, and start getting feedback. The perfect stack is the one that lets you iterate fastest.</p>
    `,
    author: SITE_CONFIG.creator,
    publishedAt: "2025-01-15",
    tags: ["guide", "saas", "launch"],
    readingTime: "3 min read",
  },
  {
    slug: "setting-up-clerk-with-convex",
    title: "Setting Up Clerk Auth with Convex",
    description:
      "Step-by-step walkthrough of wiring Clerk authentication into a Convex backend with JWT validation.",
    content: `
      <p>Clerk and Convex work well together, but the initial setup has a few moving parts. This guide walks through each step.</p>

      <h2>1. Configure Clerk JWT</h2>
      <p>In your Clerk dashboard, create a JWT template for Convex. Set the issuer domain and copy it. You'll need it for the Convex auth config.</p>

      <h2>2. Set Up Convex Auth</h2>
      <p>In <code>convex/auth.config.ts</code>, add Clerk as a provider with the JWT issuer domain. Convex will validate tokens automatically on every query and mutation.</p>

      <h2>3. Bridge the Providers</h2>
      <p>Use <code>ConvexProviderWithClerk</code> to pass the Clerk <code>useAuth</code> hook to Convex. This lets Convex attach the JWT to every request without you doing anything manually.</p>

      <h2>4. Sync User Data</h2>
      <p>Create a <code>useSyncUser</code> hook that watches the Clerk session and upserts user data into your Convex <code>users</code> table. Only write when data actually changes to avoid unnecessary mutations.</p>

      <h2>5. Protect Your Queries</h2>
      <p>In every Convex query and mutation, call <code>ctx.auth.getUserIdentity()</code> and compare <code>identity.subject</code> against the requested <code>clerkId</code>. This ensures users can only access their own data.</p>
    `,
    author: SITE_CONFIG.creator,
    publishedAt: "2025-01-20",
    tags: ["auth", "clerk", "convex", "tutorial"],
    readingTime: "4 min read",
  },
  {
    slug: "posthog-reverse-proxy-nextjs",
    title: "PostHog Reverse Proxy with Next.js Rewrites",
    description:
      "How to route PostHog analytics through your own domain to bypass ad blockers and improve data accuracy.",
    content: `
      <p>Ad blockers kill analytics. If you're relying on client-side tracking, you're probably missing 30-40% of your events. The fix is simple: proxy PostHog through your own domain.</p>

      <h2>The Problem</h2>
      <p>Ad blockers maintain lists of known tracking domains. <code>us.i.posthog.com</code> is on every list. When a user has an ad blocker installed, all requests to PostHog are silently dropped.</p>

      <h2>The Solution</h2>
      <p>Next.js rewrites let you proxy requests at the edge. Add two rewrite rules in <code>next.config.ts</code>:</p>
      <ul>
        <li><code>/ingest/static/*</code> - PostHog static assets</li>
        <li><code>/ingest/*</code> - PostHog ingest API</li>
      </ul>
      <p>Then point your PostHog client at <code>/ingest</code> instead of the PostHog domain. Requests now go to your domain first, then get forwarded to PostHog. Ad blockers see your domain and let them through.</p>

      <h2>Don't Forget</h2>
      <p>Set <code>skipTrailingSlashRedirect: true</code> in your Next.js config. PostHog's API uses trailing slashes, and Next.js will redirect them away by default.</p>
      <p>Also add <code>/ingest</code> and <code>/ingest/*</code> to your <code>robots.txt</code> disallow list so search engines don't try to crawl your proxy endpoints.</p>
    `,
    author: SITE_CONFIG.creator,
    publishedAt: "2025-02-05",
    tags: ["analytics", "posthog", "nextjs"],
    readingTime: "3 min read",
  },
];

/**
 * Get all blog posts sorted by publish date (newest first).
 */
export function getAllPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

/**
 * Get a single blog post by slug. Returns `undefined` if not found.
 */
export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

/**
 * Get all unique tags across all posts.
 */
export function getAllTags(): string[] {
  const tags = new Set(BLOG_POSTS.flatMap((post) => post.tags));
  return [...tags].sort();
}
