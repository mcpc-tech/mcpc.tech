import { Link } from "@heroui/link";
import { Navbar } from "~/components/navbar";
import { ReactNode } from "react";
import { getNavigation } from "~/lib/docs-config";

interface DocsLayoutProps {
  children: ReactNode;
  title?: string;
}

export const DocsLayout = ({ children, title }: DocsLayoutProps) => {
  const navigationSections = getNavigation();

  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col border-r border-divider bg-content1">
          <div className="flex-1 overflow-auto p-6">
            <nav className="space-y-6">
              {navigationSections.map((section) => (
                <div key={section.section}>
                  <h3 className="mb-2 text-sm font-semibold text-foreground-600 uppercase tracking-wide">
                    {section.section}
                  </h3>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.path}>
                        <Link
                          href={`/docs${item.path === "/" ? "" : item.path}`}
                          className="block py-1 text-sm text-foreground-700 hover:text-primary transition-colors"
                        >
                          {item.title}
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
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};