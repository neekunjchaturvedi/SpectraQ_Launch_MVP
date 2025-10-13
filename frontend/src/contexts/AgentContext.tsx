import { createContext } from 'react';
import { AgentContextType } from '@/hooks/agent/types';

// Create the context with a default value
export const AgentContext = createContext<AgentContextType>({
  messages: [],
  isProcessing: false,
  sendMessage: async () => {},
  resetAgent: () => {},
  agentState: 'idle',
  connectedTools: [],
});
