import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Button, Select, SelectItem, Switch, Link } from "@heroui/react";
import { CodeBlock } from "~/components/code";
import type { ServerListResponse } from "~/routes/smithery";

type ConnectionType = "stdio" | "http";

interface ConfigSchema {
  type: ConnectionType;
  schema: any;
  exampleConfig?: any;
}

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
  configSchemas: Record<string, ConfigSchema>;
  userConfigs: Record<string, any>;
  setUserConfigs: (configs: Record<string, any>) => void;
  serverDeps: ServerListResponse["servers"];
}

// Convert input value to appropriate type
function convertFieldValue(value: string, fieldType: string) {
  if (fieldType === "number" || fieldType === "integer") {
    return value === "" ? undefined : Number(value);
  }
  if (fieldType === "boolean") {
    return value === "true";
  }
  return value;
}

// Render a boolean field
function BooleanField({ label, value, onChange, isRequired, description }: any) {
  return (
    <div className="mb-3">
      <Switch isSelected={value === true} onValueChange={onChange}>
        {label}
        {isRequired && <span className="text-danger ml-1">*</span>}
      </Switch>
      {description && <p className="text-xs text-default-400 mt-1">{description}</p>}
    </div>
  );
}

// Render an enum/select field
function EnumField({ label, value, onChange, options, isRequired, description }: any) {
  return (
    <div className="mb-3">
      <Select
        label={label}
        placeholder={`Select ${label}`}
        selectedKeys={value ? [String(value)] : []}
        onChange={(e) => onChange(e.target.value)}
        description={description}
        isRequired={isRequired}
      >
        {options.map((option: any) => (
          <SelectItem key={String(option)}>{String(option)}</SelectItem>
        ))}
      </Select>
    </div>
  );
}

// Render a text or number input field
function InputField({ label, value, onChange, fieldType, placeholder, isRequired, description }: any) {
  return (
    <div className="mb-3">
      <Input
        label={label}
        placeholder={placeholder}
        value={value !== undefined && value !== null ? String(value) : ""}
        onChange={onChange}
        description={description}
        type={fieldType === "number" || fieldType === "integer" ? "number" : "text"}
        isRequired={isRequired}
      />
    </div>
  );
}

// Render a form field based on JSON schema
function renderField(
  qualifiedName: string,
  fieldKey: string,
  schema: any,
  value: any,
  onChange: (newValue: any) => void,
  isRequired: boolean = false
) {
  const label = schema.title || fieldKey;
  const description = schema.description;
  const placeholder = schema.example || schema.default;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const convertedValue = convertFieldValue(e.target.value, schema.type);
    onChange(convertedValue);
  };

  if (schema.type === "boolean") {
    return (
      <BooleanField
        key={`${qualifiedName}-${fieldKey}`}
        label={label}
        value={value}
        onChange={onChange}
        isRequired={isRequired}
        description={description}
      />
    );
  }

  if (schema.enum && Array.isArray(schema.enum)) {
    return (
      <EnumField
        key={`${qualifiedName}-${fieldKey}`}
        label={label}
        value={value}
        onChange={onChange}
        options={schema.enum}
        isRequired={isRequired}
        description={description}
      />
    );
  }

  return (
    <InputField
      key={`${qualifiedName}-${fieldKey}`}
      label={label}
      value={value}
      onChange={handleInputChange}
      fieldType={schema.type}
      placeholder={placeholder ? String(placeholder) : undefined}
      isRequired={isRequired}
      description={description}
    />
  );
}

// Check if a server config has all required fields filled
function isServerConfigComplete(
  qualifiedName: string,
  schemaInfo: ConfigSchema,
  userConfig: any
) {
  // smitheryApiKey is now global, so we don't check it here
  
  // Check required fields in schema
  const required = schemaInfo.schema?.required;
  if (!required || !Array.isArray(required)) {
    return true;
  }

  return required.every((fieldKey: string) => {
    const value = userConfig?.[fieldKey];
    return value !== undefined && value !== null && value !== "";
  });
}

