import { Link } from "react-router-dom";
import {
  ClockIcon,
  CurrencyDollarIcon,
  UsersIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Market {
  id: string;
  title: string;
  description: string;
  category: string;
  endDate: string;
  volume: string;
  participants: number;
  yesPrice: number;
  noPrice: number;
  status: "active" | "resolved" | "upcoming";
  proposals?: Array<{
    id: string;
    title: string;
    yesPrice: number;
    noPrice: number;
    status: "active" | "resolved" | "upcoming";
  }>;
}

interface MarketCardProps {
  market: Market;
  className?: string;
}

export function MarketCard({ market, className = "" }: MarketCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-success-foreground";
      case "resolved":
        return "bg-muted text-muted-foreground";
      case "upcoming":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "crypto":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "ai":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "stocks":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "space":
        return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
      case "economics":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "tech":
        return "bg-pink-500/10 text-pink-500 border-pink-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  // Calculate time remaining
  const getTimeRemaining = () => {
    const now = new Date();
    const end = new Date(market.endDate);
    const diffTime = end.getTime() - now.getTime();

    // If time is up
    if (diffTime <= 0) return "Ended";

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 30) {
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} month${diffMonths > 1 ? "s" : ""}`;
    }

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""}`;

    const diffHours = Math.floor(
      (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""}`;

    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`;
  };

  // Check if market is trending (high volume or participants)
  const isTrending =
    market.participants > 500 ||
    parseFloat(market.volume.replace(/[^0-9.]/g, "")) > 1000;

  // Get probability text
  const getProbabilityText = (price: number) => {
    if (price >= 0.8) return "Very Likely";
    if (price >= 0.6) return "Likely";
    if (price >= 0.4) return "Uncertain";
    if (price >= 0.2) return "Unlikely";
    return "Very Unlikely";
  };

  return (
    <Link to={`/`} className={`block ${className}`}>
      <Card className="market-card border-border/50 hover:border-primary/50 overflow-hidden transition-all duration-300 h-full relative">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-quantum-gray-light/5 to-quantum-gray-light/10 z-0"></div>

        {isTrending && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-primary/10 text-primary border border-primary/30 flex items-center px-2 shadow-glow">
              <FireIcon className="w-3 h-3 mr-1" />
              Trending
            </Badge>
          </div>
        )}

        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-start justify-between">
            <Badge className={`${getStatusColor(market.status)} shadow-sm`}>
              {market.status.charAt(0).toUpperCase() + market.status.slice(1)}
            </Badge>
            <Badge
              variant="outline"
              className={`text-xs ${getCategoryColor(market.category)}`}
            >
              {market.category}
            </Badge>
          </div>
          <h3
            className="text-lg font-semibold text-foreground mt-2 group-hover:text-primary transition-colors overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {market.title}
          </h3>
          <p
            className="text-sm text-muted-foreground overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {market.description}
          </p>
        </CardHeader>

        <CardContent className="pt-0 pb-4 relative z-10">
          {/* Price indicators */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-success/10 border border-success/20 rounded-lg p-3 relative overflow-hidden">
              <div
                className="absolute bottom-0 left-0 h-1 bg-success"
                style={{ width: `${market.yesPrice * 100}%` }}
              ></div>
              <div className="text-xs text-success font-medium mb-1 flex items-center">
                YES
                {market.yesPrice > 0.6 && (
                  <ArrowTrendingUpIcon className="w-3 h-3 ml-1" />
                )}
              </div>
              <div className="text-lg font-bold text-success">
                ${market.yesPrice.toFixed(2)}
              </div>
              <div className="text-xs text-success/80 mt-1">
                {getProbabilityText(market.yesPrice)}
              </div>
            </div>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 relative overflow-hidden">
              <div
                className="absolute bottom-0 left-0 h-1 bg-destructive"
                style={{ width: `${market.noPrice * 100}%` }}
              ></div>
              <div className="text-xs text-destructive font-medium mb-1 flex items-center">
                NO
                {market.noPrice > 0.6 && (
                  <ArrowTrendingUpIcon className="w-3 h-3 ml-1" />
                )}
              </div>
              <div className="text-lg font-bold text-destructive">
                ${market.noPrice.toFixed(2)}
              </div>
              <div className="text-xs text-destructive/80 mt-1">
                {getProbabilityText(market.noPrice)}
              </div>
            </div>
          </div>

          {/* Market stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center justify-center bg-muted/30 rounded-md p-2">
              <ClockIcon className="w-4 h-4 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground">
                {getTimeRemaining()}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center bg-muted/30 rounded-md p-2">
              <CurrencyDollarIcon className="w-4 h-4 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground">
                {market.volume}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center bg-muted/30 rounded-md p-2">
              {market.proposals && market.proposals.length > 0 ? (
                <>
                  <DocumentTextIcon className="w-4 h-4 text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground">
                    {market.proposals.length} proposals
                  </span>
                </>
              ) : (
                <>
                  <UsersIcon className="w-4 h-4 text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground">
                    {market.participants}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Proposals preview for user-created markets */}
          {market.proposals && market.proposals.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border/30">
              <div className="text-xs text-muted-foreground mb-2">
                Top Proposals:
              </div>
              <div className="space-y-1">
                {market.proposals.slice(0, 2).map((proposal) => (
                  <div
                    key={proposal.id}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-muted-foreground truncate flex-1 mr-2">
                      {proposal.title}
                    </span>
                    <div className="flex space-x-1">
                      <span className="text-success font-medium">
                        ${proposal.yesPrice.toFixed(2)}
                      </span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-destructive font-medium">
                        ${proposal.noPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
                {market.proposals.length > 2 && (
                  <div className="text-xs text-muted-foreground text-center pt-1">
                    +{market.proposals.length - 2} more proposals
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>

        {/* <CardFooter className="pt-0 pb-4 px-4 relative z-10">
          <Button
            variant="ghost"
            disabled
            className="w-full text-sm h-9 hover:bg-primary/10 hover:text-primary"
          >
            Trade Now
          </Button>
        </CardFooter> */}
      </Card>
    </Link>
  );
}
