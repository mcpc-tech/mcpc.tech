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
}: {
  request: Request;
}): Promise<Response> {
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("q") || "";
  const serverName = url.searchParams.get("server");
  console.log({ url, searchQuery, serverName });

  // Get API token from environment variable or server-side session
  const apiToken = process.env.SMITHERY_API_TOKEN;

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
        queryParams.set("q", searchQuery);
      }

      const response = await fetch(
        `https://registry.smithery.ai/servers?${queryParams}`,
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
