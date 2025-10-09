import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { LinksFunction, MetaFunction } from "react-router";

import "./tailwind.css";
import React from "react";

export const links: LinksFunction = () => [];

// Global fallback meta tags for SEO
export const meta: MetaFunction = () => {
  return [
    { title: "MCPC - Build Agentic MCP Servers" },
    {
      name: "description",
      content:
        "The SDK for building agentic MCP (Model Context Protocol) Servers. Create powerful tools, fine-tune existing ones, and build multi-agent systems.",
    },
    { charSet: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "theme-color", content: "#ffffff" },
  ];
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
