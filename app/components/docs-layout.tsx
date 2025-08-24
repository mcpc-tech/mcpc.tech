import { Link } from "@heroui/link";
import { Navbar } from "~/components/navbar";
import { ReactNode } from "react";

interface DocsLayoutProps {
  children: ReactNode;
  title?: string;
}

const docsSidebarItems = [
  {
    title: "Getting Started",
    items: [
      { label: "Overview", href: "/docs" },
      { label: "Installation", href: "/docs/installation" },
      { label: "Quick Start", href: "/docs/quick-start" },
    ],
  },
  {
    title: "API Reference",
    items: [
      { label: "Core API", href: "/docs/api/core" },
      { label: "Configuration", href: "/docs/api/configuration" },
      { label: "Tools", href: "/docs/api/tools" },
    ],
  },
  {
    title: "Examples",
    items: [
      { label: "Basic Usage", href: "/docs/examples/basic" },
      { label: "Advanced Patterns", href: "/docs/examples/advanced" },
    ],
  },
];

export const DocsLayout = ({ children, title }: DocsLayoutProps) => {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col border-r border-divider bg-content1">
          <div className="flex-1 overflow-auto p-6">
            <nav className="space-y-6">
              {docsSidebarItems.map((section) => (
                <div key={section.title}>
                  <h3 className="mb-2 text-sm font-semibold text-foreground-600 uppercase tracking-wide">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="block py-1 text-sm text-foreground-700 hover:text-primary transition-colors"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-6 md:p-8">
            {title && (
              <header className="mb-8">
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  {title}
                </h1>
              </header>
            )}
            <div className="prose prose-slate dark:prose-invert max-w-none">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};