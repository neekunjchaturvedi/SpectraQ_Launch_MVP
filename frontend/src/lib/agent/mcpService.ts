import axios from "axios";
import { ToolCall } from "@/hooks/agent/types";
import { MCP_SERVERS, API_KEYS, MCP_TOOLS } from "./config";

// Types for MCP API responses
interface McpResponse {
  content: string;
  source: string;
  timestamp: string;
}

// Query the MCP server with a specific tool
export async function queryMcpServer(
  tool: string,
  query: string
): Promise<McpResponse> {
  try {
    // In a production app, this would be a real API call
    // For now, we'll simulate a response based on the tool

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get the MCP server URL for this tool
    const serverUrl = MCP_SERVERS[tool as keyof typeof MCP_SERVERS];

    if (!serverUrl) {
      throw new Error(`Unknown MCP server for tool: ${tool}`);
    }

    // In a real implementation, this would be an actual API call:
    // const response = await axios.post(serverUrl, {
    //   query,
    //   apiKey: COMPUT3_API_KEY,
    // });
    // return response.data;

    // For demo purposes, generate mock responses based on the tool
    return generateMockResponse(tool, query);
  } catch (error) {
    console.error(`Error querying MCP server for ${tool}:`, error);
    throw error;
  }
}

// Process a user query through Comput3.ai
// Use our FastAPI backend instead of direct Comput3.ai calls
async function callBackendAPI(endpoint, payload) {
  try {
    const response = await fetch(`${MCP_SERVERS.api}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error calling backend API: ${error}`);
    throw error;
  }
}

export async function processAgentQuery(
  query: string,
  history: Array<{ role: string; content: string }>
): Promise<{
  response: string;
  toolCalls: ToolCall[];
}> {
  try {
    // Call our FastAPI backend
    const result = await callBackendAPI("agent/query", {
      query,
      messages: history,
      stream: false,
    });

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
      response: result.assistant_message.content,
      toolCalls: result.assistant_message.tool_calls || [],
    };
  } catch (error) {
    console.error("Error processing agent query:", error);
    throw error;
  }
}

// Execute all tool calls and gather responses
export async function executeToolCalls(
  toolCalls: ToolCall[]
): Promise<Array<McpResponse>> {
  try {
    // Call our FastAPI backend to execute tool calls
    const toolResponses = [];

    for (const tool of toolCalls) {
      const result = await callBackendAPI("mcp/tool-call", tool);
      toolResponses.push({
        content: result.content,
        source: result.source,
        timestamp: result.timestamp,
      });
    }

    return toolResponses;

    /* Original implementation:
    const toolPromises = toolCalls.map(async (tool) => {
      const toolName = tool.function?.name || 'unknown';
      const args = tool.function?.arguments || '{}';
      
      // Parse the arguments
      const parsedArgs = JSON.parse(args);
      const query = parsedArgs.query || '';
      
      // Map the tool name to our MCP servers
      const mcpTool = mapToolNameToMcpServer(toolName);
      
      // Query the MCP server
      return await queryMcpServer(mcpTool, query);
    });
    
    // Wait for all tool calls to complete
    return await Promise.all(toolPromises); */
  } catch (error) {
    console.error("Error executing tool calls:", error);
    throw error;
  }
}

// Final step: analyze tool responses and generate a comprehensive answer
export async function generateFinalAnswer(
  query: string,
  toolResponses: Array<McpResponse>
): Promise<string> {
  try {
    // Call our FastAPI backend to generate the final answer
    const payload = {
      query,
      messages: [
        { role: "user", content: query },
        {
          role: "assistant",
          content: "I need to analyze this query using tools.",
        },
        ...toolResponses.map((resp) => ({
          role: "tool",
          content: resp.content,
          tool_name: resp.source,
        })),
      ],
      stream: false,
    };

    const result = await callBackendAPI("agent/query", payload);
    return result.final_response.content;

    /* Original mock implementation:
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Combine all tool responses
    const combinedResponses = toolResponses
      .map(resp => `From ${resp.source}: ${resp.content}`)
      .join('\n\n');
    
    // Generate a mock final answer
    return `Based on your query "${query}", I've gathered information from multiple sources:\n\n${combinedResponses}\n\n**Summary**: Based on the collected data, it appears that market sentiment is currently bullish, with increased on-chain activity suggesting growing interest in the space. The recent regulatory developments are also favorable for market growth.`; */
  } catch (error) {
    console.error("Error generating final answer:", error);
    throw error;
  }
}

