import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect, useRef } from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

interface AdvancedChartProps {
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

interface PricePoint {
  date: string;
  timestamp: number;
  yesPrice: number;
  noPrice: number;
  volume: number;
}

export function AdvancedChart({ marketId, proposals }: AdvancedChartProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
  const [hoveredPoint, setHoveredPoint] = useState<PricePoint | null>(null);
  const chartRef = useRef<SVGSVGElement>(null);

  // Generate sophisticated price history data
  useEffect(() => {
    const generateAdvancedData = () => {
      const periods = selectedTimeframe === '24h' ? 24 : selectedTimeframe === '7d' ? 7 * 24 : selectedTimeframe === '30d' ? 30 * 4 : 90 * 4;
      const intervalHours = selectedTimeframe === '24h' ? 1 : selectedTimeframe === '7d' ? 1 : selectedTimeframe === '30d' ? 6 : 24;
      
      const data: PricePoint[] = [];
      const basePrice = proposals.length > 0 ? proposals[0].yesPrice : 0.5;
      let currentPrice = basePrice;
      
      for (let i = periods; i >= 0; i--) {
        const date = new Date();
        date.setHours(date.getHours() - (i * intervalHours));
        
        // Create realistic market dynamics
        const timeProgress = (periods - i) / periods;
        const marketEvent = Math.sin(timeProgress * Math.PI * 4) * 0.05; // Market events
        const randomWalk = (Math.random() - 0.5) * 0.03; // Random price movement
        const reversion = (0.5 - currentPrice) * 0.02; // Mean reversion
        const weekendEffect = date.getDay() === 0 || date.getDay() === 6 ? -0.01 : 0; // Weekend effect
        
        // Apply price movement with constraints
        currentPrice = Math.max(0.05, Math.min(0.95, 
          currentPrice + marketEvent + randomWalk + reversion + weekendEffect
        ));
        
        const volume = Math.random() * 1000000 + 100000; // Random volume
        
        data.push({
          date: date.toISOString(),
          timestamp: date.getTime(),
          yesPrice: Number(currentPrice.toFixed(4)),
          noPrice: Number((1 - currentPrice).toFixed(4)),
          volume: volume
        });
      }
      
      return data.reverse();
    };

    setPriceHistory(generateAdvancedData());
  }, [selectedTimeframe, proposals]);

  const currentPrice = priceHistory.length > 0 ? priceHistory[priceHistory.length - 1] : null;
  const previousPrice = priceHistory.length > 1 ? priceHistory[priceHistory.length - 2] : null;
  const priceChange = currentPrice && previousPrice ? currentPrice.yesPrice - previousPrice.yesPrice : 0;
  const priceChangePercent = previousPrice ? ((priceChange / previousPrice.yesPrice) * 100) : 0;

  // Chart dimensions
  const chartWidth = 600;
  const chartHeight = 300;
  const padding = { top: 20, right: 80, bottom: 40, left: 60 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Scales
  const minPrice = Math.min(...priceHistory.map(p => Math.min(p.yesPrice, p.noPrice))) - 0.05;
  const maxPrice = Math.max(...priceHistory.map(p => Math.max(p.yesPrice, p.noPrice))) + 0.05;
  
  const xScale = (index: number) => padding.left + (index / (priceHistory.length - 1)) * innerWidth;
  const yScale = (price: number) => padding.top + ((maxPrice - price) / (maxPrice - minPrice)) * innerHeight;

  const formatTime = (date: string) => {
    const d = new Date(date);
    if (selectedTimeframe === '24h') {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!chartRef.current) return;
    
    const rect = chartRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const relativeX = x - padding.left;
    
    if (relativeX >= 0 && relativeX <= innerWidth) {
      const index = Math.round((relativeX / innerWidth) * (priceHistory.length - 1));
      if (index >= 0 && index < priceHistory.length) {
        setHoveredPoint(priceHistory[index]);
      }
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  return (
    <Card className="gradient-card border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Advanced Price Analysis</CardTitle>
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
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-muted-foreground">
              YES ${(hoveredPoint || currentPrice)?.yesPrice.toFixed(3)}
            </span>
            {priceChange !== 0 && !hoveredPoint && (
              <div className={`flex items-center space-x-1 ${priceChange > 0 ? 'text-success' : 'text-destructive'}`}>
                {priceChange > 0 ? (
                  <ArrowTrendingUpIcon className="w-3 h-3" />
                ) : (
                  <ArrowTrendingDownIcon className="w-3 h-3" />
                )}
                <span className="text-xs">{priceChangePercent.toFixed(2)}%</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-destructive rounded-full"></div>
            <span className="text-muted-foreground">
              NO ${(hoveredPoint || currentPrice)?.noPrice.toFixed(3)}
            </span>
          </div>
          {hoveredPoint && (
            <div className="text-xs text-muted-foreground">
              {formatTime(hoveredPoint.date)}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <svg
            ref={chartRef}
            width={chartWidth}
            height={chartHeight}
            className="w-full h-auto border border-border/20 rounded-lg bg-card"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Grid lines */}
            <defs>
              <pattern id="advancedGrid" width="50" height="30" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground/10"/>
              </pattern>
              {/* Area gradients */}
              <linearGradient id="yesAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: 'hsl(var(--success))', stopOpacity: 0.2}} />
                <stop offset="100%" style={{stopColor: 'hsl(var(--success))', stopOpacity: 0.02}} />
              </linearGradient>
              <linearGradient id="noAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: 'hsl(var(--destructive))', stopOpacity: 0.2}} />
                <stop offset="100%" style={{stopColor: 'hsl(var(--destructive))', stopOpacity: 0.02}} />
              </linearGradient>
            </defs>
            
            <rect width={chartWidth} height={chartHeight} fill="url(#advancedGrid)" />
            
            {/* Y-axis */}
            <line x1={padding.left} y1={padding.top} x2={padding.left} y2={chartHeight - padding.bottom} 
                  stroke="currentColor" strokeWidth="1" className="text-muted-foreground/40" />
            
            {/* X-axis */}
            <line x1={padding.left} y1={chartHeight - padding.bottom} x2={chartWidth - padding.right} y2={chartHeight - padding.bottom} 
                  stroke="currentColor" strokeWidth="1" className="text-muted-foreground/40" />
            
            {/* Y-axis labels */}
            {[0.25, 0.5, 0.75, 1.0].map((price) => (
              <g key={price}>
                <line x1={padding.left - 5} y1={yScale(price)} x2={padding.left} y2={yScale(price)} 
                      stroke="currentColor" strokeWidth="1" className="text-muted-foreground/40" />
                <text x={padding.left - 10} y={yScale(price) + 3} textAnchor="end" 
                      className="text-xs text-muted-foreground">${price.toFixed(2)}</text>
              </g>
            ))}
            
            {/* Price areas */}
            {priceHistory.length > 1 && (
              <>
                {/* YES area */}
                <path
                  fill="url(#yesAreaGradient)"
                  d={`M ${xScale(0)} ${chartHeight - padding.bottom} ${priceHistory
                    .map((point, index) => `L ${xScale(index)} ${yScale(point.yesPrice)}`)
                    .join(' ')} L ${xScale(priceHistory.length - 1)} ${chartHeight - padding.bottom} Z`}
                />
                
                {/* Price lines */}
                <path
                  fill="none"
                  stroke="hsl(var(--success))"
                  strokeWidth="2.5"
                  d={`M ${priceHistory
                    .map((point, index) => `${xScale(index)},${yScale(point.yesPrice)}`)
                    .join(' L ')}`}
                />
                
                <path
                  fill="none"
                  stroke="hsl(var(--destructive))"
                  strokeWidth="2.5"
                  d={`M ${priceHistory
                    .map((point, index) => `${xScale(index)},${yScale(point.noPrice)}`)
                    .join(' L ')}`}
                />
              </>
            )}
            
            {/* Hover indicator */}
            {hoveredPoint && (
              <g>
                <line 
                  x1={xScale(priceHistory.indexOf(hoveredPoint))} 
                  y1={padding.top} 
                  x2={xScale(priceHistory.indexOf(hoveredPoint))} 
                  y2={chartHeight - padding.bottom} 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  strokeDasharray="4,4" 
                  className="text-muted-foreground/60"
                />
                <circle 
                  cx={xScale(priceHistory.indexOf(hoveredPoint))} 
                  cy={yScale(hoveredPoint.yesPrice)} 
                  r="4" 
                  fill="hsl(var(--success))" 
                  stroke="hsl(var(--background))" 
                  strokeWidth="2"
                />
                <circle 
                  cx={xScale(priceHistory.indexOf(hoveredPoint))} 
                  cy={yScale(hoveredPoint.noPrice)} 
                  r="4" 
                  fill="hsl(var(--destructive))" 
                  stroke="hsl(var(--background))" 
                  strokeWidth="2"
                />
              </g>
            )}
          </svg>
        </div>
        
        {/* Volume indicator */}
        <div className="mt-4 p-3 bg-muted/20 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">24h Volume</span>
            <span className="font-medium text-foreground">
              ${(hoveredPoint?.volume || currentPrice?.volume || 0).toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-muted/30 rounded-full h-1 mt-2">
            <div 
              className="bg-primary h-1 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min(100, ((hoveredPoint?.volume || currentPrice?.volume || 0) / 2000000) * 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
