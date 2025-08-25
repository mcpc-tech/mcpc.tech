import React, { useState, useRef, useEffect } from "react";
import { Mention } from "primereact/mention";
import { Accordion, AccordionItem } from "@heroui/react";
import { SuggestionDataItem } from "react-mentions";
import { ServerDetailResponse, ServerListResponse } from "~/routes/smithery";

interface McpcMentionInputProps {
  servers: ServerListResponse["servers"];
  detailFetcher: any;
  fetcher: any;
  onDepsChange: (deps: ServerListResponse["servers"]) => void;
  onDescriptionChange: (desc: string) => void;
}

export const McpcMentionInput: React.FC<McpcMentionInputProps> = ({
  servers,
  detailFetcher,
  fetcher,
  onDepsChange,
  onDescriptionChange,
}) => {
  const [value, setValue] = useState("");
  const [resolvedValue, setResolvedValue] = useState("");
  const [selectedServerNames, setSelectedServerNames] = useState(new Set<string>());
  const [serverDeps, setServerDeps] = useState<ServerListResponse["servers"]>([]);
  const textareaRef = useRef<HTMLInputElement>(null);
  const mentionRef = useRef<any>(null);

  useEffect(() => {
    onDepsChange(serverDeps);
  }, [serverDeps, onDepsChange]);

  useEffect(() => {
    onDescriptionChange(resolvedValue);
  }, [resolvedValue, onDescriptionChange]);

  useEffect(() => {
    mentionRef.current?.focus();
  }, [mentionRef]);

  const renderSuggestion = (
    suggestion: SuggestionDataItem
  ): React.ReactNode => {
    const mcpSuggestion = suggestion as unknown as ServerListResponse["servers"][number];
    const rawTools = ((detailFetcher.data?.tools as ServerDetailResponse["tools"]) ?? []) as ServerDetailResponse["tools"];
    const tools =
      (rawTools?.length ?? 0) > 0
        ? rawTools
        : ([
            {
              name: "__ALL__",
              description:
                "No tools registered - you can select this placeholder for now and modify it later",
            },
          ] as unknown as ServerDetailResponse["tools"]);
    return (
      <Accordion
        className="rounded-none m-1"
        selectedKeys={selectedServerNames}
        onSelectionChange={(keys) => {
          setSelectedServerNames(new Set(keys as string));
          detailFetcher.submit(
            { server: mcpSuggestion.qualifiedName },
            { action: "/smithery", method: "GET" }
          );
        }}
        variant="shadow"
      >
        <AccordionItem
          key={mcpSuggestion.qualifiedName}
          aria-label={mcpSuggestion.qualifiedName}
          subtitle={mcpSuggestion.description}
          title={mcpSuggestion.qualifiedName}
          className="rounded-lg w-full whitespace-normal"
        >
          {tools && (
            <div className="w-full list-disc list-inside py-1 px-2">
              {tools.map((tool) => (
                <button
                  key={tool.name}
                  onClick={() => {
                    mcpSuggestion.resolvedToolDef = `${mcpSuggestion.qualifiedName}.${tool.name}`;
                    setServerDeps((deps: any) => [
                      ...deps,
                      { ...mcpSuggestion, detail: detailFetcher.data },
                    ]);
                    mentionRef.current?.hide();
                  }}
                  className="w-full text-left block px-4 py-2 rounded-md text-default-600 hover:text-primary hover:bg-default-100 transition-all duration-200 ease-in-out"
                >
                  <div className="w-full font-medium">{tool.name}</div>
                  <div className="w-full ml-6 mt-1 text-sm text-gray-500">
                    {tool.description}
                  </div>
                </button>
              ))}
            </div>
          )}
        </AccordionItem>
      </Accordion>
    );
  };

  return (
    <Mention
      field={"resolvedToolDef"}
      value={value}
      inputRef={textareaRef}
      onChange={(e) => {
        const { value } = e.target as HTMLInputElement;
        setValue(value);
        setResolvedValue(
          value?.replaceAll(/>([^\s]+)/g, '<tool name="$1"/>')
        );
      }}
      onSearch={(e) => {
        fetcher.submit(
          {
            q: `${encodeURIComponent(e.query)}`,
          },
          { action: "/smithery", method: "GET" }
        );
      }}
      ref={mentionRef}
      trigger=">"
      suggestions={(servers || []).map((server) => ({
        ...server,
        id: server.qualifiedName,
      }))}
      placeholder="Type > to search and reference MCPs from Smithery as dependencies"
      itemTemplate={renderSuggestion}
  inputClassName="w-full z-0 p-3 min-h-[72px]"
  panelClassName="w-8/12 overflow-x-auto z-50 p-2 border-1 rounded-lg shadow-md bg-content1"
  className="z-50"
    />
  );
};
