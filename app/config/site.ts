export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "MCP Compose",
  description: "MCP Compose",
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
