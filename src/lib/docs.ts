import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

/** A parsed documentation page. */
export interface DocPage {
  /** URL-friendly slug derived from the filename (e.g. "getting-started"). */
  slug: string;
  /** Title extracted from the first `# ` heading, or humanized from the filename. */
  title: string;
  /** Raw markdown source. */
  raw: string;
  /** HTML rendered from the markdown via `marked`. */
  html: string;
}

/** Display order for doc pages. Slugs not listed here appear at the end alphabetically. */
const DOC_ORDER: string[] = [
  "getting-started",
  "architecture",
  "authentication",
  "seo",
  "analytics",
  "deployment",
];

/**
 * Reads all `.md` files from the project-root `docs/` directory,
 * parses each one into structured {@link DocPage} objects, and
 * returns them in a consistent display order.
 *
 * Intended to be called from a Server Component at build time -
 * uses `fs` directly so it cannot run on the client.
 */
export function getAllDocs(): DocPage[] {
  const docsDir = path.join(process.cwd(), "docs");

  if (!fs.existsSync(docsDir)) {
    return [];
  }

  const files = fs
    .readdirSync(docsDir)
    .filter((f) => f.endsWith(".md"))
    .sort();

  const pages: DocPage[] = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(docsDir, file), "utf-8");
    const title = extractTitle(raw, slug);
    const html = marked.parse(raw, { async: false }) as string;

    return { slug, title, raw, html };
  });

  return pages.sort((a, b) => {
    const ai = DOC_ORDER.indexOf(a.slug);
    const bi = DOC_ORDER.indexOf(b.slug);
    const oa = ai === -1 ? DOC_ORDER.length : ai;
    const ob = bi === -1 ? DOC_ORDER.length : bi;
    if (oa !== ob) return oa - ob;
    return a.slug.localeCompare(b.slug);
  });
}

/**
 * Get a single doc page by slug. Returns `undefined` if not found.
 */
export function getDocBySlug(slug: string): DocPage | undefined {
  return getAllDocs().find((doc) => doc.slug === slug);
}

/**
 * Extracts the title from the first `# heading` in the markdown.
 * Falls back to humanizing the slug if no heading is found.
 */
function extractTitle(markdown: string, fallbackSlug: string): string {
  const match = markdown.match(/^#\s+(.+)$/m);
  if (match) {
    return match[1].trim();
  }
  return fallbackSlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
