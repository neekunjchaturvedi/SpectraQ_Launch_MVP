import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  UsersIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface MarketStatsProps {
  market: {
    id: string;
    title: string;
    volume: string;
    participants: number;
    yesPrice: number;
    noPrice: number;
    proposals?: Array<{
      id: string;
      title: string;
      yesPrice: number;
      noPrice: number;
      volume: string;
      participants: number;
      status: 'active' | 'resolved' | 'upcoming';
    }>;
  };
}

export function MarketStats({ market }: MarketStatsProps) {
  // Calculate aggregate statistics
  const totalProposals = market.proposals?.length || 0;
  const activeProposals = market.proposals?.filter(p => p.status === 'active').length || 0;
  const resolvedProposals = market.proposals?.filter(p => p.status === 'resolved').length || 0;
  
  // Calculate average confidence (average YES price across all proposals)
  const averageConfidence = market.proposals?.length 
    ? (market.proposals.reduce((sum, p) => sum + p.yesPrice, 0) / market.proposals.length) 
    : market.yesPrice;

  // Calculate trend (comparing current price to middle point)
  const trend = averageConfidence > 0.5 ? 'up' : 'down';
  const trendStrength = Math.abs(averageConfidence - 0.5) * 2; // 0-1 scale

  // Calculate total proposal volume
  const totalProposalVolume = market.proposals?.reduce((sum, p) => {
    const volume = parseFloat(p.volume.replace(/[^0-9.]/g, '')) || 0;
    return sum + volume;
  }, 0) || 0;

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `$${(volume / 1000).toFixed(1)}K`;
    }
    return `$${volume.toFixed(0)}`;
  };

  const getTrendColor = (trend: string, strength: number) => {
    const opacity = Math.max(0.3, strength);
    return trend === 'up' 
      ? `text-success` 
      : `text-destructive`;
  };

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 0.8) return { level: 'Very High', color: 'text-success' };
    if (confidence >= 0.6) return { level: 'High', color: 'text-success' };
    if (confidence >= 0.4) return { level: 'Moderate', color: 'text-warning' };
    if (confidence >= 0.2) return { level: 'Low', color: 'text-destructive' };
    return { level: 'Very Low', color: 'text-destructive' };
  };

  const confidenceInfo = getConfidenceLevel(averageConfidence);

  return (
    <Card className="gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ChartBarIcon className="w-5 h-5 mr-2" />
          Market Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Total Volume */}
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <CurrencyDollarIcon className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">Total Volume</div>
            <div className="text-lg font-semibold text-foreground">
              {totalProposalVolume > 0 ? formatVolume(totalProposalVolume) : market.volume}
            </div>
          </div>

          {/* Total Participants */}
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <UsersIcon className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">Participants</div>
            <div className="text-lg font-semibold text-foreground">{market.participants}</div>
          </div>

          {/* Average Confidence */}
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            {trend === 'up' ? (
              <ArrowTrendingUpIcon className={`w-5 h-5 mx-auto mb-2 ${getTrendColor(trend, trendStrength)}`} />
            ) : (
              <ArrowTrendingDownIcon className={`w-5 h-5 mx-auto mb-2 ${getTrendColor(trend, trendStrength)}`} />
            )}
            <div className="text-sm text-muted-foreground">Avg. Confidence</div>
            <div className={`text-lg font-semibold ${confidenceInfo.color}`}>
              {(averageConfidence * 100).toFixed(1)}%
            </div>
          </div>

          {/* Active Proposals */}
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <ClockIcon className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">Active</div>
            <div className="text-lg font-semibold text-foreground">{activeProposals}</div>
          </div>
        </div>

        {/* Proposal Status Breakdown */}
        {totalProposals > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Proposal Status</h4>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-muted/20 rounded-full h-2">
                <div 
                  className="bg-success h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(activeProposals / totalProposals) * 100}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground min-w-[60px]">
                {activeProposals}/{totalProposals} active
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span className="text-muted-foreground">Active ({activeProposals})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-muted rounded-full" />
                <span className="text-muted-foreground">Resolved ({resolvedProposals})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-warning rounded-full" />
                <span className="text-muted-foreground">
                  Upcoming ({totalProposals - activeProposals - resolvedProposals})
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Market Sentiment */}
        <div className="mt-4 p-3 bg-muted/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-foreground">Market Sentiment</div>
              <div className={`text-lg font-semibold ${confidenceInfo.color}`}>
                {confidenceInfo.level}
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={`${confidenceInfo.color} border-current`}
            >
              {trend === 'up' ? '↗' : '↘'} {(trendStrength * 100).toFixed(0)}% confidence
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