// Helper functions

// Map a tool call name to the appropriate MCP server
function mapToolNameToMcpServer(toolName: string): string {
  const toolMap: Record<string, string> = {
    queryMarketData: "marketData",
    queryBlockchainData: "blockchain",
    searchWeb: "webSearch",
    getNews: "newsFeed",
    // Add more mappings as needed
  };

  return toolMap[toolName] || "marketData"; // Default to market data
}

// Generate mock tool calls based on the query
function generateMockToolCalls(query: string): ToolCall[] {
  const toolCalls: ToolCall[] = [];

  // Look for keywords in the query to determine which tools to call
  if (
    query.toLowerCase().includes("market") ||
    query.toLowerCase().includes("price") ||
    query.toLowerCase().includes("trend")
  ) {
    toolCalls.push({
      id: "1",
      function: {
        name: "queryMarketData",
        arguments: JSON.stringify({
          query,
          timeframe: "7d",
        }),
      },
    });
  }

  if (
    query.toLowerCase().includes("blockchain") ||
    query.toLowerCase().includes("transaction") ||
    query.toLowerCase().includes("token")
  ) {
    toolCalls.push({
      id: "2",
      function: {
        name: "queryBlockchainData",
        arguments: JSON.stringify({
          query,
          chain: "avalanche",
        }),
      },
    });
  }

  if (
    query.toLowerCase().includes("news") ||
    query.toLowerCase().includes("announcement") ||
    query.toLowerCase().includes("update")
  ) {
    toolCalls.push({
      id: "3",
      function: {
        name: "getNews",
        arguments: JSON.stringify({
          query,
          days: 7,
        }),
      },
    });
  }

  // If no specific keywords, default to market data
  if (toolCalls.length === 0) {
    toolCalls.push({
      id: "1",
      function: {
        name: "queryMarketData",
        arguments: JSON.stringify({
          query,
          timeframe: "7d",
        }),
      },
    });
  }

  return toolCalls;
}

// Generate mock responses based on the tool
function generateMockResponse(tool: string, query: string): McpResponse {
  const responses: Record<string, string> = {
    marketData: `The market data for the past 7 days shows a positive trend with an average daily gain of 2.3%. The overall sentiment index is at 72 (bullish), and trading volume has increased by 15% compared to the previous week. Key resistance levels are at $3,450 and $3,600, while support levels are holding strong at $3,200 and $3,100.`,

    blockchain: `On-chain analysis of Avalanche blockchain shows increased activity with daily transactions up 22% from last week. Smart contract deployments have risen by 8.3%, and unique active addresses have grown to 124,500 (up 12.1%). The network is processing an average of 12.3 transactions per second with a median fee of 0.0023 AVAX.`,

    webSearch: `Recent web searches indicate growing interest in decentralized prediction markets, with a 43% increase in search volume for related terms. The community is particularly focused on governance proposals and upcoming feature releases. Several thought leaders have published positive analyses on the future of prediction markets.`,

    newsFeed: `Recent news highlights: 1) Avalanche Foundation announced a $20M developer incentive program; 2) A major institutional investor allocated $50M to crypto prediction markets; 3) Regulatory clarity has improved with new guidelines from the SEC; 4) A new cross-chain bridge for prediction markets is launching next week.`,
  };

  return {
    content:
      responses[tool] || `No data available for ${tool} regarding "${query}"`,
    source: tool,
    timestamp: new Date().toISOString(),
  };
}
