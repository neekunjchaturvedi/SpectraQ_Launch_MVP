import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  RocketLaunchIcon,
  ClockIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const categories = [
  "All",
  "Crypto",
  "AI",
  "Stocks",
  "Economics",
  "Politics",
  "Sports",
  "Tech",
];

const UnderDevelopmentCard = () => {
  return (
    <div className="bg-card border border-border rounded-lg p-8 text-center shadow-lg">
      <div className="flex justify-center mb-4">
        <div className="relative">
          <CogIcon className="w-12 h-12 text-primary animate-spin" />
          <RocketLaunchIcon className="w-6 h-6 text-muted-foreground absolute -top-1 -right-1" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-3">
        Market Coming Soon
      </h3>
      <p className="text-muted-foreground mb-4">
        We're building amazing prediction markets for you to trade on real-world
        events.
      </p>
      <div className="flex items-center justify-center text-sm text-muted-foreground">
        <ClockIcon className="w-4 h-4 mr-2" />
        Expected launch: Q1 2025
      </div>
    </div>
  );
};

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
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <RocketLaunchIcon className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Launching Soon!
              </h2>
              {/* <p className="text-muted-foreground">
                We're putting the finishing touches on our prediction markets
                platform
              </p> */}
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          {isLaunched ? (
            <div className="text-center">
              <div className="text-2xl font-bold text-success">LIVE!</div>
              <div className="text-xs text-muted-foreground">Available Now</div>
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
    </div>
  );
};

const FeaturePreview = () => {
  const features = [
    {
      icon: "📊",
      title: "Real-time Trading",
      description: "Trade on live prediction markets with instant execution",
    },
    {
      icon: "🔒",
      title: "Secure & Transparent",
      description: "Blockchain-based settlements with full transparency",
    },
    {
      icon: "💰",
      title: "Low Fees",
      description: "Competitive trading fees and instant withdrawals",
    },
    {
      icon: "📱",
      title: "Mobile Optimized",
      description: "Trade anywhere with our responsive platform",
    },
    {
      icon: "🎯",
      title: "Diverse Markets",
      description: "From crypto to politics, sports to economics",
    },
    {
      icon: "👥",
      title: "Community Driven",
      description: "Create and vote on new market proposals",
    },
  ];

  return (
    <div className="mb-12">
      <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
        What's Coming
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-all"
          >
            <div className="text-3xl mb-3">{feature.icon}</div>
            <h4 className="font-semibold text-foreground mb-2">
              {feature.title}
            </h4>
            <p className="text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const NotifyMeForm = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the email to your backend
    console.log("Email submitted:", email);
    setIsSubmitted(true);
    setEmail("");

    // Reset after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-8 text-center">
      <h3 className="text-xl font-bold text-foreground mb-4">
        Get Notified When We Launch
      </h3>
      <p className="text-muted-foreground mb-6">
        Be the first to know when our prediction markets go live
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
          ✅ Thanks! We'll notify you when we launch.
        </div>
      )}
    </div>
  );
};

const Markets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Prediction Markets
              </h1>
              <p className="text-lg text-muted-foreground">
                Discover and trade on real-world event outcomes
              </p>
            </div>
            {/* <Link to="/create">
              <Button className="btn-quantum" disabled>
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Market
              </Button>
            </Link> */}
          </div>
        </div>

        {/* Launching Soon Banner */}
        <LaunchingSoonBanner />

        {/* Filters (Disabled for demo) */}

        {/* Feature Preview */}
        <FeaturePreview />

        {/* Under Development Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[...Array(6)].map((_, index) => (
            <UnderDevelopmentCard key={index} />
          ))}
        </div>

        {/* Notify Me Section */}
        <NotifyMeForm />
      </div>
    </div>
  );
};

export default Markets;
