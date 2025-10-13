import { ReactNode, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, ToolCall } from './agentTypes';
import { AgentContext } from './context';

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
