import { Link } from "@heroui/link";
import { useFetcher, type MetaFunction } from "react-router";
import { subtitle, title } from "~/components/primitives";
import { Navbar } from "~/components/navbar";
import { Button, Spinner } from "@heroui/react";
import React, { useEffect, useState, useMemo } from "react";
import { ServerListResponse } from "~/routes/smithery";
import { PrimeReactProvider } from "primereact/api";
import { JSONSchemaFaker } from "json-schema-faker";
import { McpcConfigModal } from "../components/mcpc-config-modal";
import { McpcMentionInput } from "../components/mcpc-mention-input";

const MCPC_SERVER_DEFAULT_NAME = "mcpc";
const MCPC_TOOL_DEFAULT_NAME = "mcpc-agent";
const YOUTUBE_VIDEO_ID = "7Z1H_y0QeRY";

type McpcConfig = {
  mcpServers: Record<
    string,
    { command: string; args: string[]; env?: Record<string, string> }
  >;
};

function safeBuildDepsConfig(serverDeps: ServerListResponse["servers"]) {
  const depsConfig: { mcpServers: Record<string, unknown> } = {
    mcpServers: {},
  };

  serverDeps.forEach(({ detail, qualifiedName }) => {
    const stdio = detail?.connections.find((v) => v.type === "stdio");
    const remote = detail?.connections.find((v) => v.type === "http");

    if (stdio) {
      // stdioFunction is a stringified function. Evaluate cautiously.
      try {
        // eslint-disable-next-line no-eval
        const fn = eval(stdio.stdioFunction ?? "");
        if (typeof fn === "function") {
          depsConfig.mcpServers[qualifiedName] = fn(stdio.exampleConfig ?? {});
        }
      } catch {
        // Ignore invalid stdioFunction
      }
      return;
    }

    if (remote) {
      // Clone to avoid mutating original data
      const remoteCopy: any = { ...remote };
      try {
        remoteCopy.config = JSONSchemaFaker.generate(
          remoteCopy.configSchema ?? ({} as any)
        );
      } catch {
        remoteCopy.config = {};
      }
      delete remoteCopy.configSchema;
      depsConfig.mcpServers[qualifiedName] = { smitheryConfig: remoteCopy };
    }
  });

  return depsConfig;
}

function buildMcpcConfig(params: {
  serverName: string;
  toolName: string;
  description: string;
  serverDeps: ServerListResponse["servers"];
  mode: "agentic" | "agentic-workflow";
  enableSampling: boolean;
}): McpcConfig {
  const { serverName, toolName, description, serverDeps, mode, enableSampling } = params;

  const deps = safeBuildDepsConfig(serverDeps);
  const agentConfig: any = {
    name: toolName,
    description,
    deps,
  };

  // Add options for mode and sampling
  const options: any = {};
  if (mode !== "agentic") {
    options.mode = mode;
  }
  if (enableSampling) {
    options.sampling = true;
  }
  
  // Only add options if there are any
  if (Object.keys(options).length > 0) {
    agentConfig.options = options;
  }

  // Build the config object
  const config: any = {
    name: toolName,
    version: "1.0.0",
    agents: [agentConfig],
  };

  return {
    mcpServers: {
      [serverName]: {
        command: "npx",
        args: [
          "-y",
          "@mcpc-tech/cli@beta",
          "--config",
          JSON.stringify(config),
        ],
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
        "MCP, MCPC, MCP Compose, agentic servers, Model Context Protocol, SDK, multi-agent systems",
    },
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
    { property: "og:image", content: "https://mcpc.tech/og-image.png" }, // You'll need to create this image
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
        <span className="text-default-600">© 2025 MCPC. All rights reserved.</span>
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
  const [isShowResult, setIsShowResult] = useState(false);
  const [serverName, setServerName] = useState(MCPC_SERVER_DEFAULT_NAME);
  const [toolName, setToolName] = useState(MCPC_TOOL_DEFAULT_NAME);
  const [mode, setMode] = useState<"agentic" | "agentic-workflow">("agentic");
  const [enableSampling, setEnableSampling] = useState(false);
  const [serverDeps, setServerDeps] = useState<ServerListResponse["servers"]>(
    []
  );
  const [resolvedValue, setResolvedValue] = useState("");
  const mcpcConfig = useMemo(
    () =>
      buildMcpcConfig({
        serverName,
        toolName,
        description: resolvedValue,
        serverDeps,
        mode,
        enableSampling,
      }),
    [serverName, toolName, resolvedValue, serverDeps, mode, enableSampling]
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

  // Avoid mutating fetcher data; consumers should handle empty tools gracefully.

  return (
    <IndexLayout>
      <section className="flex flex-col w-full md:w-8/12 lg:w-6/12 justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-7xl text-center justify-center">
          <span className={title()}>Build </span>
          <span className={title({ color: "violet" })}>Agentic MCP</span>{" "}
          <span className={title()}>Servers</span>
          <div className={subtitle({ class: "mt-4" })}>
            The SDK for building agentic MCP (Model Context Protocol) Servers.
            Create powerful tools, fine-tune existing ones, and build
            multi-agent systems.
          </div>
          <div className="mt-6 mb-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              isExternal
              href="https://github.com/mcpc-tech/mcpc/tree/main/docs"
              title="View Documentation"
            >
              <Button color="primary" variant="flat" size="md">
                📚 Documentation
              </Button>
            </Link>
            <Link
              isExternal
              href={`https://youtu.be/${YOUTUBE_VIDEO_ID}`}
              title="Watch on YouTube"
            >
              <Button color="secondary" variant="flat" size="md">
                🎥 Watch Video Examples
              </Button>
            </Link>
            <Link
              isExternal
              href="https://github.com/mcpc-tech/mcpc"
              title="View on GitHub"
            >
              <Button color="default" variant="bordered" size="md">
                ⭐ Star on GitHub
              </Button>
            </Link>
          </div>
        </div>
        <McpcMentionInput
          servers={servers}
          detailFetcher={detailFetcher}
          fetcher={fetcher}
          onDepsChange={setServerDeps}
          onDescriptionChange={setResolvedValue}
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
      />
    </IndexLayout>
  );
}
