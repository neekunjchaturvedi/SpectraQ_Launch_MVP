// Contract addresses on Avalanche Fuji
export const CONTRACT_ADDRESSES = {
  MARKET: '0x0000000000000000000000000000000000000000', // Replace with deployed address
  BASIC_MARKET_RESOLVER: '0x0000000000000000000000000000000000000000', // Replace with deployed address
  VUSD: '0x0000000000000000000000000000000000000000', // Replace with deployed address
  POSITION_MANAGER: '0x0000000000000000000000000000000000000000', // Uniswap V4 Position Manager
  POOL_MANAGER: '0x0000000000000000000000000000000000000000', // Uniswap V4 Pool Manager
} as const;

// Market Contract ABI (simplified for key functions)
export const MARKET_ABI = [
  {
    "inputs": [
      {
        "components": [
          { "name": "title", "type": "string" },
          { "name": "description", "type": "string" },
          { "name": "category", "type": "string" },
          { "name": "resolver", "type": "address" },
          { "name": "endTime", "type": "uint256" },
          { "name": "minDeposit", "type": "uint256" },
          { "name": "marketToken", "type": "address" }
        ],
        "name": "config",
        "type": "tuple"
      }
    ],
    "name": "createMarket",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "marketId", "type": "uint256" },
      { "name": "title", "type": "string" },
      { "name": "description", "type": "string" },
      { "name": "evidence", "type": "string" },
      { "name": "outcome", "type": "bool" }
    ],
    "name": "submitProposal",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "marketId", "type": "uint256" }],
    "name": "graduateMarket",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "marketId", "type": "uint256" }],
    "name": "getMarket",
    "outputs": [
      {
        "components": [
          { "name": "id", "type": "uint256" },
          { "name": "title", "type": "string" },
          { "name": "description", "type": "string" },
          { "name": "category", "type": "string" },
          { "name": "creator", "type": "address" },
          { "name": "resolver", "type": "address" },
          { "name": "endTime", "type": "uint256" },
          { "name": "status", "type": "uint8" },
          { "name": "yesToken", "type": "address" },
          { "name": "noToken", "type": "address" },
          { "name": "poolKey", "type": "bytes32" }
        ],
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "marketId", "type": "uint256" }],
    "name": "getTokenPrices",
    "outputs": [
      { "name": "yesPrice", "type": "uint256" },
      { "name": "noPrice", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "category", "type": "string" }],
    "name": "getMarketsByCategory",
    "outputs": [{ "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// ERC20 ABI for token interactions
export const ERC20_ABI = [
  {
    "inputs": [
      { "name": "spender", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "name": "", "type": "uint8" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Market status enum
export enum MarketStatus {
  ACTIVE = 0,
  RESOLVED = 1,
  DISPUTED = 2,
  CANCELLED = 3
}

// Community categories
export const COMMUNITIES = [
  {
    id: 'traders',
    name: 'Traders',
    description: 'Financial markets and trading predictions',
    icon: '📈',
    color: 'text-success'
  },
  {
    id: 'gamers',
    name: 'Gamers',
    description: 'Gaming tournaments and esports outcomes',
    icon: '🎮',
    color: 'text-primary'
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Sports events and match outcomes',
    icon: '⚽',
    color: 'text-warning'
  },
  {
    id: 'crypto',
    name: 'Crypto',
    description: 'Cryptocurrency price movements and events',
    icon: '₿',
    color: 'text-quantum-orange'
  },
  {
    id: 'politics',
    name: 'Politics',
    description: 'Political events and election outcomes',
    icon: '🗳️',
    color: 'text-destructive'
  },
  {
    id: 'tech',
    name: 'Technology',
    description: 'Tech industry predictions and launches',
    icon: '💻',
    color: 'text-info'
  }
] as const;