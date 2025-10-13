// Define compliance audit result type
export interface ComplianceAuditResult {
  risk_score: number;
  issues: string[];
  fixes: string[];
  standards_checked: string[];
  timestamp: string;
  contract_address?: string;
}

// Define message types
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp: string | number;
  tool_name?: string;
  tool_calls?: ToolCall[];
  compliance_audit?: ComplianceAuditResult;
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
  sendMessage: (content: string) => Promise<void>;
  resetAgent: () => void;
  agentState: 'idle' | 'processing' | 'error';
  connectedTools: string[];
}
