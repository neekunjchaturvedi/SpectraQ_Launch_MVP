import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { CONTRACT_ADDRESSES, MARKET_ABI } from '@/lib/contracts';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

interface TokenPricesProps {
  marketId: string;
}

export function TokenPrices({ marketId }: TokenPricesProps) {
  const [yesPrice, setYesPrice] = useState(0.65);
  const [noPrice, setNoPrice] = useState(0.35);
  const [priceChange, setPriceChange] = useState({ yes: 0.02, no: -0.02 });
  const [volume24h, setVolume24h] = useState({ yes: 125000, no: 87000 });
  const [liquidity, setLiquidity] = useState(1250000);
  
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  // Mock real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const yesChange = (Math.random() - 0.5) * 0.02;
      const newYesPrice = Math.max(0.01, Math.min(0.99, yesPrice + yesChange));
      const newNoPrice = 1 - newYesPrice;
      
      setYesPrice(newYesPrice);
      setNoPrice(newNoPrice);
      setPriceChange({ yes: yesChange, no: -yesChange });
    }, 5000);

    return () => clearInterval(interval);
  }, [yesPrice]);

  const formatPrice = (price: number) => `$${price.toFixed(3)}`;
  const formatPercentage = (pct: number) => `${(pct * 100).toFixed(1)}%`;
  const formatVolume = (vol: number) => `$${(vol / 1000).toFixed(0)}K`;

  const handleBuyYes = () => {
    if (!address) return;
    // Contract interaction for buying YES tokens
    console.log('Buying YES tokens at', formatPrice(yesPrice));
  };

  const handleBuyNo = () => {
    if (!address) return;
    // Contract interaction for buying NO tokens
    console.log('Buying NO tokens at', formatPrice(noPrice));
  };

  return (
    <div className="space-y-6">
      {/* Current Prices */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle>Token Prices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-success">YES</span>
                <div className="flex items-center space-x-1">
                  {priceChange.yes >= 0 ? (
                    <ArrowUpIcon className="w-3 h-3 text-success" />
                  ) : (
                    <ArrowDownIcon className="w-3 h-3 text-destructive" />
                  )}
                  <span className={`text-xs ${priceChange.yes >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {Math.abs(priceChange.yes * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="text-2xl font-bold text-success mb-1">
                {formatPrice(yesPrice)}
              </div>
              <div className="text-xs text-success/70">
                {formatPercentage(yesPrice)} chance
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                24h Vol: {formatVolume(volume24h.yes)}
              </div>
            </div>

            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-destructive">NO</span>
                <div className="flex items-center space-x-1">
                  {priceChange.no >= 0 ? (
                    <ArrowUpIcon className="w-3 h-3 text-success" />
                  ) : (
                    <ArrowDownIcon className="w-3 h-3 text-destructive" />
                  )}
                  <span className={`text-xs ${priceChange.no >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {Math.abs(priceChange.no * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="text-2xl font-bold text-destructive mb-1">
                {formatPrice(noPrice)}
              </div>
              <div className="text-xs text-destructive/70">
                {formatPercentage(noPrice)} chance
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                24h Vol: {formatVolume(volume24h.no)}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              className="w-full btn-quantum"
              onClick={handleBuyYes}
              disabled={!address}
            >
              Buy YES - {formatPrice(yesPrice)}
            </Button>
            <Button 
              variant="outline" 
              className="w-full btn-outline-quantum"
              onClick={handleBuyNo}
              disabled={!address}
            >
              Buy NO - {formatPrice(noPrice)}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AMM Pool Information */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle>AMM Pool Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Liquidity</span>
            <span className="font-mono text-sm font-medium">
              ${(liquidity / 1000000).toFixed(2)}M
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">24h Volume</span>
            <span className="font-mono text-sm font-medium">
              ${((volume24h.yes + volume24h.no) / 1000).toFixed(0)}K
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Pool Fee</span>
            <Badge variant="outline" className="border-quantum-gray-light">
              0.3%
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">YES/NO Ratio</span>
            <span className="font-mono text-sm font-medium">
              {(yesPrice / noPrice).toFixed(2)} : 1
            </span>
          </div>

          <div className="pt-2 border-t border-border/50">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Pool Utilization</span>
              <span className="text-foreground">
                {((volume24h.yes + volume24h.no) / liquidity * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}