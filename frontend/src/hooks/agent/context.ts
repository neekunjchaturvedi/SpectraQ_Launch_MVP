import { createContext } from 'react';
import { AgentContextType } from './agentTypes';

// Create the context with a default value
export const AgentContext = createContext<AgentContextType | undefined>(undefined);
