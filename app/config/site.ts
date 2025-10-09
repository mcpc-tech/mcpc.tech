export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "MCPC - Build Agentic MCP Servers",
  description: "The SDK for building agentic MCP (Model Context Protocol) Servers. Create powerful tools, fine-tune existing ones, and build multi-agent systems.",
  url: "https://mcpc.tech",
  ogImage: "https://mcpc.tech/og-image.png",
  navItems: [] as { label: string; href: string }[],
  mainNav: [] as { label: string; href: string }[],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
  ],
  links: {
    github: "https://github.com/mcpc-tech/mcpc",
    x: "https://x.com/mcpctech",
  },
};
