import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define message types
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp: number;
  tool_name?: string;
  tool_calls?: {
    id?: string;
    name?: string;
    function?: {
      name: string;
      arguments: string;
    };
  }[];
}

// Define tool call interface
interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  result?: unknown;
}

// Define the Agent context interface
interface AgentContextType {
  messages: Message[];
  isProcessing: boolean;
  addUserMessage: (content: string) => void;
  addAssistantMessage: (content: string, toolCalls?: ToolCall[]) => void;
  addToolResponse: (toolName: string, content: string) => void;
  clearMessages: () => void;
  processingQuery: string | null;
  setProcessingQuery: (query: string | null) => void;
}

// Create the context with a default value
const AgentContext = createContext<AgentContextType | undefined>(undefined);

// Define the props for the provider component
interface AgentProviderProps {
  children: ReactNode;
}

// The provider component
export function AgentProvider({ children }: AgentProviderProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingQuery, setProcessingQuery] = useState<string | null>(null);

  const addUserMessage = useCallback((content: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setIsProcessing(true);
  }, []);

  const addAssistantMessage = useCallback((content: string, toolCalls?: ToolCall[]) => {
    const newMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      content,
      timestamp: Date.now(),
      tool_calls: toolCalls,
    };
    setMessages((prev) => [...prev, newMessage]);
    setIsProcessing(false);
  }, []);

  const addToolResponse = useCallback((toolName: string, content: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      role: 'tool',
      tool_name: toolName,
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const value = {
    messages,
    isProcessing,
    addUserMessage,
    addAssistantMessage,
    addToolResponse,
    clearMessages,
    processingQuery,
    setProcessingQuery,
  };

  return <AgentContext.Provider value={value}>{children}</AgentContext.Provider>;
}

// Custom hook to use the agent context
export function useAgentContext() {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error('useAgentContext must be used within an AgentProvider');
  }
  return context;
}
