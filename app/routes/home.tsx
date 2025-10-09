import { Link } from "@heroui/link";
import { useFetcher, type MetaFunction } from "react-router";
import { subtitle, title } from "~/components/primitives";
import { Navbar } from "~/components/navbar";
import { Button, Spinner } from "@heroui/react";
import React, { useEffect, useState, useMemo } from "react";
import { ServerListResponse } from "~/routes/smithery";
import { PrimeReactProvider } from "primereact/api";
import { McpcConfigModal } from "../components/mcpc-config-modal";
import { TiptapEditor } from "../components/tiptap-editor";

const MCPC_SERVER_DEFAULT_NAME = "mcpc";
const MCPC_TOOL_DEFAULT_NAME = "mcpc-agent";

type McpcConfig = {
  mcpServers: Record<
    string,
    { command: string; args: string[]; env?: Record<string, string> }
  >;
};

type ConnectionType = "stdio" | "http";

type ConfigSchema = {
  type: ConnectionType;
  schema: any;
  exampleConfig?: any;
};

// Build stdio server configuration
function buildStdioConfig(connection: any, userConfig: any) {
  try {
    const fn = eval(connection.stdioFunction ?? "");
    if (typeof fn === "function") {
      const config = userConfig || connection.exampleConfig || {};
      return fn(config);
    }
  } catch {
    // Invalid stdio function, skip this server
  }
  return null;
}

// Build HTTP server configuration
function buildHttpConfig(connection: any, userConfig: any, globalSmitheryApiKey?: string) {
  const { smitheryApiKey, ...otherConfig } = userConfig || {};
  
  const smitheryConfig: any = {
    ...connection,
    config: otherConfig,
  };
  
  delete smitheryConfig.configSchema;
  
  // Use global API key or server-specific one
  const apiKey = globalSmitheryApiKey || smitheryApiKey;
  if (apiKey) {
    smitheryConfig.smitheryApiKey = apiKey;
  }
  
  return { smitheryConfig };
}

// Build dependency configurations from server list
function buildDepsConfig(
  serverDeps: ServerListResponse["servers"],
  userConfigs: Record<string, any>
) {
  const mcpServers: Record<string, unknown> = {};
  
  // Extract global smitheryApiKey if it exists
  const globalSmitheryApiKey = userConfigs._global?.smitheryApiKey;

  for (const server of serverDeps) {
    const { detail, qualifiedName } = server;
    const userConfig = userConfigs[qualifiedName];
    
    const stdio = detail?.connections.find((c) => c.type === "stdio");
    const http = detail?.connections.find((c) => c.type === "http");

    if (stdio) {
      const config = buildStdioConfig(stdio, userConfig);
      if (config) {
        mcpServers[qualifiedName] = config;
      }
      continue;
    }

    if (http) {
      mcpServers[qualifiedName] = buildHttpConfig(http, userConfig, globalSmitheryApiKey);
    }
  }

  return { mcpServers };
}

// Extract configuration schemas from server dependencies
function extractConfigSchemas(serverDeps: ServerListResponse["servers"]) {
  const schemas: Record<string, ConfigSchema> = {};
  
  for (const server of serverDeps) {
    const { detail, qualifiedName } = server;
    
    const stdio = detail?.connections.find((c) => c.type === "stdio");
    const http = detail?.connections.find((c) => c.type === "http");

    if (stdio?.configSchema) {
      schemas[qualifiedName] = {
        type: "stdio",
        schema: stdio.configSchema,
        exampleConfig: stdio.exampleConfig,
      };
    }

    if (http?.configSchema) {
      schemas[qualifiedName] = {
        type: "http",
        schema: http.configSchema,
      };
    }
  }

  return schemas;
}

// Build agent options
function buildAgentOptions(mode: string, enableSampling: boolean) {
  const options: any = {};
  
  if (mode !== "agentic") {
    options.mode = mode;
  }
  
  if (enableSampling) {
    options.sampling = true;
  }
  
  return Object.keys(options).length > 0 ? options : null;
}

