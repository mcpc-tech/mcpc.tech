import { type MetaFunction } from "react-router";
import { DocsLayout } from "~/components/docs-layout";
import { Code } from "@heroui/react";

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
  return (
    <DocsLayout title="Configuration">
      <div className="space-y-8">
        <p className="text-lg text-foreground-600">
          MCPC provides flexible configuration options for server composition, deployment, and runtime behavior.
        </p>

        {/* Basic Configuration */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Basic Configuration Structure</h2>
          <p className="mb-4 text-foreground-600">
            MCPC configurations are defined as JSON arrays containing tool definitions:
          </p>
          
          <div className="bg-content2 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`[
  {
    "name": "string",              // Tool identifier (required)
    "description": "string",       // Human-readable description (required)
    "version": "1.0.0",           // Tool version (optional)
    "author": "string",           // Tool author (optional)
    "deps": {                     // Dependencies configuration (required)
      "mcpServers": {
        "server-name": {
          "command": "string",      // Executable command
          "args": ["string"],       // Command arguments
          "env": {                  // Environment variables
            "KEY": "value"
          },
          "timeout": 30000,         // Connection timeout (ms)
          "retries": 3,            // Connection retry attempts
          "stdio": true,           // Use stdio transport (default)
          "transport": "stdio"     // Transport type
        }
      }
    },
    "metadata": {                 // Additional metadata (optional)
      "tags": ["tag1", "tag2"],
      "category": "string",
      "documentation": "url"
    }
  }
]`}</code>
            </pre>
          </div>
        </section>

        {/* Server Configuration */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Server Configuration Options</h2>
          
          <h3 className="text-lg font-semibold mb-3">Standard MCP Server</h3>
          <div className="bg-content2 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`"@modelcontextprotocol/server-filesystem": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/workspace"],
  "env": {
    "NODE_ENV": "production",
    "DEBUG": "mcp:*"
  },
  "timeout": 10000,
  "retries": 2
}`}</code>
            </pre>
          </div>

          <h3 className="text-lg font-semibold mb-3">Custom Server Configuration</h3>
          <div className="bg-content2 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`"my-custom-server": {
  "command": "python",
  "args": ["-m", "my_mcp_server", "--config", "/etc/config.json"],
  "env": {
    "PYTHONPATH": "/usr/local/lib/python3.9/site-packages",
    "LOG_LEVEL": "INFO"
  },
  "cwd": "/app",
  "timeout": 30000
}`}</code>
            </pre>
          </div>

          <h3 className="text-lg font-semibold mb-3">HTTP/WebSocket Server</h3>
          <div className="bg-content2 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`"remote-server": {
  "transport": "http",
  "url": "https://api.example.com/mcp",
  "headers": {
    "Authorization": "Bearer token",
    "Content-Type": "application/json"
  },
  "timeout": 5000
}`}</code>
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
                Main configuration as JSON string. Can be file path or inline JSON.
              </p>
              <div className="bg-content2 rounded-lg p-3">
                <Code size="sm">{`MCPC_CONFIG='[{"name":"tool","description":"desc","deps":{}}]'`}</Code>
              </div>
              <div className="bg-content2 rounded-lg p-3 mt-2">
                <Code size="sm">MCPC_CONFIG=/path/to/config.json</Code>
              </div>
            </div>

            <div className="border border-divider rounded-lg p-4">
              <h3 className="font-semibold mb-2">
                <Code>MCPC_LOG_LEVEL</Code>
              </h3>
              <p className="text-foreground-600 mb-2">
                Controls logging verbosity. Options: <Code>error</Code>, <Code>warn</Code>, <Code>info</Code>, <Code>debug</Code>
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
                Global timeout for server operations in milliseconds.
              </p>
              <div className="bg-content2 rounded-lg p-3">
                <Code size="sm">MCPC_TIMEOUT=60000</Code>
              </div>
            </div>

            <div className="border border-divider rounded-lg p-4">
              <h3 className="font-semibold mb-2">
                <Code>MCPC_MAX_RETRIES</Code>
              </h3>
              <p className="text-foreground-600 mb-2">
                Maximum number of retry attempts for failed server connections.
              </p>
              <div className="bg-content2 rounded-lg p-3">
                <Code size="sm">MCPC_MAX_RETRIES=3</Code>
              </div>
            </div>

            <div className="border border-divider rounded-lg p-4">
              <h3 className="font-semibold mb-2">
                <Code>MCPC_CACHE_DIR</Code>
              </h3>
              <p className="text-foreground-600 mb-2">
                Directory for caching server metadata and tool schemas.
              </p>
              <div className="bg-content2 rounded-lg p-3">
                <Code size="sm">MCPC_CACHE_DIR=/tmp/mcpc-cache</Code>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Features */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Advanced Configuration</h2>
          
          <h3 className="text-lg font-semibold mb-3">Tool Filtering and Mapping</h3>
          <div className="bg-content2 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`{
  "name": "filtered-tools",
  "description": "Server with selective tool exposure",
  "deps": {
    "mcpServers": {
      "@smithery_ai/github": {
        "command": "npx",
        "args": ["-y", "@smithery_ai/github"],
        "env": { "GITHUB_TOKEN": "token" },
        "toolFilter": {
          "include": ["search_repositories", "create_issue"],
          "exclude": ["delete_repository"]
        },
        "toolMapping": {
          "search_repositories": "github_search",
          "create_issue": "github_create_issue"
        }
      }
    }
  }
}`}</code>
            </pre>
          </div>

          <h3 className="text-lg font-semibold mb-3">Resource Limits</h3>
          <div className="bg-content2 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`{
  "name": "resource-limited",
  "description": "Server with resource constraints",
  "deps": {
    "mcpServers": {
      "heavy-server": {
        "command": "node",
        "args": ["server.js"],
        "limits": {
          "memory": "512MB",
          "cpu": "50%",
          "timeout": 30000,
          "maxConcurrentCalls": 5
        }
      }
    }
  }
}`}</code>
            </pre>
          </div>

          <h3 className="text-lg font-semibold mb-3">Health Checks</h3>
          <div className="bg-content2 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`{
  "name": "monitored-server",
  "description": "Server with health monitoring",
  "deps": {
    "mcpServers": {
      "api-server": {
        "command": "python",
        "args": ["-m", "api_server"],
        "healthCheck": {
          "enabled": true,
          "interval": 30000,
          "timeout": 5000,
          "retries": 3,
          "method": "ping"
        }
      }
    }
  }
}`}</code>
            </pre>
          </div>
        </section>

        {/* Configuration Files */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Configuration Files</h2>
          
          <h3 className="text-lg font-semibold mb-3">JSON Configuration</h3>
          <p className="mb-3 text-foreground-600">
            Store configuration in a <Code>mcpc.config.json</Code> file:
          </p>
          <div className="bg-content2 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`{
  "version": "1.0",
  "tools": [
    {
      "name": "dev-assistant",
      "description": "Development helper tools",
      "deps": {
        "mcpServers": {
          "@modelcontextprotocol/server-filesystem": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-filesystem", "$\\{WORKSPACE_DIR}"]
          }
        }
      }
    }
  ],
  "globals": {
    "timeout": 30000,
    "retries": 3,
    "logLevel": "info"
  }
}`}</code>
            </pre>
          </div>

          <h3 className="text-lg font-semibold mb-3">Environment File (.env)</h3>
          <div className="bg-content2 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`# MCPC Configuration
