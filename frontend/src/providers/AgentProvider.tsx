import { ReactNode, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAgentQuery, useAvailableTools } from '@/hooks/agent/useAgentQuery';
import { Message } from '@/hooks/agent/types';
import { AgentContext } from '@/contexts/AgentContext';

// Define the props for the provider component
interface AgentProviderProps {
  children: ReactNode;
}

// The provider component
export function AgentProvider({ children }: AgentProviderProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentState, setAgentState] = useState<'idle' | 'processing' | 'error'>('idle');
  
  // Use the query hooks
  const agentQuery = useAgentQuery();
  const toolsQuery = useAvailableTools();
  
  // Get connected tools
  const connectedTools = toolsQuery.data
    ? toolsQuery.data.filter(tool => tool.connected).map(tool => tool.id)
    : ['market-data', 'blockchain', 'web-search', 'news-feed']; // Default fallback

  const sendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setAgentState('processing');
    
    try {
      // Process the message using our agent service
      const { assistantMessage, toolResponses, finalResponse } = await agentQuery.mutateAsync({
        query: content,
        messages: [...messages, userMessage]
      });
      
      console.log('Agent query response:', { assistantMessage, toolResponses, finalResponse });
      console.log('Final response content:', finalResponse.content);
      console.log('Final response content length:', finalResponse.content?.length);
      
      // Add the assistant message (with tool calls)
      setMessages(prev => [...prev, assistantMessage]);
      
      // Add each tool response
      for (const toolResponse of toolResponses) {
        setMessages(prev => [...prev, toolResponse]);
      }
      
      // Add the final response
      setMessages(prev => [...prev, finalResponse]);
      
      setAgentState('idle');
    } catch (error) {
      console.error('Error processing message:', error);
      setAgentState('error');
      
      // Add error message
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'system',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  }, [messages, agentQuery]);

  const resetAgent = useCallback(() => {
    setMessages([]);
    setAgentState('idle');
  }, []);

  return (
    <AgentContext.Provider 
      value={{ 
        messages, 
        isProcessing, 
        sendMessage, 
        resetAgent, 
        agentState, 
        connectedTools 
      }}
    >
      {children}
    </AgentContext.Provider>
  );
}
