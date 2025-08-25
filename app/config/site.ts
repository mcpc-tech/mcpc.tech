export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "MCP Compose",
  description: "Create your agentic MCP server with a single prompt. Powered by the composition of thousands of MCPs.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Documentation",
      href: "/docs",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Documentation",
      href: "/docs",
    },
    {
      label: "GitHub",
      href: "https://github.com/mcpc-tech/mcpc",
    },
  ],
  links: {
    github: "https://github.com/mcpc-tech/mcpc",
    x: "https://x.com/mcpctech",
  },
};
