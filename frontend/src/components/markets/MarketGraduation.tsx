import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { CONTRACT_ADDRESSES, MARKET_ABI } from '@/lib/contracts';
import { CheckCircleIcon, ClockIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { useToast } from '@/hooks/use-toast';

interface MarketGraduationProps {
  marketId: string;
  canGraduate: boolean;
  liquidityThreshold: number;
  currentLiquidity: number;
  volumeThreshold: number;
  currentVolume: number;
  timeThreshold: number;
  marketAge: number;
}

export function MarketGraduation({
  marketId,
  canGraduate,
  liquidityThreshold,
  currentLiquidity,
  volumeThreshold,
  currentVolume,
  timeThreshold,
  marketAge
}: MarketGraduationProps) {
  const [isGraduating, setIsGraduating] = useState(false);
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const { toast } = useToast();

  const liquidityProgress = Math.min((currentLiquidity / liquidityThreshold) * 100, 100);
  const volumeProgress = Math.min((currentVolume / volumeThreshold) * 100, 100);
  const timeProgress = Math.min((marketAge / timeThreshold) * 100, 100);

  const handleGraduation = () => {
    if (!address || !canGraduate) return;
    
    setIsGraduating(true);
    try {
      writeContract({
        address: CONTRACT_ADDRESSES.MARKET as `0x${string}`,
        abi: MARKET_ABI,
        functionName: 'graduateMarket',
        args: [BigInt(marketId)],
      });
      
      toast({
        title: "Market Graduation Initiated",
        description: "The market graduation process has been started successfully.",
      });
    } catch (error) {
      console.error('Graduation failed:', error);
      toast({
        title: "Graduation Failed",
        description: "Failed to graduate the market. Please try again.",
        variant: "destructive",
      });
    }
    setIsGraduating(false);
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount.toFixed(0)}`;
  };

  const formatTime = (hours: number) => {
    if (hours >= 24) return `${Math.floor(hours / 24)} days`;
    return `${hours} hours`;
  };

  return (
    <Card className="gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrophyIcon className="w-5 h-5" />
          <span>Market Graduation</span>
          {canGraduate && (
            <Badge className="bg-success text-success-foreground">
              <CheckCircleIcon className="w-3 h-3 mr-1" />
              Ready
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-sm text-muted-foreground">
          Graduate this market to the main trading pool for increased visibility and liquidity.
        </div>

        {/* Graduation Requirements */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Minimum Liquidity</span>
              <span className={liquidityProgress >= 100 ? 'text-success' : 'text-foreground'}>
                {formatCurrency(currentLiquidity)} / {formatCurrency(liquidityThreshold)}
              </span>
            </div>
            <Progress value={liquidityProgress} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Minimum Volume</span>
              <span className={volumeProgress >= 100 ? 'text-success' : 'text-foreground'}>
                {formatCurrency(currentVolume)} / {formatCurrency(volumeThreshold)}
              </span>
            </div>
            <Progress value={volumeProgress} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Market Age</span>
              <span className={timeProgress >= 100 ? 'text-success' : 'text-foreground'}>
                {formatTime(marketAge)} / {formatTime(timeThreshold)}
              </span>
            </div>
            <Progress value={timeProgress} className="h-2" />
          </div>
        </div>

        {/* Graduation Benefits */}
        <div className="bg-muted/20 border border-border/50 rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-2">Graduation Benefits</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Enhanced visibility in main markets</li>
            <li>• Access to deeper liquidity pools</li>
            <li>• Reduced trading fees for participants</li>
            <li>• Priority in market recommendations</li>
          </ul>
        </div>

        {/* Graduation Action */}
        {canGraduate ? (
          <Button 
            className="w-full btn-quantum"
            onClick={handleGraduation}
            disabled={!address || isGraduating}
          >
            {isGraduating ? (
              <>
                <ClockIcon className="w-4 h-4 mr-2 animate-spin" />
                Graduating Market...
              </>
            ) : (
              <>
                <TrophyIcon className="w-4 h-4 mr-2" />
                Graduate Market
              </>
            )}
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="w-full btn-outline-quantum"
            disabled
          >
            Requirements Not Met
          </Button>
        )}

        {!address && (
          <p className="text-xs text-muted-foreground text-center">
            Connect your wallet to graduate markets
          </p>
        )}
      </CardContent>
    </Card>
  );
}