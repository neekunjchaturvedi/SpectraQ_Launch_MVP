import { Message, ToolCall } from "@/hooks/agent/types";
import { MCP_SERVERS } from "./config";

const API_BASE_URL = MCP_SERVERS.api;

interface StreamCallbacks {
  onAssistantMessage: (content: string, toolCalls: ToolCall[]) => void;
  onToolResponse: (content: string, source: string) => void;
  onFinalResponse: (content: string) => void;
  onError: (error: Error) => void;
  onDone: () => void;
}

/**
 * Send a query to the backend API
 */
export async function sendQuery(query: string, messages: Message[] = []) {
  try {
    const response = await fetch(`${API_BASE_URL}/agent/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        context: {
          messages: messages.map((msg) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp,
            tool_calls: msg.tool_calls,
            tool_name: msg.tool_name,
          })),
        },
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    console.log("Backend response data:", data);
    console.log("Response content:", data.response);
    console.log("Response content length:", data.response?.length);

    // Transform the response to match our expected format
    return {
      assistant_message: {
        id: data.id || Date.now().toString(),
        role: "assistant",
        content: "I need to analyze your query...",
        timestamp: new Date().toISOString(),
        tool_calls:
          data.tools_used?.map(
            (tool: {
              tool_name: string;
              parameters: unknown;
              result: unknown;
            }) => ({
              name: tool.tool_name,
              arguments: tool.parameters,
            })
          ) || [],
      },
      tool_responses:
        data.tools_used?.map(
          (tool: {
            tool_name: string;
            parameters: unknown;
            result: unknown;
          }) => ({
            id: Date.now().toString() + Math.random(),
            role: "tool",
            content: `Data from ${tool.tool_name}: ${JSON.stringify(
              tool.result
            )}`,
            timestamp: new Date().toISOString(),
            tool_name: tool.tool_name,
          })
        ) || [],
      final_response: {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "Here is my analysis.",
        timestamp: new Date().toISOString(),
        compliance_audit: data.compliance_audit || null,
      },
    };
  } catch (error) {
    console.error("Error sending query to backend:", error);
    throw error;
  }
}

/**
 * Get available tools from the backend
 */
export async function fetchAvailableTools() {
  try {
    const response = await fetch(`${API_BASE_URL}/agent/status`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform MCP servers status to tools format
    const mcpServers = data.mcp_servers || {};
    const tools = Object.entries(mcpServers).map(
      ([id, server]: [string, unknown]) => {
        const serverData = server as {
          name?: string;
          description?: string;
          status?: string;
        };
        return {
          id,
          name: serverData.name || id.charAt(0).toUpperCase() + id.slice(1),
          description: serverData.description || `${id} data source`,
          source: getSourceType(id),
          connected:
            serverData.status === "active" || serverData.status === "available",
        };
      }
    );

    return tools;
  } catch (error) {
    console.error("Error fetching available tools:", error);
    // Return default tools as fallback
    return [
      {
        id: "coingecko",
        name: "CoinGecko",
        description: "Market data and cryptocurrency information",
        source: "market",
        connected: true,
      },
      {
        id: "ccxt",
        name: "CCXT",
        description: "Exchange data and trading information",
        source: "market",
        connected: true,
      },
      {
        id: "feargreed",
        name: "Fear & Greed Index",
        description: "Sentiment indicators",
        source: "market",
        connected: true,
      },
      {
        id: "cryptopanic",
        name: "CryptoPanic",
        description: "News aggregation",
        source: "web",
        connected: false,
      },
      {
        id: "firecrawl",
        name: "Firecrawl",
        description: "Web content extraction",
        source: "web",
        connected: false,
      },
    ];
  }
}

function getSourceType(id: string): "market" | "chain" | "web" | "user" {
  const marketSources = ["coingecko", "ccxt", "feargreed"];
  const webSources = ["cryptopanic", "firecrawl"];

  if (marketSources.includes(id)) return "market";
  if (webSources.includes(id)) return "web";
  return "chain";
}

/**
 * Reset the agent session context
 */
export async function resetAgentContext(sessionId?: string) {
  if (!sessionId) return;

  try {
    await fetch(`${API_BASE_URL}/agent/context/${sessionId}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error resetting agent context:", error);
  }
}

/**
 * Stream a query to the backend API with event source
 */
export function streamQuery(
  query: string,
  messages: Message[] = [],
  callbacks: StreamCallbacks
) {
  // Create a unique session ID
  const sessionId = Date.now().toString();

  // Create the EventSource
  const eventSource = new EventSource(
    `${API_BASE_URL}/agent/query?stream=true&session_id=${sessionId}`,
    { withCredentials: true }
  );

  // Send the initial POST request to start the stream
  fetch(`${API_BASE_URL}/agent/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      messages: messages.map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
        tool_calls: msg.tool_calls,
        tool_name: msg.tool_name,
      })),
      stream: true,
      session_id: sessionId,
    }),
  }).catch((error) => {
    callbacks.onError(error);
    eventSource.close();
  });

  // Listen for messages
  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "assistant":
          callbacks.onAssistantMessage(data.content, data.tool_calls || []);
          break;
        case "tool":
          callbacks.onToolResponse(data.content, data.source);
          break;
        case "final":
          callbacks.onFinalResponse(data.content);
          break;
        case "error":
          callbacks.onError(new Error(data.content));
          break;
      }

      if (data.done) {
        callbacks.onDone();
        eventSource.close();
      }
    } catch (error) {
      callbacks.onError(error as Error);
    }
  };

  // Handle errors
  eventSource.onerror = (error) => {
    callbacks.onError(error as Error);
    eventSource.close();
  };

  // Return a function to close the connection
  return () => {
    eventSource.close();
  };
}
