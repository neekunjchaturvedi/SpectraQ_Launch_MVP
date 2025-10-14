import { Navigation } from "@/components/layout/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  RocketLaunchIcon,
  CogIcon,
  ChartBarIcon,
  TrophyIcon,
  BanknotesIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

const LaunchingSoonBanner = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const launchDate = new Date("2025-11-30T00:00:00Z").getTime();
      const now = new Date().getTime();
      const difference = launchDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        // Launch date has passed, show "Launched!" or set to zeros
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft(); // Calculate immediately

    return () => clearInterval(timer);
  }, []);

  const isLaunched =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;
  return (
    <Card className="gradient-card border-primary/20 mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <RocketLaunchIcon className="w-10 h-10 text-primary" />
            <div>
              <h2 className="text-xl font-bold text-foreground">
                📊 Portfolio Tracking Coming Soon!
              </h2>
              <p className="text-muted-foreground">
                Advanced portfolio analytics and position management tools
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {isLaunched ? (
              <div className="text-center">
                <div className="text-2xl font-bold text-success">LIVE!</div>
                <div className="text-xs text-muted-foreground">
                  Available Now
                </div>
              </div>
            ) : (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {timeLeft.days}
                  </div>
                  <div className="text-xs text-muted-foreground">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {timeLeft.hours}
                  </div>
                  <div className="text-xs text-muted-foreground">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {timeLeft.minutes}
                  </div>
                  <div className="text-xs text-muted-foreground">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {timeLeft.seconds}
                  </div>
                  <div className="text-xs text-muted-foreground">Seconds</div>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ComingSoonStatsCard = ({
  title,
  icon,
  description,
}: {
  title: string;
  icon: React.ReactNode;
  description: string;
}) => {
  return (
    <Card className="gradient-card border-border/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
      <CardContent className="p-6 text-center relative">
        <div className="flex justify-center mb-3">
          <div className="relative">
            {icon}
            <CogIcon className="w-4 h-4 text-secondary animate-spin absolute -top-1 -right-1" />
          </div>
        </div>
        <div className="text-xl font-bold text-muted-foreground mb-2">--</div>
        <div className="text-sm text-muted-foreground mb-2">{title}</div>
        <div className="text-xs text-orange-600">{description}</div>
      </CardContent>
    </Card>
  );
};

const PositionsPlaceholder = () => {
  return (
    <Card className="gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Active Positions
          <Badge className="bg-orange-500/20 text-orange-600">
            Coming Soon
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <ChartBarIcon className="w-16 h-16 text-primary/50" />
              <CogIcon className="w-8 h-8 text-secondary animate-spin absolute -top-2 -right-2" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Position Tracking Coming Soon
          </h3>
          <p className="text-muted-foreground mb-6">
            Real-time portfolio monitoring with P&L tracking and advanced
            analytics
          </p>

          {/* Mock position cards */}
          <div className="space-y-4 max-w-2xl mx-auto">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-muted/10 border-border/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 text-left">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2 animate-pulse" />
                      <div className="flex items-center gap-2">
                        <div className="h-6 bg-primary/20 rounded px-3 py-1 animate-pulse w-12" />
                        <div className="h-3 bg-muted rounded w-24 animate-pulse" />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-5 bg-muted rounded w-16 mb-1 animate-pulse" />
                      <div className="h-4 bg-success/20 rounded w-20 animate-pulse" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const HistoryPlaceholder = () => {
  return (
    <Card className="gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Transaction History
          <Badge className="bg-orange-500/20 text-orange-600">
            Coming Soon
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <ClockIcon className="w-16 h-16 text-primary/50" />
              <CogIcon className="w-8 h-8 text-secondary animate-spin absolute -top-2 -right-2" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Transaction History Coming Soon
          </h3>
          <p className="text-muted-foreground mb-6">
            Complete trading history with detailed analytics and performance
            metrics
          </p>

          {/* Mock transaction cards */}
          <div className="space-y-4 max-w-2xl mx-auto">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-muted/10 border-border/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-6 bg-primary/20 rounded px-3 py-1 animate-pulse w-12" />
                      <div>
                        <div className="h-4 bg-muted rounded w-32 mb-1 animate-pulse" />
                        <div className="h-3 bg-muted rounded w-20 animate-pulse" />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-4 bg-muted rounded w-16 mb-1 animate-pulse" />
                      <div className="h-3 bg-muted rounded w-24 animate-pulse" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const RewardsPlaceholder = () => {
  return (
    <Card className="gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Claimable Rewards
          <Badge className="bg-orange-500/20 text-orange-600">
            Coming Soon
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <TrophyIcon className="w-16 h-16 text-primary/50" />
              <CogIcon className="w-8 h-8 text-secondary animate-spin absolute -top-2 -right-2" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Rewards System Coming Soon
          </h3>
          <p className="text-muted-foreground mb-6">
            Earn rewards for trading accuracy, volume, and community
            participation
          </p>

          {/* Feature preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-6">
            <div className="bg-muted/10 rounded-lg p-4">
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-medium text-foreground">
                Accuracy Rewards
              </div>
              <div className="text-sm text-muted-foreground">
                Get rewarded for correct predictions
              </div>
            </div>
            <div className="bg-muted/10 rounded-lg p-4">
              <div className="text-2xl mb-2">💎</div>
              <div className="font-medium text-foreground">Volume Bonuses</div>
              <div className="text-sm text-muted-foreground">
                Higher trading volume = better rewards
              </div>
            </div>
            <div className="bg-muted/10 rounded-lg p-4">
              <div className="text-2xl mb-2">👑</div>
              <div className="font-medium text-foreground">Loyalty Program</div>
              <div className="text-sm text-muted-foreground">
                Long-term participation benefits
              </div>
            </div>
          </div>

          <Button className="btn-quantum" disabled>
            <TrophyIcon className="w-4 h-4 mr-2" />
            Claim Rewards
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const UpcomingFeatures = () => {
  return (
    <Card className="gradient-card border-border/50 mb-8">
      <CardHeader>
        <CardTitle>Portfolio Features Coming Soon</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted/20 rounded-lg">
            <ChartBarIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h4 className="font-medium text-foreground mb-1">Real-time P&L</h4>
            <p className="text-sm text-muted-foreground">
              Live profit & loss tracking
            </p>
          </div>
          <div className="text-center p-4 bg-muted/20 rounded-lg">
            <BanknotesIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h4 className="font-medium text-foreground mb-1">
              Auto-settlements
            </h4>
            <p className="text-sm text-muted-foreground">
              Automatic position settlements
            </p>
          </div>
          <div className="text-center p-4 bg-muted/20 rounded-lg">
            <TrophyIcon className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h4 className="font-medium text-foreground mb-1">
              Performance Analytics
            </h4>
            <p className="text-sm text-muted-foreground">
              Detailed trading insights
            </p>
          </div>
          <div className="text-center p-4 bg-muted/20 rounded-lg">
            <UserIcon className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <h4 className="font-medium text-foreground mb-1">Social Trading</h4>
            <p className="text-sm text-muted-foreground">Follow top traders</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const NotifyForm = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    setIsSubmitted(true);
    setEmail("");
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <Card className="gradient-card border-border/50 mb-8">
      <CardContent className="p-6 text-center">
        <h3 className="text-lg font-bold text-foreground mb-4">
          Get Early Access to Portfolio Features
        </h3>
        <p className="text-muted-foreground mb-6">
          Be the first to try our advanced portfolio management tools
        </p>

        {!isSubmitted ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" className="btn-quantum">
              Notify Me
            </Button>
          </form>
        ) : (
          <div className="text-green-600 font-medium">
            ✅ Thanks! We'll notify you when portfolio features launch.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Portfolio</h1>
          <p className="text-lg text-muted-foreground">
            Track your positions and performance across all markets
          </p>
        </div>

        {/* Launching Soon Banner */}
        <LaunchingSoonBanner />

        {/* Upcoming Features */}
        <UpcomingFeatures />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <ComingSoonStatsCard
            title="Total Value"
            icon={<BanknotesIcon className="w-8 h-8 text-primary" />}
            description="Real-time portfolio value"
          />
          <ComingSoonStatsCard
            title="Total P&L"
            icon={<ArrowTrendingUpIcon className="w-8 h-8 text-green-500" />}
            description="Profit & loss tracking"
          />
          <ComingSoonStatsCard
            title="Win Rate"
            icon={<TrophyIcon className="w-8 h-8 text-purple-500" />}
            description="Success rate analytics"
          />
          <ComingSoonStatsCard
            title="Active Positions"
            icon={<ChartBarIcon className="w-8 h-8 text-blue-500" />}
            description="Current market positions"
          />
        </div>

        {/* Notify Form */}
        <NotifyForm />

        {/* Main Content */}
        <Tabs defaultValue="positions" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-card border-border opacity-75">
            <TabsTrigger value="positions" className="text-foreground" disabled>
              Positions
            </TabsTrigger>
            <TabsTrigger value="history" className="text-foreground" disabled>
              History
            </TabsTrigger>
            <TabsTrigger value="rewards" className="text-foreground" disabled>
              Rewards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="positions" className="mt-6">
            <PositionsPlaceholder />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <HistoryPlaceholder />
          </TabsContent>

          <TabsContent value="rewards" className="mt-6">
            <RewardsPlaceholder />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Portfolio;
