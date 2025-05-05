import { Link } from "@heroui/link";
import { useFetcher, type MetaFunction } from "react-router";
import { subtitle, title } from "~/components/primitives";
import { Navbar } from "~/components/navbar";
import { Accordion, AccordionItem, Button } from "@heroui/react";
import { useRef, useEffect, useState } from "react";
import { SuggestionDataItem } from "react-mentions";
import { ServerDetailResponse, ServerListResponse } from "~/routes/smithery";
import { Mention } from "primereact/mention";
import { PrimeReactProvider } from "primereact/api";

export function HydrateFallback() {
  return <div>Loading...</div>;
}

export const meta: MetaFunction = () => {
  return [
    { title: "MCP Compose" },
    { name: "description", content: "MCP Compose" },
  ];
};

export function IndexLayout({ children }: React.PropsWithChildren<unknown>) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-8xl pt-16 px-6 flex-grow flex items-center justify-center">
        <PrimeReactProvider>{children}</PrimeReactProvider>
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://heroui.com/docs/guide/introduction"
          title="heroui.com homepage"
        >
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">HeroUI</p>
        </Link>
      </footer>
    </div>
  );
}

export default function Index() {
  const fetcher = useFetcher();
  const detailFetcher = useFetcher();
  const { servers } = (fetcher?.data as unknown as ServerListResponse) ?? {
    servers: [],
  };
  const [value, setValue] = useState("");
  const [resolvedValue, setResolvedValue] = useState("");
  const [selectedServerNames, setSelectedServerNames] = useState(
    new Set<string>()
  );
  const [selectedToolName, setSelectedToolName] = useState<string>();

  const [serverDeps, setServerDeps] = useState<ServerListResponse["servers"]>(
    []
  );
  const textareaRef = useRef<HTMLInputElement>(null);
  const mentionRef = useRef<Mention>(null);

  console.log({
    servers,
    value,
    fetcher,
    detailFetcher,
    selectedServerNames,
    selectedToolName,
    resolvedValue,
    serverDeps,
  });

  const renderSuggestion = (
    suggestion: SuggestionDataItem
  ): React.ReactNode => {
    const mcpSuggestion =
      suggestion as unknown as ServerListResponse["servers"][number];
    const tools = detailFetcher.data?.tools as ServerDetailResponse["tools"];

    return (
      <Accordion
        className="rounded-none m-1"
        selectedKeys={selectedServerNames}
        onSelectionChange={(keys) => {
          setSelectedServerNames(new Set(keys as string));
          detailFetcher.submit(
            { server: mcpSuggestion.qualifiedName },
            { action: "/smithery", method: "GET" }
          );
        }}
        variant="shadow"
      >
        <AccordionItem
          key={mcpSuggestion.qualifiedName}
          aria-label={mcpSuggestion.qualifiedName}
          subtitle={mcpSuggestion.description}
          title={mcpSuggestion.qualifiedName}
          className="rounded-lg w-full"
        >
          {tools && (
            <div className="w-full list-disc list-inside py-1 px-2">
              {tools.map((tool) => (
                <button
                  key={tool.name}
                  onClick={() => {
                    setSelectedToolName(tool.name);
                    mcpSuggestion.resolvedToolDef = `${mcpSuggestion.qualifiedName}.${tool.name}`;
                    setServerDeps((deps) => [
                      ...deps,
                      { ...mcpSuggestion, detail: detailFetcher.data },
                    ]);
                    mentionRef.current?.hide();
                  }}
                  className="w-full text-left block px-4 py-2 rounded-md text-default-600 hover:text-primary hover:bg-default-100 transition-all duration-200 ease-in-out"
                >
                  <div className="w-full font-medium">{tool.name}</div>
                  <div className="w-full ml-6 mt-1 text-sm text-gray-500">
                    {tool.description}
                  </div>
                </button>
              ))}
            </div>
          )}
        </AccordionItem>
      </Accordion>
    );
  };

  useEffect(() => {
    mentionRef.current?.focus();
  }, [mentionRef]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data == null) {
      fetcher.load("/smithery");
    }
  }, [fetcher]);

  return (
    <IndexLayout>
      <section className="flex flex-col w-6/12 justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-7xl text-center justify-center">
          <span className={title()}>Create Your </span>
          <span className={title({ color: "violet" })}>
            Agentic MCP Server{" "}
          </span>
          <span className={title()}>with a Single Prompt.</span>
          <div className={subtitle({ class: "mt-4" })}>
            Powered by the composition of thousands of underlying MCPs, Try it
            out below.
          </div>
        </div>

        <Mention
          field={"resolvedToolDef"}
          value={value}
          inputRef={textareaRef}
          onChange={(e) => {
            const { value } = e.target as HTMLInputElement;
            setValue(value?.replaceAll(/>([^\s]+)/g, "$1"));
            setResolvedValue(
              value?.replaceAll(/>([^\s]+)/g, '<tool name="$1"/>')
            );
          }}
          onSearch={(e) => {
            fetcher.submit(
              {
                q: `${encodeURIComponent(e.query)}`,
              },
              { action: "/smithery", method: "GET" }
            );
          }}
          ref={mentionRef}
          trigger=">"
          suggestions={servers.map((server) => ({
            ...server,
            id: server.qualifiedName,
          }))}
          placeholder="Enter > to reference MCP as dependencies"
          itemTemplate={renderSuggestion}
          inputClassName="w-full z-0 p-2"
          panelClassName="w-8/12  overflow-x-scroll z-50 p-2 border-1 rounded-lg shadow-md bg-content1"
          className="min-h-24 z-50"
        />

        <Button className="mt-8" color="primary" variant="bordered">
          Create Your MCP Server
        </Button>
      </section>
    </IndexLayout>
  );
}
