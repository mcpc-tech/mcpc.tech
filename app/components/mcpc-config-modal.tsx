import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Button } from "@heroui/react";
import { CodeBlock } from "~/components/code";

interface McpcConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverName: string;
  setServerName: (name: string) => void;
  toolName: string;
  setToolName: (name: string) => void;
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
  mcpcConfigStr,
  mcpcConfig,
  MCPC_SERVER_DEFAULT_NAME,
  MCPC_TOOL_DEFAULT_NAME,
}) => (
  <Modal isOpen={isOpen} size={"full"} onClose={onClose}>
    <ModalContent>
      {(close) => (
        <>
          <ModalHeader className="flex flex-col gap-1">
            Your MCP Server is Ready, Use & Share it 🎉
          </ModalHeader>
          <ModalBody>
            <div className="flex justify-between gap-4">
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
                label="Tool Name"
                value={toolName}
                onChange={(e) => setToolName(e.target.value)}
                onClear={() => setToolName(MCPC_TOOL_DEFAULT_NAME)}
              />
            </div>
            <CodeBlock code={mcpcConfigStr} language={"json"} />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={close}>
              Close
            </Button>
            <Button
              color="primary"
              onPress={() => {
                close();
                navigator.clipboard.writeText(JSON.stringify(mcpcConfig));
              }}
            >
              Copy Config
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  </Modal>
);
