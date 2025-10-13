// Define message types
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp: number;
  tool_name?: string;
  tool_calls?: ToolCall[];
}

// Define the type for tool calls
export type ToolCall = {
  id?: string;
  name?: string;
  function?: {
    name: string;
    arguments: string;
  };
};

// Define the Agent context interface
export interface AgentContextType {
  messages: Message[];
  isProcessing: boolean;
  addUserMessage: (content: string) => void;
  addAssistantMessage: (content: string, toolCalls?: ToolCall[]) => void;
  addToolResponse: (toolName: string, content: string) => void;
  clearMessages: () => void;
  processingQuery: string | null;
  setProcessingQuery: (query: string | null) => void;
}
