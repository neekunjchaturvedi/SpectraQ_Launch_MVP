import { useContext } from 'react';
import { AgentContext } from './context';

// Custom hook to use the agent context
export function useAgentContext() {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error('useAgentContext must be used within an AgentProvider');
  }
  return context;
}
