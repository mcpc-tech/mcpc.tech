import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Button, Select, SelectItem, Switch } from "@heroui/react";
import { CodeBlock } from "~/components/code";

interface McpcConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverName: string;
  setServerName: (name: string) => void;
  toolName: string;
  setToolName: (name: string) => void;
  mode: "agentic" | "agentic-workflow";
  setMode: (mode: "agentic" | "agentic-workflow") => void;
  enableSampling: boolean;
  setEnableSampling: (enable: boolean) => void;
  mcpcConfigStr: string;
  mcpcConfig: any;
  MCPC_SERVER_DEFAULT_NAME: string;
  MCPC_TOOL_DEFAULT_NAME: string;
}

export const McpcConfigModal: React.FC<McpcConfigModalProps> = ({
  isOpen,
  onClose,
  serverName,
  setServerName,
  toolName,
  setToolName,
  mode,
  setMode,
  enableSampling,
  setEnableSampling,
  mcpcConfigStr,
  mcpcConfig,
  MCPC_SERVER_DEFAULT_NAME,
  MCPC_TOOL_DEFAULT_NAME,
}) => {
  const serverConfig = mcpcConfig.mcpServers?.[serverName];
  const configArg = serverConfig?.args?.find((arg: string) => {
    try {
      const parsed = JSON.parse(arg);
      return parsed.name && parsed.agents;
    } catch {
      return false;
    }
  });

  const cliCommand = configArg 
    ? `npx -y deno run -A jsr:@mcpc/cli/bin --config '${configArg}'`
    : "";

  const copyConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(mcpcConfig));
  };

  const copyCLI = () => {
    navigator.clipboard.writeText(cliCommand);
  };

  return (
    <Modal isOpen={isOpen} size={"full"} onClose={onClose}>
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Your MCP Server is Ready, Use & Share it 🎉
            </ModalHeader>
            <ModalBody>
              <div className="flex justify-between gap-4 mb-4">
                <Input
                  isClearable
                  name="serverName"
                  label="Server Name"
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  onClear={() => setServerName(MCPC_SERVER_DEFAULT_NAME)}
                />
                <Input
                  isClearable
                  name="toolName"
                  label="Agent Name"
                  value={toolName}
                  onChange={(e) => setToolName(e.target.value)}
                  onClear={() => setToolName(MCPC_TOOL_DEFAULT_NAME)}
                />
              </div>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <Select
                    label="Mode"
                    placeholder="Select mode"
                    selectedKeys={[mode]}
                    onChange={(e) => setMode(e.target.value as "agentic" | "agentic-workflow")}
                  >
                    <SelectItem key="agentic">
                      Agentic (Standard)
                    </SelectItem>
                    <SelectItem key="agentic-workflow">
                      Agentic-Workflow
                    </SelectItem>
                  </Select>
                </div>
                <div className="flex-1 flex">
                  <Switch
                    isSelected={enableSampling}
                    onValueChange={setEnableSampling}
                  >
                    Enable Sampling Capability
                  </Switch>
                </div>
              </div>
              <CodeBlock code={mcpcConfigStr} language="json" />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={close}>
                Close
              </Button>
              <Button color="primary" variant="flat" onPress={copyCLI}>
                Copy CLI Command
              </Button>
              <Button color="primary" onPress={copyConfig}>
                Copy MCP Config
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
