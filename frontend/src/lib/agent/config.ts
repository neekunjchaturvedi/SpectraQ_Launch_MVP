// Configuration for MCP servers and Agent services

// MCP server endpoints
export const MCP_SERVERS = {
  // Using our FastAPI backend as proxy
  api: "http://localhost:8000/api/v1",

  marketData: "https://api.comput3.ai/market-data",
  blockchain: "https://api.comput3.ai/blockchain",
  webSearch: "https://api.comput3.ai/web-search",
  newsFeed: "https://api.comput3.ai/news-feed",
};

// API keys - In a real app, these would be loaded from environment variables
// But for this example, we're using placeholder values
export const API_KEYS = {
  comput3: "YOUR_COMPUT3_API_KEY", // Replace with actual API key in production
  openai: "YOUR_OPENAI_API_KEY", // Replace with actual API key in production
};

// Agent settings
export const AGENT_SETTINGS = {
  model: "gemini-2.0-flash-exp",
  temperature: 0.3,
  maxTokens: 2048,
  systemMessage: `You are SpectraQAgent, an AI assistant specialized in crypto and prediction markets.
You analyze data from multiple sources including market data, blockchain analytics, web searches, and news feeds.
Provide clear, concise, and accurate information about market trends, price predictions, and crypto insights.
Always specify your confidence level when making predictions, and cite your sources where possible.`,
};

// MCP tools configuration
export const MCP_TOOLS = [
  {
    id: "market-data",
    name: "Market Data",
    description:
      "Access to real-time and historical market data for cryptocurrencies and prediction markets",
    source: "market",
    functions: [
      {
        name: "queryMarketData",
        description: "Query historical and current market data",
        parameters: {
          query: "string",
          timeframe: "string", // e.g., '1d', '7d', '30d'
          assets: "string[]", // optional
        },
      },
    ],
  },
  {
    id: "blockchain",
    name: "Blockchain",
    description:
      "Access to on-chain data from Avalanche and other supported blockchains",
    source: "chain",
    functions: [
      {
        name: "queryBlockchainData",
        description: "Query on-chain data",
        parameters: {
          query: "string",
          chain: "string", // e.g., 'avalanche', 'ethereum'
          address: "string", // optional
        },
      },
    ],
  },
  {
    id: "web-search",
    name: "Web Search",
    description:
      "Search the web for relevant information about crypto, markets, and blockchain",
    source: "web",
    functions: [
      {
        name: "searchWeb",
        description: "Search the web for information",
        parameters: {
          query: "string",
          max_results: "number", // optional
        },
      },
    ],
  },
  {
    id: "news-feed",
    name: "News Feed",
    description:
      "Access to the latest news about crypto, blockchain, and prediction markets",
    source: "web",
    functions: [
      {
        name: "getNews",
        description: "Get the latest news",
        parameters: {
          query: "string",
          days: "number", // How many days back to look
        },
      },
    ],
  },
];
