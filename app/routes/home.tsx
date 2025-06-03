import { Link } from "@heroui/link";
import { useFetcher, type MetaFunction } from "react-router";
import { subtitle, title } from "~/components/primitives";
import { Navbar } from "~/components/navbar";
import {
  Accordion,
  AccordionItem,
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { SuggestionDataItem } from "react-mentions";
import { ServerDetailResponse, ServerListResponse } from "~/routes/smithery";
import { Mention } from "primereact/mention";
import { PrimeReactProvider } from "primereact/api";
import { CodeBlock } from "~/components/code";
import { JSONSchemaFaker } from "json-schema-faker";

const MCPC_SERVER_DEFAULT_NAME = "mcpc-server-name-example";
const MCPC_TOOL_DEFAULT_NAME = "mcpc-tool-name-example";

export function HydrateFallback() {
  return <Spinner />;
}

export const meta: MetaFunction = () => {
  return [
    { title: "MCP Compose - Create Agentic MCP Servers" },
    {
      name: "description",
      content:
        "Create your agentic MCP server with a single prompt. Powered by the composition of thousands of MCPs.",
    },
    {
      name: "keywords",
      content:
        "MCP, MCP Compose, agentic servers, smithery.ai, server composition",
    },
    {
      property: "og:title",
      content: "MCP Compose - Create Agentic MCP Servers",
    },
    {
      property: "og:description",
      content:
        "Create your agentic MCP server with a single prompt. Powered by the composition of thousands of MCPs.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://mcpc.tech" },
    { property: "og:image", content: "https://mcpc.tech/og-image.png" }, // You'll need to create this image
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: "MCP Compose - Create Agentic MCP Servers",
    },
    {
      name: "twitter:description",
      content:
        "Create your agentic MCP server with a single prompt. Powered by the composition of thousands of MCPs.",
    },
    { name: "twitter:image", content: "https://mcpc.tech/og-image.png" }, // Same image as OG
    { name: "robots", content: "index, follow" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { charSet: "utf-8" },
  ];
};

export function IndexLayout({ children }: React.PropsWithChildren<unknown>) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-[95%] md:max-w-[90%] lg:max-w-8xl pt-16 px-6 flex-grow flex items-center justify-center">
        <PrimeReactProvider>{children}</PrimeReactProvider>
      </main>
      <footer className="w-full flex items-center justify-center py-3 gap-2">
        <span className="text-default-600">Powered by</span>
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://heroui.com/docs/guide/introduction"
          title="heroui.com homepage"
        >
          <p className="text-primary">HeroUI</p>
        </Link>

        <Divider orientation="vertical" />
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://primereact.org/"
          title="https://primereact.org/ homepage"
        >
          <p className="text-primary">PrimeReact</p>
        </Link>

        <Divider orientation="vertical" />
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://smithery.ai"
          title="smithery.ai homepage"
        >
          <p className="text-primary">smithery.ai</p>
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
  const [isShowResult, setIsShowResult] = useState(false);
  const [mcpcConfig, setMcpcConfig] = useState<any>({});

  const [serverName, setServerName] = useState(MCPC_SERVER_DEFAULT_NAME);
  const [toolName, setToolName] = useState(MCPC_TOOL_DEFAULT_NAME);

  const [serverDeps, setServerDeps] = useState<ServerListResponse["servers"]>(
    []
  );
  const textareaRef = useRef<HTMLInputElement>(null);
  const mentionRef = useRef<Mention>(null);
  const mcpcConfigStr = useMemo(
    () => JSON.stringify(mcpcConfig, null, 2),
    [mcpcConfig]
  );

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

  const calcMcpcConfig = useCallback(() => {
    const depsConfg = {
      // @ts-ignore
      mcpServers: {} as Record<string, any>,
    };
    serverDeps.forEach(({ detail, qualifiedName }) => {
      const stdio = detail?.connections.find((v) => v.type === "stdio");
      const remote = detail?.connections.find((v) => v.type === "http");

      if (stdio) {
        depsConfg.mcpServers[qualifiedName] = eval(stdio.stdioFunction ?? "")?.(
          stdio?.exampleConfig ?? {}
        );
      } else if (remote) {
        // Faking a config
        remote.config = JSONSchemaFaker.generate(remote.configSchema as any);
        Reflect.deleteProperty(remote, "configSchema");
        depsConfg.mcpServers[qualifiedName] = {
          smitheryConfig: remote,
        };
      }
    });
    const configRaw = JSON.stringify([
      {
        name: toolName,
        description: resolvedValue,
        deps: depsConfg,
      },
    ]);
    const config = {
      mcpServers: {
        [serverName]: {
          command: "npx",
          args: [
            "-y",
            "deno",
            "run",
            "--allow-all",
            "jsr:@mcpc/core/bin",
            // `--mcpc-config=${configRaw}`,
          ],
          env: {
            MCPC_CONFIG: configRaw,
          },
        },
      },
    };

    return config;
  }, [serverDeps, serverName, toolName, resolvedValue]);

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
          className="rounded-lg w-full whitespace-normal"
        >
          {tools && (
            <div className="w-full list-disc list-inside py-1 px-2">
              {tools.map((tool) => (
                <button
                  key={tool.name}
                  onClick={() => {
                    setSelectedToolName(tool.name);
                    mcpSuggestion.resolvedToolDef = `${mcpSuggestion.qualifiedName}.${tool.name}`;
                    // TODO: bug->not delete old deps when change tool/remove tool
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

  const handleSubmit = () => {
    const config = calcMcpcConfig();
    setMcpcConfig(config);
    setIsShowResult(true);
  };

  useEffect(() => {
    mentionRef.current?.focus();
  }, [mentionRef]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data == null) {
      fetcher.load("/smithery");
    }
  }, [fetcher]);

  useEffect(() => {
    if (detailFetcher.data) {
      if (detailFetcher.data.tools?.length === 0) {
        detailFetcher.data.tools.push({
          name: "__ALL__",
          description:
            "No tools registered - you can select this placeholder for now and modify it later",
        });
      }
    }
  }, [detailFetcher.data]);

  useEffect(() => {
    setMcpcConfig((mcpcConfig: any) => {
      if (!mcpcConfig) {
        return mcpcConfig;
      }
      return calcMcpcConfig();
    });
  }, [calcMcpcConfig]);

  return (
    <IndexLayout>
      <section className="flex flex-col w-full md:w-8/12 lg:w-6/12 justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-7xl text-center justify-center">
          <span className={title()}>Create Your </span>
          <span className={title({ color: "violet" })}>Agentic MCP Server</span>
          <span className={title()}>with a Single Prompt.</span>
          <div className={subtitle({ class: "mt-4" })}>
            Powered by the composition of thousands of MCPs, Try it out below.
          </div>

          <iframe
            className="w-full aspect-video border-0 rounded-lg"
            src="https://www.youtube.com/embed/7Z1H_y0QeRY?si=G0ouBQELLsQcYbke"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>

        <Mention
          field={"resolvedToolDef"}
          value={value}
          inputRef={textareaRef}
          onChange={(e) => {
            const { value } = e.target as HTMLInputElement;
            setValue(value);
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
          placeholder="Type > to search and reference MCPs from Smithery as dependencies"
          itemTemplate={renderSuggestion}
          inputClassName="w-full z-0 p-2"
          panelClassName="w-8/12  overflow-x-scroll z-50 p-2 border-1 rounded-lg shadow-md bg-content1"
          className="min-h-24 z-50"
        />

        <Button
          className="mt-8"
          onPress={handleSubmit}
          color="primary"
          variant="bordered"
        >
          Create Your MCP Server
        </Button>
      </section>

      <Modal
        isOpen={isShowResult}
        size={"full"}
        onClose={() => {
          setIsShowResult(false);
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Your MCP Server is Ready, Use & Share it 🎉
              </ModalHeader>
              <ModalBody>
                <div className="flex justify-between gap-4">
                  <Input
                    isClearable
                    name="serverName"
                    label="Server Name"
                    value={serverName}
                    onChange={(e) => {
                      setServerName(e.target.value);
                    }}
                    onClear={() => {
                      setServerName(MCPC_SERVER_DEFAULT_NAME);
                    }}
                  />

                  <Input
                    isClearable
                    name="toolName"
                    label="Tool Name"
                    value={toolName}
                    onChange={(e) => {
                      setToolName(e.target.value);
                    }}
                    onClear={() => {
                      setToolName(MCPC_TOOL_DEFAULT_NAME);
                    }}
                  />
                </div>

                <CodeBlock code={mcpcConfigStr} language={"json"} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    onClose();
                    navigator.clipboard.writeText(JSON.stringify(mcpcConfig));
                  }}
                >
                  Copy Config
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </IndexLayout>
  );
}