// Build complete MCPC configuration
function buildMcpcConfig(params: {
  serverName: string;
  toolName: string;
  description: string;
  serverDeps: ServerListResponse["servers"];
  mode: "agentic" | "agentic-workflow";
  enableSampling: boolean;
  userConfigs: Record<string, any>;
}): McpcConfig {
  const { serverName, toolName, description, serverDeps, mode, enableSampling, userConfigs } = params;

  const deps = buildDepsConfig(serverDeps, userConfigs);
  
  const agentConfig: any = {
    name: toolName,
    description,
    deps,
  };

  const options = buildAgentOptions(mode, enableSampling);
  if (options) {
    agentConfig.options = options;
  }

  const config = {
    name: toolName,
    version: "1.0.0",
    agents: [agentConfig],
  };

  return {
    mcpServers: {
      [serverName]: {
        command: "npx",
        args: ["-y", "@mcpc-tech/cli", "--config", JSON.stringify(config)],
      },
    },
  };
}

export function HydrateFallback() {
  return <Spinner />;
}

export const meta: MetaFunction = () => {
  return [
    { title: "MCPC - Build Agentic MCP Servers" },
    {
      name: "description",
      content:
        "The SDK for building agentic MCP (Model Context Protocol) Servers. Create powerful tools, fine-tune existing ones, and build multi-agent systems.",
    },
    {
      name: "keywords",
      content:
        "MCP, MCPC, MCP Compose, agentic servers, Model Context Protocol, SDK, multi-agent systems, AI tools, LLM, machine learning, developer tools",
    },
    { tagName: "link", rel: "canonical", href: "https://mcpc.tech" },
    {
      property: "og:title",
      content: "MCPC - Build Agentic MCP Servers",
    },
    {
      property: "og:description",
      content:
        "The SDK for building agentic MCP (Model Context Protocol) Servers. Create powerful tools, fine-tune existing ones, and build multi-agent systems.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://mcpc.tech" },
    { property: "og:image", content: "https://mcpc.tech/og-image.png" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:site_name", content: "MCPC" },
    { property: "og:locale", content: "en_US" },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: "MCPC - Build Agentic MCP Servers",
    },
    {
      name: "twitter:description",
      content:
        "The SDK for building agentic MCP (Model Context Protocol) Servers. Create powerful tools, fine-tune existing ones, and build multi-agent systems.",
    },
    { name: "twitter:image", content: "https://mcpc.tech/og-image.png" },
    { name: "twitter:site", content: "@mcpctech" },
    { name: "twitter:creator", content: "@mcpctech" },
    { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
    { name: "googlebot", content: "index, follow" },
    { name: "author", content: "MCPC" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { charSet: "utf-8" },
  ];
};

export function IndexLayout({ children }: React.PropsWithChildren<unknown>) {
  // Structured data for better SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "MCPC",
    "applicationCategory": "DeveloperApplication",
    "description": "The SDK for building agentic MCP (Model Context Protocol) Servers. Create powerful tools, fine-tune existing ones, and build multi-agent systems.",
    "url": "https://mcpc.tech",
    "operatingSystem": "Cross-platform",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Organization",
      "name": "MCPC",
      "url": "https://github.com/mcpc-tech"
    },
    "sameAs": [
      "https://github.com/mcpc-tech/mcpc",
      "https://x.com/mcpctech"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="relative flex flex-col min-h-screen">
        <Navbar />
        <main className="container mx-auto max-w-[95%] md:max-w-[90%] lg:max-w-8xl py-4 px-6 flex-grow flex items-center justify-center">
          <PrimeReactProvider>{children}</PrimeReactProvider>
        </main>
        <footer className="w-full flex items-center justify-center py-2">
          <span className="text-xs text-default-400">© 2025 MCPC. All rights reserved.</span>
        </footer>
      </div>
    </>
  );
}

export default function Index() {
  const fetcher = useFetcher();
  const detailFetcher = useFetcher();
  const { servers } = (fetcher?.data as unknown as ServerListResponse) ?? {
    servers: [],
  };
  const [isShowResult, setIsShowResult] = useState(false);
  const [serverName, setServerName] = useState(MCPC_SERVER_DEFAULT_NAME);
  const [toolName, setToolName] = useState(MCPC_TOOL_DEFAULT_NAME);
  const [mode, setMode] = useState<"agentic" | "agentic-workflow">("agentic");
  const [enableSampling, setEnableSampling] = useState(false);
  const [serverDeps, setServerDeps] = useState<ServerListResponse["servers"]>(
    []
  );
  const [resolvedValue, setResolvedValue] = useState("");
  const [userConfigs, setUserConfigs] = useState<Record<string, any>>({});
  
  const configSchemas = useMemo(
    () => extractConfigSchemas(serverDeps),
    [serverDeps]
  );
  
  const mcpcConfig = useMemo(
    () =>
      buildMcpcConfig({
        serverName,
        toolName,
        description: resolvedValue,
        serverDeps,
        mode,
        enableSampling,
        userConfigs,
      }),
    [serverName, toolName, resolvedValue, serverDeps, mode, enableSampling, userConfigs]
  );
  const mcpcConfigStr = useMemo(
    () => JSON.stringify(mcpcConfig, null, 2),
    [mcpcConfig]
  );

  const handleSubmit = () => setIsShowResult(true);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data == null) {
      fetcher.load("/smithery");
    }
  }, [fetcher]);

  return (
    <IndexLayout>
      <section className="flex flex-col w-full md:w-8/12 lg:w-6/12 justify-center gap-8 py-4">
        <div className="inline-block max-w-7xl text-center justify-center">
          <span className={title()}>Build </span>
          <span className={title({ color: "violet" })}>Agentic MCP</span>{" "}
          <span className={title()}>Servers</span>
          <div className={subtitle({ class: "mt-8" })}>
            The SDK for building agentic MCP (Model Context Protocol) Servers.
            Create powerful tools, fine-tune existing ones, and build
            multi-agent systems.
          </div>
          <div className="mt-4 mb-3 flex flex-wrap items-center justify-center gap-2">
            <Link
              isExternal
              href="https://github.com/mcpc-tech/mcpc/tree/main/docs"
              title="View Documentation"
            >
              <Button color="primary" variant="flat" size="sm">
                📚 Documentation
              </Button>
            </Link>
            <Link
              isExternal
              href={`https://www.youtube.com/watch?v=p21YdFGGQcw&list=PLWenI1XMQwrgybXjzg7TLvtwMHcVdyQU4`}
              title="Watch on YouTube"
            >
              <Button color="secondary" variant="flat" size="sm">
                🎥 Watch Video Examples
              </Button>
            </Link>
            <Link
              isExternal
              href="https://github.com/mcpc-tech/mcpc"
              title="View on GitHub"
            >
              <Button color="default" variant="bordered" size="sm">
                ⭐ Star on GitHub
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="text-center mb-2">
          <p className="text-sm text-default-500">
            ✨ Quick Demo: Try describing your tool below and reference MCP dependencies with <code className="text-primary">@</code>
          </p>
        </div>
        
        <TiptapEditor
          servers={servers}
          fetcher={fetcher}
          detailFetcher={detailFetcher}
          onDepsChange={setServerDeps}
          onDescriptionChange={setResolvedValue}
        />
        <Button
          className="mt-4"
          onPress={handleSubmit}
          color="primary"
          variant="bordered"
        >
          Create Your MCP Server
        </Button>
      </section>
      <McpcConfigModal
        isOpen={isShowResult}
        onClose={() => setIsShowResult(false)}
        serverName={serverName}
        setServerName={setServerName}
        toolName={toolName}
        setToolName={setToolName}
        mode={mode}
        setMode={setMode}
        enableSampling={enableSampling}
        setEnableSampling={setEnableSampling}
        mcpcConfigStr={mcpcConfigStr}
        mcpcConfig={mcpcConfig}
        MCPC_SERVER_DEFAULT_NAME={MCPC_SERVER_DEFAULT_NAME}
        MCPC_TOOL_DEFAULT_NAME={MCPC_TOOL_DEFAULT_NAME}
        configSchemas={configSchemas}
        userConfigs={userConfigs}
        setUserConfigs={setUserConfigs}
        serverDeps={serverDeps}
      />
    </IndexLayout>
  );
}
