/* eslint-disable react/prop-types */

import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import {
  useEditor,
  EditorContent,
  ReactRenderer,
  posToDOMRect,
} from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Mention } from "@tiptap/extension-mention";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { SuggestionProps, SuggestionKeyDownProps } from "@tiptap/suggestion";
import { computePosition, flip, shift } from "@floating-ui/dom";
import { ServerListResponse } from "~/routes/smithery";
import { Button } from "@heroui/react";

interface TiptapEditorProps {
  servers: ServerListResponse["servers"];
  fetcher: any;
  detailFetcher: any;
  onDescriptionChange: (desc: string) => void;
  onDepsChange: (deps: ServerListResponse["servers"]) => void;
}

interface ToolSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  servers: ServerListResponse["servers"];
  fetcher: any;
  detailFetcher: any;
  onSelect: (serverName: string, toolName: string) => void;
}

const SLASH_COMMANDS = ["tools"];

const cleanMentionId = (id: string) => id.replace(/^[@/]{1}/, "");

const ToolSelector = ({
  isOpen,
  onClose,
  servers,
  fetcher,
  detailFetcher,
  onSelect,
}: ToolSelectorProps) => {
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [isLoadingTools, setIsLoadingTools] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleServerClick = (serverName: string) => {
    setSelectedServer(serverName);
    setIsLoadingTools(true);
    detailFetcher.submit(
      { server: serverName },
      { action: "/smithery", method: "GET" }
    );
  };

  const handleClose = () => {
    setSelectedServer(null);
    onClose();
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value) {
      fetcher.submit({ q: value }, { action: "/smithery", method: "GET" });
    }
  };

  useEffect(() => {
    if (detailFetcher.data) {
      setIsLoadingTools(false);
    }
  }, [detailFetcher.data]);

  const tools = detailFetcher.data?.tools && detailFetcher.data.tools.length > 0
    ? detailFetcher.data.tools
    : [
        {
          name: "__ALL__",
          description: "No tools available - select this placeholder for now",
        },
      ];

  if (!isOpen) return null;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Close dialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleClose}
      onKeyDown={(e) => e.key === "Escape" && handleClose()}
    >
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className="bg-content1 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-default-200">
          <h2 className="text-xl font-semibold">
            {selectedServer
              ? `Select Tool from ${selectedServer}`
              : "Select Server"}
          </h2>
          {!selectedServer && (
            <input
              type="text"
              placeholder="Search servers..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="mt-3 w-full px-3 py-2 border border-default-300 rounded-lg bg-content2 focus:outline-none focus:border-primary"
            />
          )}
        </div>

        <div className="overflow-y-auto max-h-[calc(80vh-8rem)] p-4">
          {!selectedServer ? (
            <div className="grid gap-2">
              {servers.length > 0 ? (
                servers.map((server) => (
                  <Button
                    key={server.qualifiedName}
                    variant="flat"
                    className="justify-start h-auto py-4"
                    onClick={() => handleServerClick(server.qualifiedName)}
                  >
                    <div className="text-left w-full">
                      <div className="font-semibold">
                        {server.qualifiedName}
                      </div>
                      {server.description && (
                        <div className="text-xs text-default-500 mt-1">
                          {server.description}
                        </div>
                      )}
                    </div>
                  </Button>
                ))
              ) : (
                <div className="text-center py-8 text-default-500">
                  No servers found matching &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Button
                variant="light"
                onClick={() => setSelectedServer(null)}
                className="mb-4"
              >
                ← Back to Servers
              </Button>

              {isLoadingTools ? (
                <div className="text-center py-8 text-default-500">
                  Loading tools...
                </div>
              ) : (
                <div className="grid gap-2">
                  {tools.map((tool: any) => (
                    <Button
                      key={tool.name}
                      variant="flat"
                      className="justify-start h-auto py-4"
                      onClick={() => {
                        onSelect(selectedServer, tool.name);
                        handleClose();
                      }}
                    >
                      <div className="text-left w-full">
                        <div className="font-semibold">{tool.name}</div>
                        {tool.description && (
                          <div className="text-xs text-default-500 mt-1">
                            {tool.description}
                          </div>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-default-200 flex justify-end">
          <Button variant="light" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

const SlashCommandMenu = forwardRef<any, SuggestionProps<string>>(
  (props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
      const item = props.items[index];
      if (item) {
        props.command({ id: item, label: item });
      }
    };

    const upHandler = () => {
      setSelectedIndex(
        (selectedIndex + props.items.length - 1) % props.items.length
      );
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    useEffect(() => {
      setSelectedIndex(0);
    }, [props.items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: SuggestionKeyDownProps) => {
        if (event.key === "ArrowUp") {
          upHandler();
          return true;
        }
        if (event.key === "ArrowDown") {
          downHandler();
          return true;
        }
        if (event.key === "Enter") {
          enterHandler();
          return true;
        }
        return false;
      },
    }));

    return (
      <div className="dropdown-menu z-50 rounded-lg border border-default-200 bg-content1 shadow-lg overflow-hidden min-w-[300px] max-w-[500px]">
        {props.items.length > 0 ? (
          <div className="max-h-[400px] overflow-y-auto p-2">
            {props.items.map((item, index) => (
              <button
                key={item}
                onClick={() => selectItem(index)}
                className={`w-full text-left px-4 py-3 rounded-md transition-all duration-200 flex items-center gap-3 ${
                  index === selectedIndex
                    ? "bg-primary text-primary-foreground shadow-md transform scale-[1.02]"
                    : "hover:bg-default-100"
                }`}
              >
                <span className="text-xl">🔧</span>
                <div className="flex-1">
                  <div className="font-semibold text-sm capitalize">{item}</div>
                  <div className="text-xs opacity-70 mt-0.5">
                    Select MCP tools from Smithery
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="px-4 py-3 text-sm text-default-400">
            No matching commands found...
          </div>
        )}
      </div>
    );
  }
);

SlashCommandMenu.displayName = "SlashCommandMenu";

const updatePosition = (editor: any, element: HTMLElement) => {
  const virtualElement = {
    getBoundingClientRect: () =>
      posToDOMRect(
        editor.view,
        editor.state.selection.from,
        editor.state.selection.to
      ),
  };

  computePosition(virtualElement, element, {
    placement: "bottom-start",
    strategy: "absolute",
    middleware: [shift(), flip()],
  }).then(({ x, y, strategy }) => {
    element.style.width = "max-content";
    element.style.position = strategy;
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
  });
};

export const TiptapEditor = ({
  servers,
  fetcher,
  detailFetcher,
  onDescriptionChange,
  onDepsChange,
}: TiptapEditorProps) => {
  const [isToolSelectorOpen, setIsToolSelectorOpen] = useState(false);
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [serverDeps, setServerDeps] = useState<ServerListResponse["servers"]>(
    []
  );
  const [isAddingMention, setIsAddingMention] = useState(false);

  const syncDepsWithMentions = (editor: any) => {
    const currentMentions = new Set<string>();
    editor.state.doc.descendants((node: any) => {
      if (node.type.name === "mention") {
        const mentionId = node.attrs.id || node.attrs.label;
        if (mentionId) {
          currentMentions.add(cleanMentionId(mentionId));
        }
      }
    });

    setServerDeps((deps) =>
      deps.filter((dep) =>
        currentMentions.has(dep.resolvedToolDef || dep.qualifiedName)
      )
    );
  };

  useEffect(() => {
    onDepsChange(serverDeps);
  }, [serverDeps, onDepsChange]);

  const handleToolSelect = (serverName: string, toolName: string) => {
    if (editorInstance) {
      const mentionText = `@${serverName}.${toolName}`;

      const selectedServer = servers.find(
        (s) => s.qualifiedName === serverName
      );
      if (selectedServer) {
        setIsAddingMention(true);
        setServerDeps((deps) => [
          ...deps,
          {
            ...selectedServer,
            resolvedToolDef: `${serverName}.${toolName}`,
            detail: detailFetcher.data,
          },
        ]);
      }

      editorInstance
        .chain()
        .focus()
        .insertContent({
          type: "mention",
          attrs: {
            id: mentionText,
            label: mentionText,
          },
        })
        .run();

      setTimeout(() => setIsAddingMention(false), 100);
    }
  };

  const suggestion = {
    char: "@",
    items: ({ query }: { query: string }) => {
      return SLASH_COMMANDS.filter((item) =>
        item.toLowerCase().startsWith(query.toLowerCase())
      ).slice(0, 5);
    },

    command: ({ editor, range }: any) => {
      editor.commands.deleteRange(range);
      setIsToolSelectorOpen(true);
      setEditorInstance(editor);
    },

    render: () => {
      let component: ReactRenderer<any, any>;

      return {
        onStart: (props: any) => {
          const { editor, clientRect } = props;

          component = new ReactRenderer(SlashCommandMenu, {
            props,
            editor,
          });

          if (!clientRect) {
            return;
          }

          component.element.style.position = "absolute";
          document.body.appendChild(component.element);
          updatePosition(editor, component.element);
        },

        onUpdate: (props: any) => {
          const { editor, clientRect } = props;

          component.updateProps(props);

          if (!clientRect) {
            return;
          }

          updatePosition(editor, component.element);
        },

        onKeyDown: (props: any) => {
          const { event } = props;

          if (event.key === "Escape") {
            component.destroy();
            return true;
          }

          return component.ref?.onKeyDown(props) || false;
        },

        onExit: () => {
          component.destroy();
        },
      };
    },
  };

  const editor = useEditor({
    extensions: [
      TextStyleKit,
      StarterKit,
      Placeholder.configure({
        placeholder:
          "Describe your agentic tool here... Type @ to search and reference MCPs from Smithery as dependencies",
      }),
      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },
        renderText({ node }) {
          const text = node.attrs.label || node.attrs.id;
          return `<tool name="${cleanMentionId(text || "")}"/>`;
        },
        renderHTML({ options, node }) {
          const text = node.attrs.label || node.attrs.id;
          return ["span", options.HTMLAttributes, cleanMentionId(text || "")];
        },
        suggestion,
      }),
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose focus:outline-none min-h-[150px] p-4 w-full",
      },
    },
    onUpdate: ({ editor }) => {
      onDescriptionChange(editor.getText());

      if (!isAddingMention) {
        syncDepsWithMentions(editor);
      }
    },
  });

  useEffect(() => {
    if (editor) {
      editor.commands.focus();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <>
      <div className="w-full border border-default-200 rounded-lg bg-content1">
        <EditorContent editor={editor} />
        <style>{`
          .mention {
            background: linear-gradient(135deg, hsl(var(--heroui-primary) / 0.15) 0%, hsl(var(--heroui-secondary) / 0.15) 100%);
            border: 1px solid hsl(var(--heroui-primary) / 0.3);
            border-radius: 0.5rem;
            padding: 0.05rem 0.2rem;
            color: hsl(var(--heroui-primary));
            font-weight: 600;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.9em;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
          }
          
          .mention::before {
            content: '🔧';
            font-size: 0.85em;
            opacity: 0.8;
          }
          
          .mention:hover {
            background: linear-gradient(135deg, hsl(var(--heroui-primary) / 0.25) 0%, hsl(var(--heroui-secondary) / 0.25) 100%);
            border-color: hsl(var(--heroui-primary) / 0.5);
            transform: translateY(-1px);
            box-shadow: 0 2px 8px hsl(var(--heroui-primary) / 0.2);
          }
          
          .ProseMirror p.is-editor-empty:first-child::before {
            content: attr(data-placeholder);
            color: hsl(var(--heroui-default-400) / 0.6);
            float: left;
            height: 0;
            pointer-events: none;
          }
          
          .ProseMirror:focus {
            outline: none;
          }
        `}</style>
      </div>

      <ToolSelector
        isOpen={isToolSelectorOpen}
        onClose={() => setIsToolSelectorOpen(false)}
        servers={servers}
        fetcher={fetcher}
        detailFetcher={detailFetcher}
        onSelect={handleToolSelect}
      />
    </>
  );
};
