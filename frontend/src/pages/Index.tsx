import { Navigation } from "@/components/layout/Navigation";
import { MarketCard } from "@/components/markets/MarketCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowRightIcon,
  ChartBarSquareIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  BoltIcon,
  ChartPieIcon,
  ArrowTrendingUpIcon,
  LockClosedIcon,
  RocketLaunchIcon,
  ClockIcon,
  CalendarIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import logo from "@/assets/logo.jpg";

// Mock data for demonstration - coming soon markets
const upcomingMarkets = [
  {
    id: "1",
    title: "Will AVAX Reach $40 By End Of Nov 2025?",
    description:
      "Prediction market for Avalanche (AVAX) price reaching $40 by November 31, 2025.",
    category: "Crypto",
    endDate: "2025-10-31T23:59:00",
    volume: "$383.7K",
    participants: 5,
    yesPrice: 0.6,
    noPrice: 0.4,
    status: "upcoming" as const,
  },
  {
    id: "2",
    title:
      "$ARENA Will Be The Third Coin To Hit $100M Market Cap On Avalanche?",
    description:
      "Prediction market for $ARENA reaching $100M market cap on the Avalanche network by December 31, 2025.",
    category: "Crypto",
    endDate: "2025-12-31T23:59:00",
    volume: "$63.8K",
    participants: 2,
    yesPrice: 0.69,
    noPrice: 0.31,
    status: "upcoming" as const,
  },
  {
    id: "3",
    title: "Will ETH Cross $5000 In 2025?",
    description:
      "Prediction market for Ethereum (ETH) surpassing $5000 by the end of 2025.",
    category: "Crypto",
    endDate: "2025-12-31T20:32:00",
    volume: "$24.4K",
    participants: 0,
    yesPrice: 0.5,
    noPrice: 0.5,
    status: "upcoming" as const,
  },
  {
    id: "4",
    title:
      "Will TikTok Be Acquired By Larry Ellison/Oracle By December 31, 2026?",
    description:
      "Prediction market for the acquisition of TikTok by Oracle (Larry Ellison) by the end of 2026.",
    category: "Tech",
    endDate: "2026-02-20T20:48:00",
    volume: "$20.3K",
    participants: 0,
    yesPrice: 0.48,
    noPrice: 0.52,
    status: "upcoming" as const,
  },
];

const mvpStats = [
  {
    name: "Launch Date",
    value: "Nov 31",
    icon: RocketLaunchIcon,
    change: "2025",
  },
  {
    name: "Beta Testers",
    value: "500+",
    icon: UsersIcon,
    change: "Registered",
  },
  {
    name: "Markets Ready",
    value: "25+",
    icon: ChartBarSquareIcon,
    change: "Day One",
  },
];

const features = [
  {
    icon: RocketLaunchIcon,
    title: "Prediction Markets",
    description:
      "Create and trade on real-world events with our intuitive prediction market platform.",
  },
  {
    icon: LightBulbIcon,
    title: "Smart Communities",
    description:
      "Join specialized prediction communities and collaborate with like-minded traders.",
  },
  {
    icon: BoltIcon,
    title: "Fast Trading",
    description:
      "Lightning-fast market execution with real-time price updates and instant confirmations.",
  },
  {
    icon: ShieldCheckIcon,
    title: "AI Agent Assistant",
    description:
      "SpectraQ AI provides market insights, analysis, and personalized trading recommendations.",
  },
];

const categories = [
  {
    name: "Crypto",
    count: "Coming Soon",
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  {
    name: "Politics",
    count: "Coming Soon",
    color: "bg-red-500/10 text-red-500 border-red-500/20",
  },
  {
    name: "Economics",
    count: "Coming Soon",
    color: "bg-green-500/10 text-green-500 border-green-500/20",
  },
  {
    name: "Sports",
    count: "Coming Soon",
    color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  {
    name: "Technology",
    count: "Coming Soon",
    color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  },
  {
    name: "Entertainment",
    count: "Coming Soon",
    color: "bg-pink-500/10 text-pink-500 border-pink-500/20",
  },
];

const CountdownTimer = () => {
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
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div
          key={unit}
          className="text-center bg-card/80 rounded-lg p-3 border border-primary/20"
        >
          <div className="text-2xl md:text-3xl font-bold text-primary">
            {value}
          </div>
          <div className="text-xs uppercase text-muted-foreground">{unit}</div>
        </div>
      ))}
    </div>
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
    <div className="max-w-md mx-auto">
      {!isSubmitted ? (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Input
            type="email"
            placeholder="Enter your email for launch updates"
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
        <div className="text-center p-4 bg-success/10 rounded-lg border border-success/20">
          <div className="text-success font-medium">
            ✅ Thanks! We'll notify you when SpectraQ is live.
          </div>
        </div>
      )}
    </div>
  );
};

