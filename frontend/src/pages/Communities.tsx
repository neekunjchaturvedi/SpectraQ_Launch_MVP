import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  RocketLaunchIcon,
  ClockIcon,
  CogIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { COMMUNITIES } from "@/lib/contracts";
import { useAccount } from "wagmi";
import Swal from "sweetalert2";
import axios from "axios";

const ComingSoonMarketCard = ({ category }: { category?: string }) => {
  return (
    <Card className="gradient-card border-border/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
      <CardContent className="p-6 text-center relative">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <CogIcon className="w-10 h-10 text-primary animate-spin" />
            <SparklesIcon className="w-4 h-4 text-secondary absolute -top-1 -right-1" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {category ? `${category} Market` : "Market"} Coming Soon
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          We're crafting amazing prediction markets for this community.
        </p>
        <div className="flex items-center justify-center text-xs text-muted-foreground">
          <ClockIcon className="w-3 h-3 mr-1" />
          Launch: Q1 2025
        </div>
      </CardContent>
    </Card>
  );
};

const CommunityChatPlaceholder = ({
  communityName,
}: {
  communityName: string;
}) => {
  return (
    <Card className="gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2 text-primary" />
          {communityName} Chat
          <Badge className="ml-2 bg-orange-500/20 text-orange-600">
            Coming Soon
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <ChatBubbleLeftRightIcon className="w-12 h-12 text-primary/50" />
              <CogIcon className="w-6 h-6 text-secondary animate-spin absolute -top-1 -right-1" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Community Chat Coming Soon
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Real-time discussions and market insights will be available here
          </p>
          <div className="bg-muted/20 rounded-lg p-4 space-y-3">
            <div className="text-left space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary/20 rounded-full animate-pulse" />
                <div className="h-4 bg-muted rounded flex-1 animate-pulse" />
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-secondary/20 rounded-full animate-pulse" />
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary/20 rounded-full animate-pulse" />
                <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
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
      const launchDate = new Date("2025-10-31T00:00:00Z").getTime();
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
                {isLaunched
                  ? "🎉 Communities Launched!"
                  : "🚀 Communities Launching Soon!"}
              </h2>
              <p className="text-muted-foreground">
                {isLaunched
                  ? "Interactive prediction communities are now live with real-time chat and specialized markets"
                  : "Interactive prediction communities with real-time chat and specialized markets"}
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

const UpcomingFeatures = () => {
  const features = [
    {
      icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
      title: "Real-time Chat",
      description: "Discuss strategies and insights with community members",
      color: "text-blue-500",
    },
    {
      icon: <UserGroupIcon className="w-6 h-6" />,
      title: "Expert Moderators",
      description: "Community leaders providing market analysis and guidance",
      color: "text-green-500",
    },
    {
      icon: <SparklesIcon className="w-6 h-6" />,
      title: "Exclusive Markets",
      description: "Community-specific prediction markets and competitions",
      color: "text-purple-500",
    },
  ];

  return (
    <Card className="gradient-card border-border/50 mb-6">
      <CardHeader>
        <CardTitle>What's Coming to Communities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-4 bg-muted/20 rounded-lg">
              <div className={`flex justify-center mb-3 ${feature.color}`}>
                {feature.icon}
              </div>
              <h4 className="font-medium text-foreground mb-2">
                {feature.title}
              </h4>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const NotifyForm = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const VITE_API_BASE_URL = import.meta.env.VITE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${VITE_API_BASE_URL}/api/sendEmail`, {
        email,
      });

      // ✅ Show success alert
      Swal.fire({
        icon: "success",
        title: "Subscribed!",
        text: res.data?.message || "Email added successfully!",
        timer: 2500,
        showConfirmButton: false,
        theme: "dark",
      });

      console.log("Email submitted:", email);
      setIsSubmitted(true);
      setEmail("");
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (err: any) {
      console.log(err);

      // ❌ Show error alert
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text:
          err.response?.data?.message ||
          "Something went wrong. Please try again later.",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  return (
    <Card className="gradient-card border-border/50">
      <CardContent className="p-6 text-center">
        <h3 className="text-lg font-bold text-foreground mb-4">
          Get Early Access to Communities
        </h3>
        <p className="text-muted-foreground mb-6">
          Be the first to join prediction communities when they launch
        </p>

        {!isSubmitted ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3"
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
            ✅ Thanks! We'll notify you when communities launch.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Communities = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { address } = useAccount();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Prediction Communities
          </h1>
          <p className="text-xl text-muted-foreground">
            Join specialized communities and create prediction markets
          </p>
        </div>

        {/* Launching Soon Banner */}
        <LaunchingSoonBanner />

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Upcoming Features */}
            <UpcomingFeatures />

            {/* Community Chat Placeholder */}
            {selectedCategory && (
              <CommunityChatPlaceholder
                communityName={
                  COMMUNITIES.find((c) => c.id === selectedCategory)?.name ||
                  "Community"
                }
              />
            )}

            {/* Coming Soon Markets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ComingSoonMarketCard category="Crypto" />
              <ComingSoonMarketCard category="Gaming" />
              <ComingSoonMarketCard category="Trading" />
              <ComingSoonMarketCard category="Tech" />
              <ComingSoonMarketCard category="Sports" />
              <ComingSoonMarketCard category="AI" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Communities;
