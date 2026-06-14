import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { TocEntry } from "@/components/docs/TableOfContents";

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "docs");

export interface DocMeta {
  title: string;
  description: string;
  slug: string;
  order?: number;
}

export function getAllDocs(): DocMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
      const { data } = matter(raw);
      return {
        title: data.title ?? file.replace(/\.mdx?$/, ""),
        description: data.description ?? "",
        slug: file.replace(/\.mdx?$/, ""),
        order: data.order ?? 99,
      };
    })
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export function extractToc(content: string): TocEntry[] {
  const entries: TocEntry[] = [];
  const lines = content.split("\n");
  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)$/);
    const h3 = line.match(/^###\s+(.+)$/);
    const match = h3 ?? h2;
    if (!match) continue;
    const text = match[1].replace(/`[^`]+`/g, (m) => m.slice(1, -1)).trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    entries.push({ id, text, level: h3 ? 3 : 2 });
  }
  return entries;
}

export function getDocBySlug(slug: string): { meta: DocMeta; content: string } | null {
  const candidates = [`${slug}.mdx`, `${slug}.md`];
  for (const filename of candidates) {
    const filepath = path.join(CONTENT_DIR, filename);
    if (fs.existsSync(filepath)) {
      const raw = fs.readFileSync(filepath, "utf8");
      const { data, content } = matter(raw);
      return {
        meta: {
          title: data.title ?? slug,
          description: data.description ?? "",
          slug,
          order: data.order ?? 99,
        },
        content,
      };
    }
  }
  return null;
}
