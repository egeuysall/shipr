import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/lib/structured-data";
import { SITE_CONFIG } from "@/lib/constants";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: {
      canonical: `${SITE_CONFIG.url}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      ...(post.updatedAt && { modifiedTime: post.updatedAt }),
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({
  params,
}: BlogPostPageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="py-32 md:pt-44">
      <ArticleJsonLd
        title={post.title}
        description={post.description}
        publishedAt={post.publishedAt}
        updatedAt={post.updatedAt}
        authorName={post.author}
        slug={post.slug}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: post.title, href: `/blog/${post.slug}` },
        ]}
      />
      <article className="mx-auto max-w-2xl px-6">
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/blog" />}
            nativeButton={false}
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              strokeWidth={2}
              className="size-4"
            />
            Back to Blog
          </Button>
        </div>

        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
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
          <h1 className="mt-4 text-balance text-4xl font-bold">{post.title}</h1>
          <p className="text-muted-foreground mt-4 text-lg text-balance">
            {post.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <p className="text-muted-foreground mt-4 text-sm">By {post.author}</p>
        </header>

        <div
          className="prose prose-neutral dark:prose-invert max-w-none [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-muted-foreground [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2 [&_li]:text-muted-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:font-mono"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-16 border-t pt-8">
          <Button
            variant="secondary"
            render={<Link href="/blog" />}
            nativeButton={false}
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              strokeWidth={2}
              className="size-4"
            />
            All Posts
          </Button>
        </div>
      </article>
    </div>
  );
}
