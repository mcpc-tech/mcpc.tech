import { Link } from "@heroui/link";
import type { MetaFunction } from "react-router";
import { subtitle, title } from "components/primitives";
import { Navbar } from "components/navbar";
import {
  Button,
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { useRef, useEffect } from "react";
import { MCP_TOOLS } from "~/constants";

const mcpServers = Object.keys(MCP_TOOLS).map((key) => {
  return {
    id: key,
    name: key,
    description: key,
  };
});

export const meta: MetaFunction = () => {
  return [
    { title: "MCP Compose" },
    { name: "description", content: "MCP Compose" },
  ];
};

export function IndexLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-8xl pt-16 px-6 flex-grow">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://heroui.com/docs/guide/introduction"
          title="heroui.com homepage"
        >
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">HeroUI</p>
        </Link>
      </footer>
    </div>
  );
}

export default function Index() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [textareaRef]);

  return (
    <IndexLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          <span className={title()}>Create Your </span>
          <span className={title({ color: "violet" })}>
            Agentic MCP Server{" "}
          </span>
          <span className={title()}>with a Single Prompt.</span>
          <div className={subtitle({ class: "mt-4" })}>
            Powered by the composition of thousands of underlying MCPs, Try it
            out below.
          </div>
        </div>

        <Button className="mt-8" color="primary" variant="bordered">
          Create MCP
        </Button>
      </section>
    </IndexLayout>
  );
}