const Index = () => {
  const [daysUntilLaunch, setDaysUntilLaunch] = useState(0);

  useEffect(() => {
    const launchDate = new Date("2025-10-31T00:00:00Z");
    const now = new Date();
    const diffTime = launchDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysUntilLaunch(Math.max(0, diffDays));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Launch Banner
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border-b border-primary/30 mt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center space-x-3 text-center">
            <RocketLaunchIcon className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">
              SpectraQ MVP launching November 30th, 2025!
            </span>
            <Badge className="bg-primary text-primary-foreground">
              {daysUntilLaunch} days left
            </Badge>
          </div>
        </div>
      </div> */}

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background z-0"></div>
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-[url('/hero-grid.svg')] bg-center opacity-10 z-0"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-left lg:pr-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-6">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Launching November 31, 2025
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                The Future of{" "}
                <span className="text-primary">Prediction Markets</span> Starts
                Here
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                SpectraQ - where you can trade on real-world events and earn
                from your predictions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  className="btn-quantum px-8 py-4 text-lg group relative overflow-hidden"
                  disabled
                >
                  <span className="relative z-10 flex items-center">
                    Launching Soon
                    <RocketLaunchIcon className="w-5 h-5 ml-2" />
                  </span>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="btn-outline-quantum px-8 py-4 text-lg"
                  onClick={() =>
                    document
                      .getElementById("notify")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Get Notified
                </Button>
              </div>

              {/* Countdown Timer */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-center mb-4">
                  Launching In:
                </h3>
                <CountdownTimer />
              </div>

              <div className="grid grid-cols-3 gap-4">
                {mvpStats.map((stat, i) => (
                  <div
                    key={i}
                    className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border/50"
                  >
                    <p className="text-sm text-muted-foreground mb-1 flex items-center">
                      <stat.icon className="w-4 h-4 mr-1 text-primary" />
                      {stat.name}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-primary flex items-center">
                      {stat.change}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="relative bg-card rounded-xl border border-border/50 p-8 shadow-xl">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-red-600 rounded-xl blur opacity-20"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        Preview Market
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Will Avax reach $40 in 2025?
                      </p>
                    </div>
                    <Badge className="bg-orange-500/20 text-orange-600">
                      Coming Soon
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-success/10 border border-success/20 rounded-lg p-3 opacity-75">
                      <div className="text-xs text-success font-medium mb-1">
                        YES
                      </div>
                      <div className="text-2xl font-bold text-success">
                        $0.65
                      </div>
                      <div className="text-xs text-success/80">
                        65% probability
                      </div>
                    </div>
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 opacity-75">
                      <div className="text-xs text-destructive font-medium mb-1">
                        NO
                      </div>
                      <div className="text-2xl font-bold text-destructive">
                        $0.35
                      </div>
                      <div className="text-xs text-destructive/80">
                        35% probability
                      </div>
                    </div>
                  </div>

                  {/* <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>Available Nov 30th</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RocketLaunchIcon className="w-4 h-4" />
                      <span>MVP Launch</span>
                    </div>
                  </div> */}

                  <Button className="w-full" disabled>
                    <ClockIcon className="w-4 h-4 mr-2" />
                    Coming Soon
                  </Button>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-3xl"></div>
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* MVP Features Section */}
      <section className="py-16 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Features</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <Card
                key={i}
                className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all"
              >
                <CardContent className="pt-6">
                  <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">
              Market Categories
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, i) => (
              <div
                key={i}
                className={`border ${category.color} rounded-xl p-4 text-center opacity-75 cursor-not-allowed`}
              >
                <p className="font-bold">{category.name}</p>
                <p className="text-sm">{category.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Markets */}
      <section className="py-16 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Preview Markets
              </h2>
              <p className="text-muted-foreground mt-2">
                Sample markets coming with the MVP launch
              </p>
            </div>
            <Badge className="bg-orange-500/20 text-orange-600">
              <ClockIcon className="w-4 h-4 mr-2" />
              November 30th
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingMarkets.map((market) => (
              <div key={market.id} className="opacity-75">
                <MarketCard market={market} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notification Section */}
      <section id="notify" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <RocketLaunchIcon className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Don't Miss the Launch!
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Be among the first to experience SpectraQ when we launch.
            </p>
            <NotifyForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 rounded-md logo-container flex items-center justify-center">
                  <img
                    src={logo}
                    alt="SpectraQ Logo"
                    className="w-9 h-9 object-contain logo-image"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-foreground">
                    SpectraQ
                  </span>
                  <span className="text-xs text-primary -mt-1">
                    Prediction Markets
                  </span>
                </div>
              </Link>

              <div className="mt-4">
                <Badge className="bg-primary/20 text-primary">
                  <CalendarIcon className="w-3 h-3 mr-1" />
                  MVP: Nov 31, 2025
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">
                Launch Info
              </h3>
              <ul className="space-y-2">
                <li className="text-muted-foreground">Markets</li>
                <li className="text-muted-foreground">Communities</li>
                <li className="text-muted-foreground">Portfolio</li>
                <li className="text-muted-foreground">Agent</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">
                Resources
              </h3>
              <ul className="space-y-2">
                <li className="text-muted-foreground">Documentation (Soon)</li>
                <li className="text-muted-foreground">API (Soon)</li>
                <li className="text-muted-foreground">FAQ</li>
                <li className="text-muted-foreground">Support</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">
                Company
              </h3>
              <ul className="space-y-2">
                <li className="text-muted-foreground">About</li>
                <li className="text-muted-foreground">Blog (Coming Soon)</li>
                <li className="text-muted-foreground">Careers</li>
                <li className="text-muted-foreground">Contact</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2025 SpectraQ. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <Badge className="bg-orange-500/20 text-orange-600">
                <RocketLaunchIcon className="w-3 h-3 mr-1" />
                Launching Soon
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
