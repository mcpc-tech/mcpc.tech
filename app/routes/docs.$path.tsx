import { type RouteConfig, redirect } from "react-router";
import type { Route } from "./+types/docs.$path";
import { DocsLayout } from "~/components/docs-layout";
import { TiptapRenderer } from "~/components/tiptap-renderer";
import { useMdxContent } from "~/lib/use-mdx-content";
import { getRouteByPath } from "~/lib/docs-config";

export async function loader({ params }: Route.LoaderArgs) {
  const path = params.path === undefined ? "/" : `/${params.path}`;
  
  const route = getRouteByPath(path);
  
  if (!route) {
    throw redirect("/docs");
  }
  
  return { route };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data?.route) {
    return [{ title: "Documentation - MCPC" }];
  }

  const { route } = data;
  return [
    { title: `${route.title} - MCPC Documentation` },
    {
      name: "description",
      content: route.description,
    },
  ];
}

export default function DocsPage({ loaderData }: Route.ComponentProps) {
  const { route } = loaderData;
  const { content, loading, error } = useMdxContent(route.file);

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
        <TiptapRenderer content={content} />
      )}
    </DocsLayout>
  );
}