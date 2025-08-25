import { Link } from "@heroui/link";
import { useFetcher, type MetaFunction } from "react-router";
import { subtitle, title } from "~/components/primitives";
import { Navbar } from "~/components/navbar";
import { Button, Divider, Spinner } from "@heroui/react";
import React, { useEffect, useState, useMemo } from "react";
import { ServerListResponse } from "~/routes/smithery";
import { PrimeReactProvider } from "primereact/api";
import { JSONSchemaFaker } from "json-schema-faker";
import { McpcConfigModal } from "../components/mcpc-config-modal";
import { McpcMentionInput } from "../components/mcpc-mention-input";

const MCPC_SERVER_DEFAULT_NAME = "mcpc-server-name-example";
const MCPC_TOOL_DEFAULT_NAME = "mcpc-tool-name-example";
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
}): McpcConfig {
  const { serverName, toolName, description, serverDeps } = params;

  const deps = safeBuildDepsConfig(serverDeps);
  const configRaw = JSON.stringify([
    {
      name: toolName,
      description,
      deps,
    },
  ]);

  return {
    mcpServers: {
      [serverName]: {
        command: "npx",
        args: ["-y", "deno", "run", "--allow-all", "jsr:@mcpc/core/bin"],
        env: { MCPC_CONFIG: configRaw },
      },
    },
  };
}

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
  const [isShowResult, setIsShowResult] = useState(false);
  const [serverName, setServerName] = useState(MCPC_SERVER_DEFAULT_NAME);
  const [toolName, setToolName] = useState(MCPC_TOOL_DEFAULT_NAME);
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
      }),
    [serverName, toolName, resolvedValue, serverDeps]
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
          <span className={title()}>Create Your </span>
          <span className={title({ color: "violet" })}>
            Agentic MCP Server
          </span>
          <span className={title()}> with a Single Prompt.</span>
          <div className={subtitle({ class: "mt-4" })}>
            Powered by the composition of thousands of MCPs, Try it out below.
          </div>
          
          {/* Get Started Section */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6 mb-8">
            <Button
              as={Link}
              href="/docs/quick-start"
              color="primary"
              size="lg"
              className="min-w-[200px]"
            >
              Get Started
            </Button>
            <Button
              as={Link}
              href="/docs"
              variant="bordered"
              size="lg"
              className="min-w-[200px]"
            >
              Documentation
            </Button>
            <Button
              as={Link}
              href="/docs/examples/basic"
              variant="flat"
              size="lg"
              className="min-w-[200px]"
            >
              Examples
            </Button>
          </div>
          
          <iframe
            className="w-full aspect-video border-0 rounded-lg"
            src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?rel=0&modestbranding=1`}
            title="YouTube video"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
          <div className="mt-3 flex flex-col sm:flex-row items-center justify-center gap-2">
            <span className="text-sm text-default-500">
              Cannot sign in or play inside the page?
            </span>
            <Link
              isExternal
              href={`https://youtu.be/${YOUTUBE_VIDEO_ID}`}
              title="Open on YouTube"
              className="text-primary"
            >
              <Button color="primary" variant="flat" size="sm">
                Open on YouTube
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
        mcpcConfigStr={mcpcConfigStr}
        mcpcConfig={mcpcConfig}
        MCPC_SERVER_DEFAULT_NAME={MCPC_SERVER_DEFAULT_NAME}
        MCPC_TOOL_DEFAULT_NAME={MCPC_TOOL_DEFAULT_NAME}
      />
    </IndexLayout>
  );
}