MCPC_CONFIG=./mcpc.config.json
MCPC_LOG_LEVEL=info
MCPC_TIMEOUT=30000

# Server Environment Variables
GITHUB_TOKEN=ghp_your_token_here
WORKSPACE_DIR=/workspace
NODE_ENV=production`}</code>
            </pre>
          </div>
        </section>

        {/* Deployment */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Deployment Configuration</h2>
          
          <h3 className="text-lg font-semibold mb-3">Docker Deployment</h3>
          <div className="bg-content2 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY mcpc.config.json ./
ENV MCPC_CONFIG=/app/mcpc.config.json

EXPOSE 3000
CMD ["npx", "-y", "deno", "run", "--allow-all", "jsr:@mcpc/core/bin"]`}</code>
            </pre>
          </div>

          <h3 className="text-lg font-semibold mb-3">Kubernetes Configuration</h3>
          <div className="bg-content2 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`apiVersion: apps/v1
kind: Deployment
metadata:
  name: mcpc-server
spec:
  replicas: 3
  selector:
    matchLabels:
      app: mcpc-server
  template:
    metadata:
      labels:
        app: mcpc-server
    spec:
      containers:
      - name: mcpc
        image: mcpc/server:latest
        env:
        - name: MCPC_CONFIG
          valueFrom:
            configMapKeyRef:
              name: mcpc-config
              key: config.json
        - name: MCPC_LOG_LEVEL
          value: "info"
        resources:
          limits:
            memory: "512Mi"
            cpu: "500m"
          requests:
            memory: "256Mi"
            cpu: "250m"`}</code>
            </pre>
          </div>
        </section>

        {/* Best Practices */}
        <section className="border-t border-divider pt-8">
          <h2 className="text-2xl font-semibold mb-4">Configuration Best Practices</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">🔒 Security</h3>
              <ul className="space-y-2 text-foreground-600">
                <li>• Store secrets in environment variables</li>
                <li>• Use file paths for large configurations</li>
                <li>• Validate server certificates in production</li>
                <li>• Limit server resource usage</li>
                <li>• Enable health checks for critical servers</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">⚡ Performance</h3>
              <ul className="space-y-2 text-foreground-600">
                <li>• Set appropriate timeouts for each server</li>
                <li>• Use caching for frequently accessed data</li>
                <li>• Monitor server resource usage</li>
                <li>• Configure connection pooling</li>
                <li>• Implement graceful degradation</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">🔧 Maintenance</h3>
              <ul className="space-y-2 text-foreground-600">
                <li>• Version your configuration files</li>
                <li>• Document server dependencies</li>
                <li>• Use consistent naming conventions</li>
                <li>• Test configurations in staging first</li>
                <li>• Monitor server health and performance</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">📊 Monitoring</h3>
              <ul className="space-y-2 text-foreground-600">
                <li>• Enable structured logging</li>
                <li>• Set up alerting for server failures</li>
                <li>• Track tool usage and performance</li>
                <li>• Monitor resource consumption</li>
                <li>• Collect metrics for optimization</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}