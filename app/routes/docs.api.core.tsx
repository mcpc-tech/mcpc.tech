import { type MetaFunction } from "react-router";
import { DocsLayout } from "~/components/docs-layout";
import { Code } from "@heroui/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Core API - MCPC Documentation" },
    {
      name: "description",
      content: "Complete API reference for MCPC core functionality and server composition.",
    },
  ];
};

export default function DocsApiCore() {
  return (
    <DocsLayout title="Core API">
      <div className="space-y-8">
        <p className="text-lg text-foreground-600">
          MCPC provides a simple yet powerful API for composing MCP servers. This guide covers the core concepts and API methods.
        </p>

        {/* Configuration Format */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Configuration Format</h2>
          <p className="mb-4 text-foreground-600">
            MCPC uses a JSON configuration format to define server composition:
          </p>
          
          <div className="bg-content2 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`[
  {
    "name": "string",           // Tool name (required)
    "description": "string",    // Tool description (required)
    "deps": {                  // Dependencies configuration
      "mcpServers": {
        "server-name": {
          "command": "string",   // Command to run
          "args": ["string"],    // Command arguments
          "env": {               // Environment variables
            "KEY": "value"
          }
        }
      }
    }
  }
]`}</code>
            </pre>
          </div>
        </section>

        {/* Environment Variables */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-4">
            <div className="border border-divider rounded-lg p-4">
              <h3 className="font-semibold mb-2">
                <Code>MCPC_CONFIG</Code>
              </h3>
              <p className="text-foreground-600 mb-2">
                JSON string containing the server configuration. Required when running MCPC.
              </p>
              <div className="bg-content2 rounded-lg p-3">
                <Code size="sm">
                  {`MCPC_CONFIG='[{"name":"tool","description":"desc","deps":{}}]'`}
                </Code>
              </div>
            </div>

            <div className="border border-divider rounded-lg p-4">
              <h3 className="font-semibold mb-2">
                <Code>MCPC_LOG_LEVEL</Code>
              </h3>
              <p className="text-foreground-600 mb-2">
                Set logging level. Options: <Code>debug</Code>, <Code>info</Code>, <Code>warn</Code>, <Code>error</Code>
              </p>
              <div className="bg-content2 rounded-lg p-3">
                <Code size="sm">MCPC_LOG_LEVEL=debug</Code>
              </div>
            </div>

            <div className="border border-divider rounded-lg p-4">
              <h3 className="font-semibold mb-2">
                <Code>MCPC_TIMEOUT</Code>
              </h3>
              <p className="text-foreground-600 mb-2">
                Timeout for tool calls in milliseconds (default: 30000)
              </p>
              <div className="bg-content2 rounded-lg p-3">
                <Code size="sm">MCPC_TIMEOUT=60000</Code>
              </div>
            </div>
          </div>
        </section>

        {/* Server Dependencies */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Server Dependencies</h2>
          <p className="mb-4 text-foreground-600">
            The <Code>deps</Code> section defines which MCP servers your composed server depends on:
          </p>

          <h3 className="text-lg font-semibold mb-3">Standard MCP Server</h3>
          <div className="bg-content2 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`"deps": {
  "mcpServers": {
    "@modelcontextprotocol/server-filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/directory"],
      "env": {
        "OPTIONAL_ENV_VAR": "value"
      }
    }
  }
}`}</code>
            </pre>
          </div>

          <h3 className="text-lg font-semibold mb-3">Smithery Registry Server</h3>
          <div className="bg-content2 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`"deps": {
  "mcpServers": {
    "@smithery_ai/github": {
      "command": "npx",
      "args": ["-y", "@smithery_ai/github"],
      "env": {
        "GITHUB_TOKEN": "your-token-here"
      }
    }
  }
}`}</code>
            </pre>
          </div>

          <h3 className="text-lg font-semibold mb-3">Custom Server</h3>
          <div className="bg-content2 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`"deps": {
  "mcpServers": {
    "my-custom-server": {
      "command": "node",
      "args": ["./my-server.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}`}</code>
            </pre>
          </div>
        </section>

        {/* Tool Resolution */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Tool Resolution</h2>
          <p className="mb-4 text-foreground-600">
            MCPC automatically discovers and exposes tools from all configured MCP servers. Tools are called using the MCP protocol.
          </p>

          <h3 className="text-lg font-semibold mb-3">Available Tools</h3>
          <p className="mb-3 text-foreground-600">
            List all available tools:
          </p>
          <div className="bg-content2 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list"
}`}</code>
            </pre>
          </div>

          <h3 className="text-lg font-semibold mb-3">Call a Tool</h3>
          <div className="bg-content2 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "filesystem_read_file",
    "arguments": {
      "path": "/path/to/file.txt"
    }
  }
}`}</code>
            </pre>
          </div>
        </section>

        {/* Error Handling */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Error Handling</h2>
          <p className="mb-4 text-foreground-600">
            MCPC provides structured error responses following the JSON-RPC 2.0 specification:
          </p>

          <h3 className="text-lg font-semibold mb-3">Configuration Errors</h3>
          <div className="bg-content2 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`{
  "jsonrpc": "2.0",
  "id": null,
  "error": {
    "code": -32603,
    "message": "Invalid configuration",
    "data": {
      "details": "Missing required field: name"
    }
  }
}`}</code>
            </pre>
          </div>

          <h3 className="text-lg font-semibold mb-3">Tool Call Errors</h3>
          <div className="bg-content2 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`{
  "jsonrpc": "2.0",
  "id": 2,
  "error": {
    "code": -32601,
    "message": "Tool not found",
    "data": {
      "tool": "nonexistent_tool"
    }
  }
}`}</code>
            </pre>
          </div>

          <h3 className="text-lg font-semibold mb-3">Server Connection Errors</h3>
          <div className="bg-content2 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`{
  "jsonrpc": "2.0",
  "id": 3,
  "error": {
    "code": -32603,
    "message": "Server connection failed",
    "data": {
      "server": "@smithery_ai/github",
      "reason": "Process exited with code 1"
    }
  }
}`}</code>
            </pre>
          </div>
        </section>

        {/* Advanced Features */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Advanced Features</h2>
          
          <h3 className="text-lg font-semibold mb-3">Server Health Checks</h3>
          <p className="mb-3 text-foreground-600">
            MCPC automatically monitors the health of connected servers:
          </p>
          <div className="bg-content2 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "health/check"
}`}</code>
            </pre>
          </div>

          <h3 className="text-lg font-semibold mb-3">Dynamic Server Management</h3>
          <p className="mb-3 text-foreground-600">
            Add or remove servers at runtime (enterprise feature):
          </p>
          <div className="bg-content2 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`{
  "jsonrpc": "2.0",
  "id": 5,
  "method": "servers/add",
  "params": {
    "name": "new-server",
    "config": {
      "command": "npx",
      "args": ["-y", "@new/server"]
    }
  }
}`}</code>
            </pre>
          </div>

          <h3 className="text-lg font-semibold mb-3">Tool Metadata</h3>
          <p className="mb-3 text-foreground-600">
            Get detailed information about available tools:
          </p>
          <div className="bg-content2 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`{
  "jsonrpc": "2.0",
  "id": 6,
  "method": "tools/describe",
  "params": {
    "name": "filesystem_read_file"
  }
}`}</code>
            </pre>
          </div>
        </section>

        {/* Examples */}
        <section className="border-t border-divider pt-8">
          <h2 className="text-2xl font-semibold mb-4">Complete Example</h2>
          <p className="mb-4 text-foreground-600">
            Here's a complete configuration for a multi-purpose development assistant:
          </p>
          <div className="bg-content2 rounded-lg p-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`[
  {
    "name": "dev-assistant",
    "description": "A comprehensive development assistant that can manage files, GitHub repositories, and execute commands",
    "deps": {
      "mcpServers": {
        "@modelcontextprotocol/server-filesystem": {
          "command": "npx",
          "args": ["-y", "@modelcontextprotocol/server-filesystem", "/workspace"],
          "env": {}
        },
        "@smithery_ai/github": {
          "command": "npx",
          "args": ["-y", "@smithery_ai/github"],
          "env": {
            "GITHUB_TOKEN": "ghp_your_token_here"
          }
        },
        "@wonderwhy_er/desktop_commander": {
          "command": "npx",
          "args": ["-y", "@wonderwhy_er/desktop_commander"],
          "env": {
            "ALLOWED_COMMANDS": "git,npm,yarn,node"
          }
        }
      }
    }
  }
]`}</code>
            </pre>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}