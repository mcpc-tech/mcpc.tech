import { type MetaFunction } from "react-router";
import { DocsLayout } from "~/components/docs-layout";
import { Code, Button } from "@heroui/react";
import { Link } from "@heroui/link";

export const meta: MetaFunction = () => {
  return [
    { title: "Quick Start - MCPC Documentation" },
    {
      name: "description",
      content: "Get started with MCPC in minutes. Learn how to create your first agentic MCP server.",
    },
  ];
};

export default function DocsQuickStart() {
  return (
    <DocsLayout title="Quick Start">
      <div className="space-y-8">
        <p className="text-lg text-foreground-600">
          This guide will walk you through creating your first agentic MCP server using MCPC in under 5 minutes.
        </p>

        {/* Prerequisites */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Prerequisites</h2>
          <ul className="list-disc list-inside space-y-2 text-foreground-600">
            <li>Node.js 18+ installed on your system</li>
            <li>Basic familiarity with command line</li>
            <li>Internet connection for accessing the Smithery registry</li>
          </ul>
        </section>

        {/* Method 1: Web Interface */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Method 1: Using the Web Interface</h2>
          <p className="mb-4 text-foreground-600">
            The fastest way to get started is through our web interface:
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 border border-divider rounded-lg">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-2">Visit MCPC.tech</h3>
                <p className="text-foreground-600 mb-3">
                  Go to the homepage and describe what you want your MCP server to do.
                </p>
                <Button as={Link} href="/" color="primary" size="sm">
                  Open MCPC.tech
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border border-divider rounded-lg">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-2">Describe Your Server</h3>
                <p className="text-foreground-600 mb-3">
                  Type a description like: "Create a server that can search GitHub repositories and create issues"
                </p>
                <div className="bg-content2 rounded-lg p-3">
                  <Code size="sm">
                    "I want to build a server that can search GitHub repositories, read file contents, and create issues when needed"
                  </Code>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border border-divider rounded-lg">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-2">Select Tools</h3>
                <p className="text-foreground-600 mb-3">
                  Browse available MCP tools and select the ones you need. Type &quot;&gt;&quot; to search the Smithery registry.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border border-divider rounded-lg">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-2">Generate & Copy Configuration</h3>
                <p className="text-foreground-600">
                  Click "Generate Config" to create your MCP server configuration, then copy it to use in your project.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Method 2: Command Line */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Method 2: Command Line</h2>
          <p className="mb-4 text-foreground-600">
            For developers who prefer the command line:
          </p>

          <h3 className="text-lg font-semibold mb-3">Step 1: Create a Configuration</h3>
          <p className="mb-3 text-foreground-600">
            Create a configuration file describing your server:
          </p>
          <div className="bg-content2 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`# Create config.json
cat > config.json << EOF
[
  {
    "name": "github-helper",
    "description": "A server that helps with GitHub operations",
    "deps": {
      "mcpServers": {
        "@smithery_ai/github": {
          "command": "npx",
          "args": ["-y", "@smithery_ai/github"],
          "env": {
            "GITHUB_TOKEN": "your-github-token"
          }
        }
      }
    }
  }
]
EOF`}</code>
            </pre>
          </div>

          <h3 className="text-lg font-semibold mb-3">Step 2: Run Your Server</h3>
          <div className="bg-content2 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`# Set the configuration
export MCPC_CONFIG="$(cat config.json)"

# Run the server
npx -y deno run --allow-all jsr:@mcpc/core/bin`}</code>
            </pre>
          </div>

          <h3 className="text-lg font-semibold mb-3">Step 3: Test Your Server</h3>
          <div className="bg-content2 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`# In another terminal, test the server
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | npx -y deno run --allow-all jsr:@mcpc/core/bin`}</code>
            </pre>
          </div>
        </section>

        {/* Example: File Processor */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Example: File Processing Server</h2>
          <p className="mb-4 text-foreground-600">
            Let's create a practical example - a server that can read, process, and analyze files:
          </p>

          <div className="bg-content2 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`{
  "mcpServers": {
    "file-processor": {
      "command": "npx",
      "args": ["-y", "deno", "run", "--allow-all", "jsr:@mcpc/core/bin"],
      "env": {
        "MCPC_CONFIG": "[{\\"name\\": \\"file-analyzer\\", \\"description\\": \\"Read CSV files, analyze data patterns, and generate summaries\\", \\"deps\\": {\\"mcpServers\\": {\\"@modelcontextprotocol/server-filesystem\\": {\\"command\\": \\"npx\\", \\"args\\": [\\"-y\\", \\"@modelcontextprotocol/server-filesystem\\", \\"/path/to/data\\"]}}}}]"
      }
    }
  }
}`}</code>
            </pre>
          </div>

          <p className="text-foreground-600 mb-4">
            This configuration creates a server that can:
          </p>
          <ul className="list-disc list-inside space-y-1 text-foreground-600 mb-4">
            <li>Read files from the filesystem</li>
            <li>Analyze CSV data patterns</li>
            <li>Generate reports and summaries</li>
            <li>Work with structured data</li>
          </ul>
        </section>

        {/* Common Patterns */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Common Patterns</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 border border-divider rounded-lg">
              <h3 className="font-semibold mb-2">🌐 Web Scraping Server</h3>
              <p className="text-sm text-foreground-600 mb-3">
                Combine browserbase with filesystem tools for web scraping
              </p>
              <Code size="sm" className="text-xs">
                @browserbasehq/mcp_browserbase + @modelcontextprotocol/server-filesystem
              </Code>
            </div>

            <div className="p-4 border border-divider rounded-lg">
              <h3 className="font-semibold mb-2">📊 Data Analysis Server</h3>
              <p className="text-sm text-foreground-600 mb-3">
                Process and analyze data from multiple sources
              </p>
              <Code size="sm" className="text-xs">
                @modelcontextprotocol/server-filesystem + @smithery/sequential-thinking
              </Code>
            </div>

            <div className="p-4 border border-divider rounded-lg">
              <h3 className="font-semibold mb-2">🔧 DevOps Assistant</h3>
              <p className="text-sm text-foreground-600 mb-3">
                Manage GitHub repos and execute commands
              </p>
              <Code size="sm" className="text-xs">
                @smithery_ai/github + @wonderwhy_er/desktop_commander
              </Code>
            </div>

            <div className="p-4 border border-divider rounded-lg">
              <h3 className="font-semibold mb-2">🤖 AI Research Agent</h3>
              <p className="text-sm text-foreground-600 mb-3">
                Browse the web and analyze information
              </p>
              <Code size="sm" className="text-xs">
                @browserbasehq/mcp_browserbase + @smithery/sequential-thinking
              </Code>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="border-t border-divider pt-8">
          <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
          <p className="mb-4 text-foreground-600">
            Great! You've created your first MCPC server. Here's what to explore next:
          </p>
          <div className="space-y-3">
            <Link href="/docs/api/core" className="block text-primary hover:underline">
              → Explore the Core API documentation
            </Link>
            <Link href="/docs/examples/advanced" className="block text-primary hover:underline">
              → Check out advanced examples and patterns
            </Link>
            <Link href="/docs/api/configuration" className="block text-primary hover:underline">
              → Learn about advanced configuration options
            </Link>
            <Link href="https://github.com/mcpc-tech/mcpc" className="block text-primary hover:underline">
              → Contribute to the project on GitHub
            </Link>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}