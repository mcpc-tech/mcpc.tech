// Define types for the API responses
export interface ServerListResponse {
  servers: Array<{
    // Extended info
    resolvedToolDef?: string;
    detail?: ServerDetailResponse;

    qualifiedName: string;
    displayName: string;
    description: string;
    homepage: string;
    useCount: string;
    isDeployed: boolean;
    createdAt: string;
  }>;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
  };
}

export interface ServerDetailResponse {
  qualifiedName: string;
  displayName: string;
  remote: boolean;
  iconUrl: string | null;
  deploymentUrl: string | null;
  configSchema: unknown; // JSONSchema
  connections: Array<{
    type: "stdio" | "http" | "ws";
    url?: string;
    deploymentUrl?: string;
    configSchema: unknown; // JSONSchema
    config: unknown; // JSONSchema
    exampleConfig?: unknown;
    published?: boolean;
    stdioFunction?: string;
  }>;
  security: {
    scanPassed: boolean;
  } | null;
  tools: Array<{
    name: string;
    description: string | null;
  }> | null;
}

export interface LoaderData {
  servers?: ServerListResponse;
  serverDetail?: ServerDetailResponse;
  error?: string;
}

// Loader function to fetch data from the Smithery Registry API
export async function loader({
  request,
  context,
}: {
  request: Request;
  context: { cloudflare: { env: { SMITHERY_API_TOKEN?: string } } };
}): Promise<Response> {
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("q") || "";
  const serverName = url.searchParams.get("server");
  console.log({ url, searchQuery, serverName });

  // Get API token from environment variable or server-side session
  const apiToken = context.cloudflare.env.SMITHERY_API_TOKEN;

  if (!apiToken) {
    return new Response(JSON.stringify({ error: "API token not configured" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const headers = {
    Authorization: `Bearer ${apiToken}`,
    "Content-Type": "application/json",
  };

  try {
    if (serverName) {
      // Fetch specific server details
      const response = await fetch(
        `https://registry.smithery.ai/servers/${serverName}`,
        {
          headers,
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch server details: ${response.statusText}`
        );
      }

      return response.json();
    } else {
      // Fetch server list with optional search query
      const queryParams = new URLSearchParams();
      if (searchQuery) {
        queryParams.set("q", `${searchQuery}`);
      }
      console.log(`https://registry.smithery.ai/servers?${queryParams.toString()}`);
      const response = await fetch(
        `https://registry.smithery.ai/servers?${queryParams.toString()}`,
        {
          headers,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch server list: ${response.statusText}`);
      }

      return response.json();
    }
  } catch (error) {
    console.error("API request failed:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch data from Smithery Registry" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export function schemaToEnv(
  schema: any,
  prefix: string
): Record<string, string> {
  const env: Record<string, string> = {};

  if (!schema || !schema.properties) {
    return env;
  }

  function processProperties(properties: any, prefix: string = "") {
    for (const [key, value] of Object.entries(properties)) {
      if (
        typeof value === "object" &&
        !Array.isArray(value) &&
        value !== null
      ) {
        const prop = value as any;
        if (prop.properties) {
          processProperties(prop.properties, prefix ? `${prefix}_${key}` : key);
          continue;
        }
        const envKey = prefix
          ? `${prefix}_${key}`.toUpperCase()
          : key.toUpperCase();

        if (prop.default !== undefined) {
          if (
            typeof prop.default === "boolean" ||
            typeof prop.default === "number"
          ) {
            env[envKey] = String(prop.default);
          } else {
            env[envKey] = String(prop.default);
          }
        } else if (prop.example !== undefined) {
          if (
            typeof prop.example === "boolean" ||
            typeof prop.example === "number"
          ) {
            env[envKey] = String(prop.example);
          } else {
            env[envKey] = String(prop.example);
          }
        } else {
          env[envKey] = key;
        }
      }
    }
  }

  processProperties(schema.properties, prefix);
  return env;
}
