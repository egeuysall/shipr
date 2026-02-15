import type { Metadata } from "next";
import { getAllDocs } from "@/lib/docs";
import { PAGE_SEO, SITE_CONFIG } from "@/lib/constants";
import { BreadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: PAGE_SEO.docs.title,
  description: PAGE_SEO.docs.description,
  keywords: [...PAGE_SEO.docs.keywords],
  alternates: {
    canonical: `${SITE_CONFIG.url}/docs`,
  },
};

export default function DocsPage(): React.ReactElement {
  const docs = getAllDocs();

  return (
    <div className="py-32 md:pt-44">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Documentation", href: "/docs" },
        ]}
      />
      <div className="mx-auto max-w-2xl px-6">
        <div className="text-center">
          <h1 className="text-balance text-4xl font-bold">Documentation</h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance">
            Everything you need to build with Shipr.
          </p>
        </div>

        {/* Table of contents */}
        <nav className="mt-12 rounded-lg border p-6">
          <h2 className="mb-3 text-sm font-medium text-foreground">
            On this page
          </h2>
          <ul className="space-y-2">
            {docs.map((doc) => (
              <li key={doc.slug}>
                <a
                  href={`#${doc.slug}`}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {doc.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Doc sections */}
        <div className="mt-12 space-y-16">
          {docs.map((doc) => (
            <section key={doc.slug} id={doc.slug} className="scroll-mt-32">
              <div
                className="prose prose-neutral dark:prose-invert max-w-none
                  [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4
                  [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3
                  [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2
                  [&_p]:text-muted-foreground [&_p]:text-sm [&_p]:leading-relaxed [&_p]:mb-3
                  [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6
                  [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6
                  [&_li]:text-muted-foreground [&_li]:text-sm [&_li]:mb-1 [&_li]:leading-relaxed
                  [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4
                  [&_strong]:text-foreground [&_strong]:font-medium
                  [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-xs [&_code]:font-mono
                  [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre]:text-xs
                  [&_pre_code]:bg-transparent [&_pre_code]:p-0
                  [&_table]:w-full [&_table]:text-sm [&_table]:mb-4
                  [&_th]:text-left [&_th]:text-foreground [&_th]:font-medium [&_th]:p-2 [&_th]:border-b
                  [&_td]:text-muted-foreground [&_td]:p-2 [&_td]:border-b [&_td]:border-border
                  [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground
                  [&_hr]:border-border [&_hr]:my-8"
                dangerouslySetInnerHTML={{ __html: doc.html }}
              />
              <div className="mt-6 border-t pt-2">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                >
                  ↑ Back to top
                </a>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
