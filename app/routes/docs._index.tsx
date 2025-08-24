import { type MetaFunction } from "react-router";
import { DocsLayout } from "~/components/docs-layout";
import { Button } from "@heroui/react";
import { Link } from "@heroui/link";

export const meta: MetaFunction = () => {
  return [
    { title: "MCPC Documentation - MCP Compose SDK" },
    {
      name: "description",
      content: "Learn how to create agentic MCP servers with MCPC. Complete API reference, examples, and guides.",
    },
  ];
};

export default function DocsIndex() {
  return (
    <DocsLayout title="MCPC Documentation">
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center py-8 border-b border-divider">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Build Agentic MCP Servers with Ease
          </h2>
          <p className="text-lg text-foreground-600 mb-6 max-w-2xl mx-auto">
            MCPC (MCP Compose) allows you to create powerful agentic MCP servers through composition of thousands of MCPs from the Smithery registry.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              as={Link}
              href="/docs/quick-start"
              color="primary"
              size="lg"
            >
              Quick Start
            </Button>
            <Button
              as={Link}
              href="/docs/api/core"
              variant="bordered"
              size="lg"
            >
              API Reference
            </Button>
          </div>
        </div>

        {/* Key Features */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 border border-divider rounded-lg">
              <h3 className="text-lg font-semibold mb-3">🚀 Simple Composition</h3>
              <p className="text-foreground-600">
                Compose multiple MCP servers into a single agentic server using natural language descriptions.
              </p>
            </div>
            <div className="p-6 border border-divider rounded-lg">
              <h3 className="text-lg font-semibold mb-3">🔧 Extensive Tool Library</h3>
              <p className="text-foreground-600">
                Access thousands of pre-built MCP tools from the Smithery registry for instant functionality.
              </p>
            </div>
            <div className="p-6 border border-divider rounded-lg">
              <h3 className="text-lg font-semibold mb-3">⚡ Zero Setup</h3>
              <p className="text-foreground-600">
                No complex configuration required. Generate your server configuration with a single prompt.
              </p>
            </div>
            <div className="p-6 border border-divider rounded-lg">
              <h3 className="text-lg font-semibold mb-3">🔄 Hot Reload</h3>
              <p className="text-foreground-600">
                Dynamic server composition allows you to add or remove tools without server restarts.
              </p>
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Getting Started</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 border border-divider rounded-lg">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Installation</h3>
                <p className="text-foreground-600 mb-2">
                  Install MCPC using npm or run directly with npx
                </p>
                <Link href="/docs/installation" className="text-primary text-sm">
                  View installation guide →
                </Link>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border border-divider rounded-lg">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Create Your First Server</h3>
                <p className="text-foreground-600 mb-2">
                  Use the web interface or CLI to compose your MCP server
                </p>
                <Link href="/docs/quick-start" className="text-primary text-sm">
                  Quick start guide →
                </Link>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border border-divider rounded-lg">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Deploy & Share</h3>
                <p className="text-foreground-600 mb-2">
                  Deploy your server and share it with the community
                </p>
                <Link href="/docs/examples/basic" className="text-primary text-sm">
                  View examples →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Example */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Example Usage</h2>
          <div className="bg-content2 rounded-lg p-6">
            <pre className="text-sm overflow-x-auto">
              <code>{`{
  "mcpServers": {
    "my-agent": {
      "command": "npx",
      "args": ["-y", "deno", "run", "--allow-all", "jsr:@mcpc/core/bin"],
      "env": {
        "MCPC_CONFIG": "[{\\"name\\": \\"data-processor\\", \\"description\\": \\"Process CSV files and generate reports\\", \\"deps\\": {...}}]"
      }
    }
  }
}`}</code>
            </pre>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}