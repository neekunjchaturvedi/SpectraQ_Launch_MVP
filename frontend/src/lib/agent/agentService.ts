import { v4 as uuidv4 } from 'uuid';
import { Message, ToolCall } from '@/hooks/agent/types';
import { MCP_TOOLS } from './config';
import { sendQuery, fetchAvailableTools } from './backendService';

// Main function to handle a user query
export async function handleAgentQuery(
  query: string,
  messages: Message[]
): Promise<{
  assistantMessage: Message;
  toolResponses: Message[];
  finalResponse: Message;
}> {
  try {
    // Convert messages to the format expected by the API
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
      tool_calls: msg.tool_calls,
      tool_name: msg.tool_name
    }));

    // Send the query to our backend
    const response = await sendQuery(query, formattedMessages);
    
    // Extract data from the response
    const assistantMessage = response.assistant_message;
    const toolResponses = response.tool_responses || [];
    const finalResponse = response.final_response;

    return {
      assistantMessage,
      toolResponses,
      finalResponse,
    };
  } catch (error) {
    console.error('Error handling agent query:', error);
    
    // Create error messages for graceful fallback
    const errorAssistantMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: 'I need to analyze your query...',
      timestamp: new Date().toISOString(),
    };
    
    const errorFinalResponse: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: `I'm sorry, I encountered an error while processing your request. The server might be unavailable or there might be an issue with the connection. Please try again later.`,
      timestamp: new Date().toISOString(),
    };
    
    return {
      assistantMessage: errorAssistantMessage,
      toolResponses: [],
      finalResponse: errorFinalResponse,
    };
  }
}

// Helper function to extract market trends from responses
export function extractMarketTrends(messages: Message[]): { 
  trend: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  key_indicators: string[];
} {
  // This would be a more sophisticated function in a real app
  // For now, we'll return mock data
  
  const isBullish = messages.some(msg => 
    msg.content.toLowerCase().includes('bullish') || 
    msg.content.toLowerCase().includes('positive trend') ||
    msg.content.toLowerCase().includes('upward')
  );
  
  const isBearish = messages.some(msg => 
    msg.content.toLowerCase().includes('bearish') || 
    msg.content.toLowerCase().includes('negative trend') ||
    msg.content.toLowerCase().includes('downward')
  );
  
  let trend: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  let confidence = 0.5;
  
  if (isBullish && !isBearish) {
    trend = 'bullish';
    confidence = 0.8;
  } else if (isBearish && !isBullish) {
    trend = 'bearish';
    confidence = 0.7;
  } else if (isBullish && isBearish) {
    trend = 'neutral';
    confidence = 0.6;
  }
  
  return {
    trend,
    confidence,
    key_indicators: [
      'Trading volume',
      'On-chain activity',
      'Sentiment analysis',
      'Recent news'
    ]
  };
}

// Function to get available tools and their connection status
export async function getAvailableTools(): Promise<Array<{
  id: string;
  name: string;
  connected: boolean;
  source: 'market' | 'chain' | 'web' | 'user';
}>> {
  try {
    // Fetch available tools from the backend
    const tools = await fetchAvailableTools();
    
    // Map the tools to the expected format
    return tools.map(tool => ({
      id: tool.id,
      name: tool.name,
      connected: tool.connected || false,
      source: tool.source as 'market' | 'chain' | 'web' | 'user',
    }));
  } catch (error) {
    console.error('Error fetching available tools:', error);
    
    // Fallback to default tools if there's an error
    return MCP_TOOLS.map(tool => ({
      id: tool.id,
      name: tool.name,
      connected: tool.id !== 'real-time', // Mock status
      source: tool.source as 'market' | 'chain' | 'web' | 'user',
    }));
  }
}