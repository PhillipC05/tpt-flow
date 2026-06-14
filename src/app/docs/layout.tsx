import { getAllDocs } from "@/lib/mdx";
import { DocsSidebar } from "@/components/docs/Sidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const docs = getAllDocs();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex gap-10">
        <DocsSidebar docs={docs} />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
