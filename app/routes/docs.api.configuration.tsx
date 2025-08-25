import { type MetaFunction } from "react-router";
import { DocsLayout } from "~/components/docs-layout";
import { MarkdownRenderer } from "~/components/markdown-renderer";
import { useMdxContent } from "~/lib/use-mdx-content";

export const meta: MetaFunction = () => {
  return [
    { title: "Configuration - MCPC Documentation" },
    {
      name: "description",
      content: "Learn how to configure MCPC servers with advanced settings, environment variables, and deployment options.",
    },
  ];
};

export default function DocsApiConfiguration() {
  const { content, loading, error } = useMdxContent("/docs/api/configuration.mdx");

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