import { type MetaFunction } from "react-router";
import { DocsLayout } from "~/components/docs-layout";
import { MarkdownRenderer } from "~/components/markdown-renderer";
import { useMdxContent } from "~/lib/use-mdx-content";

export const meta: MetaFunction = () => {
  return [
    { title: "MCPC Documentation - MCP Compose SDK" },
    {
      name: "description",
      content: "Learn how to create agentic MCP servers with MCPC. Complete API reference, examples, and guides.",
    },
  ];
};

export default function DocsIndex() {
  const { content, loading, error } = useMdxContent("/docs/index.mdx");

  return (
    <DocsLayout>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-foreground-600">Loading documentation...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-red-500">Error loading documentation: {error}</div>
        </div>
      ) : (
        <MarkdownRenderer content={content} />
      )}
    </DocsLayout>
  );
}