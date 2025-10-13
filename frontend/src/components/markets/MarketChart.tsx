import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

interface MarketChartProps {
  marketId: string;
  proposals: Array<{
    id: string;
    title: string;
    yesPrice: number;
    noPrice: number;
    volume: string;
    participants: number;
    endDate: string;
    status: 'active' | 'resolved' | 'upcoming';
  }>;
}

export function MarketChart({ marketId, proposals }: MarketChartProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [priceHistory, setPriceHistory] = useState<Array<{ date: string; yesPrice: number; noPrice: number }>>([]);

  // Generate mock price history data based on proposals
  useEffect(() => {
    const generateMockData = () => {
      const days = selectedTimeframe === '24h' ? 1 : selectedTimeframe === '7d' ? 7 : selectedTimeframe === '30d' ? 30 : 90;
      const data = [];
      
      // Use proposal data to create more realistic price movements
      const baseProposal = proposals.length > 0 ? proposals[0] : { yesPrice: 0.5, noPrice: 0.5 };
      let currentYesPrice = baseProposal.yesPrice;
      
      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Create more realistic price movements with trends
        const timeProgress = (days - i) / days;
        const volatility = 0.05; // 5% daily volatility
        const trend = Math.sin(timeProgress * Math.PI) * 0.1; // Gradual trend
        const randomWalk = (Math.random() - 0.5) * volatility;
        
        // Apply price movement
        currentYesPrice = Math.max(0.05, Math.min(0.95, currentYesPrice + trend + randomWalk));
        const noPrice = 1 - currentYesPrice;
        
        data.push({
          date: date.toISOString().split('T')[0],
          yesPrice: Number(currentYesPrice.toFixed(3)),
          noPrice: Number(noPrice.toFixed(3))
        });
      }
      
      return data;
    };

    setPriceHistory(generateMockData());
  }, [selectedTimeframe, proposals]);

  const currentYesPrice = priceHistory.length > 0 ? priceHistory[priceHistory.length - 1].yesPrice : 0.5;
  const previousYesPrice = priceHistory.length > 1 ? priceHistory[priceHistory.length - 2].yesPrice : 0.5;
  const priceChange = currentYesPrice - previousYesPrice;
  const priceChangePercent = ((priceChange / previousYesPrice) * 100).toFixed(2);

  const maxPrice = Math.max(...priceHistory.map(p => Math.max(p.yesPrice, p.noPrice)));
  const minPrice = Math.min(...priceHistory.map(p => Math.min(p.yesPrice, p.noPrice)));

  return (
    <Card className="gradient-card border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Price Chart</CardTitle>
          <div className="flex space-x-2">
            {['24h', '7d', '30d', '90d'].map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  selectedTimeframe === timeframe
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-muted-foreground">YES ${currentYesPrice.toFixed(3)}</span>
            {priceChange !== 0 && (
              <div className={`flex items-center space-x-1 ${priceChange > 0 ? 'text-success' : 'text-destructive'}`}>
                {priceChange > 0 ? (
                  <ArrowTrendingUpIcon className="w-3 h-3" />
                ) : (
                  <ArrowTrendingDownIcon className="w-3 h-3" />
                )}
                <span className="text-xs">{priceChangePercent}%</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-destructive rounded-full"></div>
            <span className="text-muted-foreground">NO ${(1 - currentYesPrice).toFixed(3)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 relative bg-muted/20 rounded-lg overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 500 250">
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="50" height="25" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 25" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground/20"/>
              </pattern>
              {/* Gradients for area fills */}
              <linearGradient id="yesGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: 'hsl(var(--success))', stopOpacity: 0.3}} />
                <stop offset="100%" style={{stopColor: 'hsl(var(--success))', stopOpacity: 0.05}} />
              </linearGradient>
              <linearGradient id="noGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: 'hsl(var(--destructive))', stopOpacity: 0.3}} />
                <stop offset="100%" style={{stopColor: 'hsl(var(--destructive))', stopOpacity: 0.05}} />
              </linearGradient>
            </defs>
            <rect width="500" height="250" fill="url(#grid)" />
            
            {/* Y-axis labels */}
            <g className="text-xs text-muted-foreground">
              <text x="10" y="25" textAnchor="start">$1.00</text>
              <text x="10" y="75" textAnchor="start">$0.75</text>
              <text x="10" y="125" textAnchor="start">$0.50</text>
              <text x="10" y="175" textAnchor="start">$0.25</text>
              <text x="10" y="225" textAnchor="start">$0.00</text>
            </g>
            
            {/* Price lines and areas */}
            {priceHistory.length > 1 && (
              <>
                {/* YES price area */}
                <path
                  fill="url(#yesGradient)"
                  d={`M 50 250 ${priceHistory
                    .map((point, index) => {
                      const x = 50 + ((index / (priceHistory.length - 1)) * 400);
                      const y = 50 + ((1 - point.yesPrice) * 150);
                      return `L ${x} ${y}`;
                    })
                    .join(' ')} L ${50 + 400} 250 Z`}
                />
                
                {/* NO price area */}
                <path
                  fill="url(#noGradient)"
                  d={`M 50 250 ${priceHistory
                    .map((point, index) => {
                      const x = 50 + ((index / (priceHistory.length - 1)) * 400);
                      const y = 50 + ((1 - point.noPrice) * 150);
                      return `L ${x} ${y}`;
                    })
                    .join(' ')} L ${50 + 400} 250 Z`}
                />
                
                {/* YES price line */}
                <polyline
                  fill="none"
                  stroke="hsl(var(--success))"
                  strokeWidth="3"
                  points={priceHistory
                    .map((point, index) => {
                      const x = 50 + ((index / (priceHistory.length - 1)) * 400);
                      const y = 50 + ((1 - point.yesPrice) * 150);
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />
                
                {/* NO price line */}
                <polyline
                  fill="none"
                  stroke="hsl(var(--destructive))"
                  strokeWidth="3"
                  points={priceHistory
                    .map((point, index) => {
                      const x = 50 + ((index / (priceHistory.length - 1)) * 400);
                      const y = 50 + ((1 - point.noPrice) * 150);
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />
                
                {/* Data points */}
                {priceHistory.map((point, index) => {
                  const x = 50 + ((index / (priceHistory.length - 1)) * 400);
                  const yYes = 50 + ((1 - point.yesPrice) * 150);
                  const yNo = 50 + ((1 - point.noPrice) * 150);
                  
                  return (
                    <g key={index}>
                      <circle cx={x} cy={yYes} r="3" fill="hsl(var(--success))" className="opacity-80" />
                      <circle cx={x} cy={yNo} r="3" fill="hsl(var(--destructive))" className="opacity-80" />
                    </g>
                  );
                })}
                
                {/* Current price indicators */}
                {priceHistory.length > 0 && (
                  <g>
                    <line 
                      x1={50 + 400} 
                      y1={50 + ((1 - priceHistory[priceHistory.length - 1].yesPrice) * 150)} 
                      x2={460} 
                      y2={50 + ((1 - priceHistory[priceHistory.length - 1].yesPrice) * 150)} 
                      stroke="hsl(var(--success))" 
                      strokeWidth="2" 
                      strokeDasharray="5,5" 
                      className="opacity-60"
                    />
                    <line 
                      x1={50 + 400} 
                      y1={50 + ((1 - priceHistory[priceHistory.length - 1].noPrice) * 150)} 
                      x2={460} 
                      y2={50 + ((1 - priceHistory[priceHistory.length - 1].noPrice) * 150)} 
                      stroke="hsl(var(--destructive))" 
                      strokeWidth="2" 
                      strokeDasharray="5,5" 
                      className="opacity-60"
                    />
                  </g>
                )}
              </>
            )}
          </svg>
        </div>
        
        {/* Proposals Performance */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-foreground mb-3">Individual Proposal Performance</h4>
          <div className="space-y-3">
            {proposals.slice(0, 5).map((proposal, index) => {
              const priceChange = Math.random() > 0.5 ? (Math.random() * 0.1) : -(Math.random() * 0.1);
              const isPositive = priceChange > 0;
              
              return (
                <div key={proposal.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/40 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{proposal.title}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                      <span>{proposal.volume} volume</span>
                      <span>{proposal.participants} participants</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          proposal.status === 'active' 
                            ? 'border-success text-success' 
                            : proposal.status === 'resolved'
                            ? 'border-muted text-muted-foreground'
                            : 'border-warning text-warning'
                        }`}
                      >
                        {proposal.status}
                      </Badge>
                      <div className={`flex items-center space-x-1 ${isPositive ? 'text-success' : 'text-destructive'}`}>
                        {isPositive ? (
                          <ArrowTrendingUpIcon className="w-3 h-3" />
                        ) : (
                          <ArrowTrendingDownIcon className="w-3 h-3" />
                        )}
                        <span className="text-xs font-medium">{(priceChange * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm font-medium text-success">YES ${proposal.yesPrice.toFixed(3)}</div>
                    <div className="text-xs text-muted-foreground">NO ${proposal.noPrice.toFixed(3)}</div>
                  </div>
                </div>
              );
            })}
            
            {proposals.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No individual proposals for this market.</p>
                <p className="text-xs mt-1">This is a simple YES/NO prediction market.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
