import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  ChartBarIcon, 
  CubeIcon, 
  GlobeAltIcon, 
  DocumentTextIcon, 
  BoltIcon 
} from '@heroicons/react/24/outline';
import { useAvailableTools } from '@/hooks/agent/useAgentQuery';

export function AgentToolDisplay() {
  // Fetch available tools
  const { data: availableTools, isLoading } = useAvailableTools();

  // Define icon mapping
  const iconMap = {
    'coingecko': <ChartBarIcon className="h-4 w-4" />,
    'ccxt': <ChartBarIcon className="h-4 w-4" />,
    'feargreed': <ChartBarIcon className="h-4 w-4" />,
    'cryptopanic': <DocumentTextIcon className="h-4 w-4" />,
    'firecrawl': <GlobeAltIcon className="h-4 w-4" />,
    // Fallbacks
    'market-data': <ChartBarIcon className="h-4 w-4" />,
    'blockchain': <CubeIcon className="h-4 w-4" />,
    'web-search': <GlobeAltIcon className="h-4 w-4" />,
    'news-feed': <DocumentTextIcon className="h-4 w-4" />,
    'real-time': <BoltIcon className="h-4 w-4" />,
  };

  // Define color mapping based on source
  const colorMap = {
    'market': 'bg-emerald-500/20 text-emerald-500',
    'chain': 'bg-blue-500/20 text-blue-500',
    'web': 'bg-violet-500/20 text-violet-500',
    'user': 'bg-amber-500/20 text-amber-500',
  };

  // Default tools if data is loading
  const defaultTools = [
    {
      id: 'coingecko',
      name: 'CoinGecko',
      connected: true,
      source: 'market' as const
    },
    {
      id: 'ccxt',
      name: 'CCXT',
      connected: true,
      source: 'market' as const
    },
    {
      id: 'feargreed',
      name: 'Fear & Greed',
      connected: true,
      source: 'market' as const
    },
    {
      id: 'cryptopanic',
      name: 'CryptoPanic',
      connected: false,
      source: 'web' as const
    },
    {
      id: 'firecrawl',
      name: 'Firecrawl',
      connected: false,
      source: 'web' as const
    }
  ];

  // Use available tools if loaded, otherwise use defaults
  const tools = availableTools || defaultTools;

  return (
    <>
      {tools.map(tool => (
        <TooltipProvider key={tool.id}>
          <Tooltip>
            <TooltipTrigger>
              <Badge 
                variant="outline" 
                className={`flex items-center space-x-1 py-1 ${
                  tool.connected 
                    ? colorMap[tool.source] 
                    : 'opacity-40'
                }`}
              >
                {tool.connected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                )}
                {iconMap[tool.id as keyof typeof iconMap] || <ChartBarIcon className="h-4 w-4" />}
                <span>{tool.name}</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                {tool.connected ? 'Connected' : 'Disconnected'} {tool.name} data source
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </>
  );
}
