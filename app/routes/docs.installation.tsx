import { type MetaFunction } from "react-router";
import { DocsLayout } from "~/components/docs-layout";
import { Code } from "@heroui/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Installation - MCPC Documentation" },
    {
      name: "description",
      content: "Learn how to install and set up MCPC (MCP Compose) for creating agentic MCP servers.",
    },
  ];
};

export default function DocsInstallation() {
  return (
    <DocsLayout title="Installation">
      <div className="space-y-8">
        <p className="text-lg text-foreground-600">
          MCPC can be used in multiple ways - through the web interface, as a CLI tool, or as a library in your Node.js projects.
        </p>

        {/* Web Interface */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Web Interface (Recommended)</h2>
          <p className="mb-4">
            The easiest way to get started is through our web interface at{" "}
            <Code>mcpc.tech</Code>. No installation required!
          </p>
          <ol className="list-decimal list-inside space-y-2 text-foreground-600">
            <li>Visit <Code>https://mcpc.tech</Code></li>
            <li>Describe what you want your MCP server to do</li>
            <li>Select tools from the Smithery registry</li>
            <li>Copy the generated configuration</li>
          </ol>
        </section>

        {/* NPX Usage */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Direct Execution with npx</h2>
          <p className="mb-4">
            Run MCPC directly without installation using npx:
          </p>
          <div className="bg-content2 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
              <code>npx -y deno run --allow-all jsr:@mcpc/core/bin</code>
            </pre>
          </div>
          <p className="text-sm text-foreground-600">
            This method requires no local installation and always uses the latest version.
          </p>
        </section>

        {/* Global Installation */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Global Installation</h2>
          <p className="mb-4">
            Install MCPC globally to use it from anywhere:
          </p>
          <div className="bg-content2 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`# Install Deno (if not already installed)
curl -fsSL https://deno.land/install.sh | sh

# Or with npm
npm install -g @mcpc/cli

# Verify installation
mcpc --version`}</code>
            </pre>
          </div>
        </section>

        {/* Project Installation */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Project Installation</h2>
          <p className="mb-4">
            Add MCPC as a dependency in your Node.js project:
          </p>
          <div className="bg-content2 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`# npm
npm install @mcpc/core

# yarn
yarn add @mcpc/core

# pnpm
pnpm add @mcpc/core`}</code>
            </pre>
          </div>
        </section>

        {/* Requirements */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Requirements</h2>
          <div className="bg-content2 rounded-lg p-6">
            <h3 className="font-semibold mb-3">System Requirements</h3>
            <ul className="list-disc list-inside space-y-1 text-foreground-600">
              <li>Node.js 18+ or Deno 1.40+</li>
              <li>Internet connection (for accessing Smithery registry)</li>
              <li>Memory: 512MB+ recommended</li>
            </ul>

            <h3 className="font-semibold mb-3 mt-6">Supported Platforms</h3>
            <ul className="list-disc list-inside space-y-1 text-foreground-600">
              <li>Windows 10/11</li>
              <li>macOS 10.15+</li>
              <li>Linux (Ubuntu 18.04+, other distributions)</li>
              <li>Docker containers</li>
            </ul>
          </div>
        </section>

        {/* Docker */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Docker Usage</h2>
          <p className="mb-4">
            Run MCPC in a Docker container:
          </p>
          <div className="bg-content2 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`# Pull the image
docker pull mcpc/core:latest

# Run with configuration
docker run -e MCPC_CONFIG='[{"name":"my-tool","description":"...","deps":{}}]' mcpc/core:latest

# Or mount a config file
docker run -v /path/to/config.json:/app/config.json mcpc/core:latest`}</code>
            </pre>
          </div>
        </section>

        {/* Verification */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Verify Installation</h2>
          <p className="mb-4">
            Test your installation by creating a simple server:
          </p>
          <div className="bg-content2 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`# Test the installation
export MCPC_CONFIG='[{"name":"hello","description":"A simple hello world tool","deps":{}}]'
npx -y deno run --allow-all jsr:@mcpc/core/bin

# You should see:
# MCPC Server starting...
# Server ready on stdio`}</code>
            </pre>
          </div>
        </section>

        {/* Next Steps */}
        <section className="border-t border-divider pt-8">
          <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
          <p className="mb-4">
            Now that you have MCPC installed, you can:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground-600">
            <li>
              <a href="/docs/quick-start" className="text-primary hover:underline">
                Follow the Quick Start guide
              </a>
            </li>
            <li>
              <a href="/docs/examples/basic" className="text-primary hover:underline">
                Explore basic examples
              </a>
            </li>
            <li>
              <a href="/docs/api/core" className="text-primary hover:underline">
                Read the API documentation
              </a>
            </li>
          </ul>
        </section>
      </div>
    </DocsLayout>
  );
}