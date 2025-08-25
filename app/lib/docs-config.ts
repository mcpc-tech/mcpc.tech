interface RouteConfig {
  path: string;
  title: string;
  description: string;
  file: string;
}

interface NavigationSection {
  section: string;
  items: Array<{
    path: string;
    title: string;
  }>;
}

interface DocsConfig {
  routes: RouteConfig[];
  navigation: NavigationSection[];
}

// Static configuration instead of reading from YAML file
const DOCS_CONFIG: DocsConfig = {
  routes: [
    {
      path: "/",
      title: "Overview",
      description: "Learn how to create agentic MCP servers with MCPC",
      file: "/docs/index.mdx"
    },
    {
      path: "/installation",
      title: "Installation", 
      description: "Install and set up MCPC in your project",
      file: "/docs/installation.mdx"
    },
    {
      path: "/quick-start",
      title: "Quick Start",
      description: "Get started with MCPC in minutes", 
      file: "/docs/quick-start.mdx"
    },
    {
      path: "/api/core",
      title: "Core API",
      description: "Core MCPC API reference",
      file: "/docs/api/core.mdx"
    },
    {
      path: "/api/configuration",
      title: "Configuration",
      description: "Configuration options and settings",
      file: "/docs/api/configuration.mdx"
    },
    {
      path: "/examples/basic",
      title: "Basic Examples",
      description: "Basic usage patterns and examples",
      file: "/docs/examples/basic.mdx"
    }
  ],
  navigation: [
    {
      section: "Getting Started",
      items: [
        { path: "/", title: "Overview" },
        { path: "/installation", title: "Installation" },
        { path: "/quick-start", title: "Quick Start" }
      ]
    },
    {
      section: "API Reference", 
      items: [
        { path: "/api/core", title: "Core API" },
        { path: "/api/configuration", title: "Configuration" }
      ]
    },
    {
      section: "Examples",
      items: [
        { path: "/examples/basic", title: "Basic Examples" }
      ]
    }
  ]
};

export function getDocsConfig(): DocsConfig {
  return DOCS_CONFIG;
}

export function getRouteByPath(routePath: string): RouteConfig | undefined {
  return DOCS_CONFIG.routes.find(route => route.path === routePath);
}

export function getNavigation(): NavigationSection[] {
  return DOCS_CONFIG.navigation;
}