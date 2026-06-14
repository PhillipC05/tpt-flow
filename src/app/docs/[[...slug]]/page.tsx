import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAllDocs, getDocBySlug, extractToc } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { TableOfContents } from "@/components/docs/TableOfContents";

export async function generateStaticParams() {
  const docs = getAllDocs();
  return docs.map((doc) => ({ slug: [doc.slug] }));
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const docSlug = slug?.[0] ?? "parameters";
  const doc = getDocBySlug(docSlug);
  if (!doc) return {};
  return { title: doc.meta.title, description: doc.meta.description };
}

export default async function DocsPage(props: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await props.params;
  const docSlug = slug?.[0];

  // /docs → redirect to first doc
  if (!docSlug) {
    const docs = getAllDocs();
    if (docs.length > 0) redirect(`/docs/${docs[0].slug}`);
    return notFound();
  }

  const doc = getDocBySlug(docSlug);
  if (!doc) return notFound();

  const toc = extractToc(doc.content);

  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0">
        <DocsBreadcrumb title={doc.meta.title} />
        <article className="prose prose-sm sm:prose dark:prose-invert max-w-none
          prose-headings:font-bold prose-headings:tracking-tight
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-code:text-primary prose-code:bg-muted prose-code:rounded prose-code:px-1 prose-code:py-0.5
          prose-pre:bg-transparent prose-pre:p-0
        ">
          <MDXRemote
            source={doc.content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  [rehypePrettyCode, { theme: { dark: "github-dark-dimmed", light: "github-light" }, keepBackground: false }],
                ],
              },
            }}
          />
        </article>
      </div>
      <TableOfContents entries={toc} />
    </div>
  );
}
