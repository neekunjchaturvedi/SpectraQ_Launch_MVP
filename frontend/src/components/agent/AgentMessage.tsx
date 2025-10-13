import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import { UserIcon } from '@heroicons/react/24/outline';
import { Message } from '@/hooks/agent/types';

interface AgentMessageProps {
  message: Message;
  isStreaming?: boolean;
}

export function AgentMessage({ message, isStreaming = false }: AgentMessageProps) {
  const isUser = message.role === 'user';
  const timestamp = new Date(message.timestamp).toLocaleTimeString();

  // For tool calls, we'll display them in a special format
  const hasToolCalls = message.tool_calls && message.tool_calls.length > 0;

  console.log('Rendering message:', {
    role: message.role,
    content: message.content,
    contentLength: message.content?.length,
    hasToolCalls
  });

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start max-w-[85%]`}>
        <Avatar className={`h-8 w-8 ${isUser ? 'ml-2' : 'mr-2'} flex-shrink-0 avatar-centered ${
          isUser ? 'bg-primary text-primary-foreground' : 'bg-background border border-border'
        }`}>
          {isUser ? (
            <UserIcon className="h-4 w-4" />
          ) : (
            <img src="/logo-colored.svg" alt="SpectraQ Agent" className="w-5 h-5" />
          )}
        </Avatar>

        <div className="space-y-1">
          <Card className={`p-3 ${
            isUser 
              ? 'bg-primary text-primary-foreground'
              : 'bg-card border border-border'
          }`}>
            {message.role === 'tool' ? (
              <div className="text-xs text-muted-foreground mb-1">
                Data from: <span className="font-medium">{message.tool_name}</span>
              </div>
            ) : null}
            
            <div className={`prose prose-sm max-w-none break-words ${
              isUser ? 'text-primary-foreground' : 'text-foreground'
            }`}>
              <ReactMarkdown>
                {message.content || ''}
              </ReactMarkdown>
              
              {isStreaming && (
                <span className="inline-block animate-pulse">▌</span>
              )}
            </div>
            
            {hasToolCalls && (
              <div className="mt-2 pt-2 border-t border-border/30">
                <div className="text-xs font-medium mb-1">🔧 Retrieving data from:</div>
                <div className="flex flex-wrap gap-1">
                  {message.tool_calls?.map((tool, index) => (
                    <div key={index} className="text-xs bg-secondary/50 px-2 py-0.5 rounded-full flex items-center">
                      <span className="w-2 h-2 rounded-full bg-primary/50 mr-1 animate-pulse"></span>
                      {tool.name || tool.function?.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Tool Response Display */}
          {message.tool_name && (
            <Card className="mt-2 p-2 bg-muted/30 border-muted">
              <div className="text-xs text-muted-foreground mb-1">
                📊 Data from: <span className="font-medium text-foreground">{message.tool_name}</span>
              </div>
              <div className="text-xs font-mono bg-background/50 p-2 rounded border">
                {(() => {
                  try {
                    const data = JSON.parse(message.content.replace(/^Data from [^:]+: /, ''));
                    if (message.tool_name?.includes('get_coin_price')) {
                      return (
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Symbol:</span>
                            <span className="font-bold">{data.symbol}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Price:</span>
                            <span className="font-bold text-green-600">${data.price_usd?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>24h Change:</span>
                            <span className={`font-bold ${data.price_change_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {data.price_change_24h >= 0 ? '+' : ''}{data.price_change_24h?.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      );
                    } else if (message.tool_name?.includes('get_fear_greed_index')) {
                      return (
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Fear & Greed Index:</span>
                            <span className="font-bold">{data.index}/100</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Classification:</span>
                            <span className="font-bold">{data.classification}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Trend:</span>
                            <span className="font-bold">{data.trend}</span>
                          </div>
                        </div>
                      );
                    }
                    return <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>;
                  } catch {
                    return <span className="text-xs">{message.content}</span>;
                  }
                })()}
              </div>
            </Card>
          )}

          <div className={`text-xs text-muted-foreground ${isUser ? 'text-right' : 'text-left'}`}>
            {timestamp}
          </div>
        </div>
      </div>
    </div>
  );
}
