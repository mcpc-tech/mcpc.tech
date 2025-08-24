import { type MetaFunction } from "react-router";
import { DocsLayout } from "~/components/docs-layout";
import { Code, Card, CardBody } from "@heroui/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Basic Examples - MCPC Documentation" },
    {
      name: "description",
      content: "Learn MCPC with practical examples. From simple file operations to complex multi-tool compositions.",
    },
  ];
};

export default function DocsExamplesBasic() {
  return (
    <DocsLayout title="Basic Examples">
      <div className="space-y-8">
        <p className="text-lg text-foreground-600">
          These examples demonstrate common MCPC patterns and use cases. Each example includes the complete configuration and explanation.
        </p>

        {/* Example 1: File Manager */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. File Manager Server</h2>
          <p className="mb-4 text-foreground-600">
            A simple server that can read, write, and manage files in a specific directory.
          </p>
          
          <Card className="mb-4">
            <CardBody>
              <h3 className="font-semibold mb-2">Configuration</h3>
              <div className="bg-content2 rounded-lg p-4">
                <pre className="text-sm overflow-x-auto">
                  <code>{`[
  {
    "name": "file-manager",
    "description": "Manage files and directories with read, write, and search capabilities",
    "deps": {
      "mcpServers": {
        "@modelcontextprotocol/server-filesystem": {
          "command": "npx",
          "args": ["-y", "@modelcontextprotocol/server-filesystem", "/home/user/documents"],
          "env": {}
        }
      }
    }
  }
]`}</code>
                </pre>
              </div>
            </CardBody>
          </Card>

          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
            <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">💡 Use Cases</h4>
            <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>Document management and organization</li>
              <li>Code file manipulation and analysis</li>
              <li>Backup and sync operations</li>
              <li>Content search and indexing</li>
            </ul>
          </div>

          <h4 className="font-semibold mb-2">Running the Server</h4>
          <div className="bg-content2 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`export MCPC_CONFIG='[{"name":"file-manager","description":"Manage files and directories","deps":{"mcpServers":{"@modelcontextprotocol/server-filesystem":{"command":"npx","args":["-y","@modelcontextprotocol/server-filesystem","/home/user/documents"],"env":{}}}}}]'

npx -y deno run --allow-all jsr:@mcpc/core/bin`}</code>
            </pre>
          </div>
        </section>

        {/* Example 2: GitHub Assistant */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">2. GitHub Assistant</h2>
          <p className="mb-4 text-foreground-600">
            A server that can interact with GitHub repositories, search code, create issues, and manage pull requests.
          </p>
          
          <Card className="mb-4">
            <CardBody>
              <h3 className="font-semibold mb-2">Configuration</h3>
              <div className="bg-content2 rounded-lg p-4">
                <pre className="text-sm overflow-x-auto">
                  <code>{`[
  {
    "name": "github-assistant",
    "description": "Comprehensive GitHub operations including repository management, issue tracking, and code search",
    "deps": {
      "mcpServers": {
        "@smithery_ai/github": {
          "command": "npx",
          "args": ["-y", "@smithery_ai/github"],
          "env": {
            "GITHUB_TOKEN": "ghp_your_personal_access_token_here"
          }
        }
      }
    }
  }
]`}</code>
                </pre>
              </div>
            </CardBody>
          </Card>

          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
            <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200">🔑 Setup Required</h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              You'll need a GitHub Personal Access Token with appropriate permissions. 
              Generate one at <Code size="sm">github.com/settings/tokens</Code>
            </p>
          </div>

          <h4 className="font-semibold mb-2">Available Tools</h4>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-content2 rounded-lg p-3">
              <h5 className="font-medium mb-1">Repository Operations</h5>
              <ul className="text-sm text-foreground-600 space-y-1">
                <li>• Search repositories</li>
                <li>• Create new repositories</li>
                <li>• Fork repositories</li>
                <li>• Get repository contents</li>
              </ul>
            </div>
            <div className="bg-content2 rounded-lg p-3">
              <h5 className="font-medium mb-1">Issue & PR Management</h5>
              <ul className="text-sm text-foreground-600 space-y-1">
                <li>• Create and update issues</li>
                <li>• Create pull requests</li>
                <li>• Manage branches</li>
                <li>• Push files and commits</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Example 3: Web Scraper */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Web Scraping Server</h2>
          <p className="mb-4 text-foreground-600">
            A server that can browse websites, take screenshots, and extract information using a cloud browser.
          </p>
          
          <Card className="mb-4">
            <CardBody>
              <h3 className="font-semibold mb-2">Configuration</h3>
              <div className="bg-content2 rounded-lg p-4">
                <pre className="text-sm overflow-x-auto">
                  <code>{`[
  {
    "name": "web-scraper",
    "description": "Browse websites, take screenshots, and extract content using cloud browsers",
    "deps": {
      "mcpServers": {
        "@browserbasehq/mcp_browserbase": {
          "command": "npx",
          "args": ["-y", "@browserbasehq/mcp_browserbase"],
          "env": {
            "BROWSERBASE_API_KEY": "your-browserbase-api-key",
            "BROWSERBASE_PROJECT_ID": "your-project-id"
          }
        }
      }
    }
  }
]`}</code>
                </pre>
              </div>
            </CardBody>
          </Card>

          <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
            <h4 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">⚠️ External Service</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              This example requires a Browserbase account and API key. 
              Sign up at <Code size="sm">browserbase.com</Code> for cloud browser access.
            </p>
          </div>
        </section>

        {/* Example 4: Development Environment */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Development Environment</h2>
          <p className="mb-4 text-foreground-600">
            A comprehensive development server combining file operations, GitHub integration, and command execution.
          </p>
          
          <Card className="mb-4">
            <CardBody>
              <h3 className="font-semibold mb-2">Configuration</h3>
              <div className="bg-content2 rounded-lg p-4">
                <pre className="text-sm overflow-x-auto">
                  <code>{`[
  {
    "name": "dev-environment",
    "description": "Complete development environment with file management, GitHub integration, and terminal access",
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
            "ALLOWED_COMMANDS": "git,npm,yarn,node,python,pip"
          }
        }
      }
    }
  }
]`}</code>
                </pre>
              </div>
            </CardBody>
          </Card>

          <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-4">
            <h4 className="font-semibold mb-2 text-purple-800 dark:text-purple-200">🚀 Power User Setup</h4>
            <p className="text-sm text-purple-700 dark:text-purple-300 mb-2">
              This configuration creates a powerful development assistant that can:
            </p>
            <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
              <li>• Manage project files and directories</li>
              <li>• Execute git commands and manage repositories</li>
              <li>• Install dependencies and run build scripts</li>
              <li>• Create GitHub issues and pull requests</li>
              <li>• Search code across repositories</li>
            </ul>
          </div>
        </section>

        {/* Example 5: Data Analysis */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Data Analysis Server</h2>
          <p className="mb-4 text-foreground-600">
            A server that can process files and provide intelligent analysis using sequential thinking.
          </p>
          
          <Card className="mb-4">
            <CardBody>
              <h3 className="font-semibold mb-2">Configuration</h3>
              <div className="bg-content2 rounded-lg p-4">
                <pre className="text-sm overflow-x-auto">
                  <code>{`[
  {
    "name": "data-analyst",
    "description": "Analyze data files and provide insights using sequential thinking patterns",
    "deps": {
      "mcpServers": {
        "@modelcontextprotocol/server-filesystem": {
          "command": "npx",
          "args": ["-y", "@modelcontextprotocol/server-filesystem", "/data"],
          "env": {}
        },
        "@smithery/sequential-thinking": {
          "command": "npx",
          "args": ["-y", "@smithery/sequential-thinking"],
          "env": {}
        }
      }
    }
  }
]`}</code>
                </pre>
              </div>
            </CardBody>
          </Card>

          <h4 className="font-semibold mb-2">Example Usage</h4>
          <div className="bg-content2 rounded-lg p-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`# Read a CSV file and analyze patterns
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "filesystem_read_file",
    "arguments": {
      "path": "/data/sales.csv"
    }
  }
}

# Use sequential thinking to analyze the data
{
  "jsonrpc": "2.0", 
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "sequentialthinking",
    "arguments": {
      "prompt": "Analyze this sales data and identify trends, patterns, and key insights",
      "context": "CSV data from previous call"
    }
  }
}`}</code>
            </pre>
          </div>
        </section>

        {/* Tips Section */}
        <section className="border-t border-divider pt-8">
          <h2 className="text-2xl font-semibold mb-4">Tips for Success</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">🔧 Configuration Tips</h3>
              <ul className="space-y-2 text-foreground-600">
                <li>• Start with single-server configurations</li>
                <li>• Test each server independently first</li>
                <li>• Use environment variables for sensitive data</li>
                <li>• Keep descriptions clear and specific</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">🐛 Debugging Tips</h3>
              <ul className="space-y-2 text-foreground-600">
                <li>• Set <Code size="sm">MCPC_LOG_LEVEL=debug</Code></li>
                <li>• Check server logs for connection issues</li>
                <li>• Verify API keys and permissions</li>
                <li>• Test tool calls individually</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}