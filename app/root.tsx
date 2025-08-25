import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { LinksFunction } from "react-router";
import { HeroUIProvider } from "@heroui/react";

import "./tailwind.css";
import React from "react";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css",
    integrity: "sha384-5TPbERKFCq9kJZeKLNgTi+4sYd8lnzAv7jj0Pk0Xh1bYPPjO8DgtJ6ZcfLO6qBNb",
    crossOrigin: "anonymous"
  }
];

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
        <HeroUIProvider>
          {children}
        </HeroUIProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