// Check if all configs are complete
function areAllConfigsComplete(
  configSchemas: Record<string, ConfigSchema>,
  userConfigs: Record<string, any>
) {
  // Check if global smitheryApiKey is required and filled
  const hasHttpServers = Object.values(configSchemas).some(
    (schema) => schema.type === "http"
  );
  
  if (hasHttpServers && !userConfigs._global?.smitheryApiKey) {
    return false;
  }

  return Object.entries(configSchemas).every(([qualifiedName, schemaInfo]) => {
    return isServerConfigComplete(qualifiedName, schemaInfo, userConfigs[qualifiedName]);
  });
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
  configSchemas,
  userConfigs,
  setUserConfigs,
  serverDeps,
}) => {
  const hasRequiredFields = Object.keys(configSchemas).length > 0;
  const allFieldsComplete = areAllConfigsComplete(configSchemas, userConfigs);
  
  // Check if any server uses HTTP connection
  const hasHttpServers = Object.values(configSchemas).some(
    (schema) => schema.type === "http"
  );

  const updateConfig = (qualifiedName: string, updates: any) => {
    setUserConfigs({
      ...userConfigs,
      [qualifiedName]: {
        ...userConfigs[qualifiedName],
        ...updates,
      },
    });
  };

  const handleConfigChange = (qualifiedName: string, fieldKey: string, value: any) => {
    updateConfig(qualifiedName, { [fieldKey]: value });
  };

  const handleGlobalApiKeyChange = (value: string) => {
    setUserConfigs({
      ...userConfigs,
      _global: {
        ...userConfigs._global,
        smitheryApiKey: value,
      },
    });
  };

  const copyServerConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(mcpcConfig, null, 2));
  };

  const copyCLI = () => {
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
      ? `npx @mcpc-tech/cli --config '${configArg}'`
      : "";

    navigator.clipboard.writeText(cliCommand);
  };

  return (
    <Modal isOpen={isOpen} size={"full"} onClose={onClose} scrollBehavior="inside">
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

              {/* Configuration Forms for Dependencies */}
              {Object.keys(configSchemas).length > 0 && (
                <div className="mb-6 p-4 border border-default-200 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Configure MCP Server Dependencies</h3>
                  <p className="text-sm text-default-500 mb-4">
                    Please fill in the required configuration for the MCP servers you referenced.
                  </p>
                  
                  {/* Global Smithery API Key for all HTTP servers */}
                  {hasHttpServers && (
                    <div className="mb-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
                      <h4 className="font-semibold mb-3 text-primary flex items-center gap-2">
                        🔑 Global Smithery API Key
                        <Link 
                          href="https://smithery.ai/account/api-keys" 
                          isExternal 
                          showAnchorIcon
                          className="text-sm font-normal"
                        >
                          Get your key
                        </Link>
                      </h4>
                      <p className="text-xs text-default-500 mb-3">
                        🔒 Your API key is not stored on our servers. It will be included in the configuration you copy below for local use only.
                      </p>
                      <p className="text-xs text-warning-600 mb-3 font-medium">
                        ⚠️ Before using: Please make sure you have connected your apps (e.g., GitHub, Notion) on{" "}
                        <Link 
                          href="https://smithery.ai" 
                          isExternal 
                          className="text-xs font-medium underline"
                        >
                          Smithery
                        </Link>
                      </p>
                      <Input
                        label="Smithery API Key"
                        placeholder="Enter your Smithery API key"
                        value={userConfigs._global?.smitheryApiKey || ""}
                        onChange={(e) => handleGlobalApiKeyChange(e.target.value)}
                        description="This API key will be used for all remote HTTP MCP servers. Get your key from smithery.ai"
                        isRequired
                        type="password"
                      />
                    </div>
                  )}
                  
                  {Object.entries(configSchemas).map(([qualifiedName, schemaInfo]) => {
                    const serverInfo = serverDeps.find(s => s.qualifiedName === qualifiedName);
                    const config = userConfigs[qualifiedName] || {};
                    const schema = schemaInfo.schema;
                    const properties = schema?.properties || {};
                    const required = schema?.required || [];

                    return (
                      <div key={qualifiedName} className="mb-6 p-4 bg-default-50 rounded-lg">
                        <h4 className="font-semibold mb-3 text-primary">
                          {serverInfo?.displayName || qualifiedName}
                        </h4>

                        {/* Render fields from schema */}
                        {Object.entries(properties).map(([fieldKey, fieldSchema]: [string, any]) => {
                          const isRequired = required.includes(fieldKey);
                          return renderField(
                            qualifiedName,
                            fieldKey,
                            fieldSchema,
                            config[fieldKey],
                            (value: any) => handleConfigChange(qualifiedName, fieldKey, value),
                            isRequired
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}

              <CodeBlock code={mcpcConfigStr} language="json" />
            </ModalBody>
            <ModalFooter>
              {hasRequiredFields && !allFieldsComplete && (
                <p className="text-sm text-warning mr-auto">
                  ⚠️ Please fill in all required configuration fields
                </p>
              )}
              <Button color="danger" variant="light" onPress={close}>
                Close
              </Button>
              <Button 
                color="primary" 
                variant="flat" 
                onPress={copyCLI}
                isDisabled={hasRequiredFields && !allFieldsComplete}
              >
                Copy CLI Command
              </Button>
              <Button 
                color="primary"
                onPress={copyServerConfig}
                isDisabled={hasRequiredFields && !allFieldsComplete}
              >
                Copy Server Config
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
