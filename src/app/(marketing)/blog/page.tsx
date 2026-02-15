import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { Badge } from "@/components/ui/badge";
import { SITE_CONFIG } from "@/lib/constants";
import { BreadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Blog: Guides & Insights",
  description:
    "Practical playbooks on launching SaaS fast with Next.js, Convex, Clerk, analytics, and AI-ready workflows.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/blog`,
  },
};

export default function BlogPage(): React.ReactElement {
  const posts = getAllPosts();

  return (
    <div className="py-32 md:pt-44">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
        ]}
      />
      <div className="mx-auto max-w-2xl px-6">
        <div className="text-center">
          <h1 className="text-balance text-4xl font-bold">
            Shipr Build Logs & Launch Guides
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance">
            Tactics, guides, and lessons for shipping a production SaaS in days,
            not months.
          </p>
        </div>

        <div className="mt-16 space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="group">
              <Link
                href={`/blog/${post.slug}`}
                className="block rounded-lg border p-6 transition-colors hover:bg-muted/50"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                  <span>&middot;</span>
                  <span>{post.readingTime}</span>
                </div>
                <h2 className="mt-2 text-xl font-semibold group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {post.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
