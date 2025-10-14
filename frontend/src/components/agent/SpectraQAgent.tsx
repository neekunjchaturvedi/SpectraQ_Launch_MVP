import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ChevronDownIcon,
  RocketLaunchIcon,
  CogIcon,
  SparklesIcon,
  ClockIcon,
  BoltIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { useAccount } from "wagmi";
import logo from "@/assets/logo.jpg";
import Swal from "sweetalert2";
import axios from "axios";

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
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between space-x-3">
        <div className="flex gap-5">
          <RocketLaunchIcon className="w-8 h-8 text-primary" />
          <div>
            <h3 className="font-semibold text-foreground">
              🤖 AI Agent Launching Soon!
            </h3>
            <p className="text-sm text-muted-foreground">
              Advanced crypto market analysis and predictions powered by AI
            </p>
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
        {/* <div className="ml-auto hidden sm:flex items-end space-x-2 text-sm">
          <ClockIcon className="w-4 h-4 text-primary" />
          <span className="text-primary font-medium flex justify-end">Q1 2025</span>
        </div> */}
      </div>
    </div>
  );
};

const ComingSoonMessage = ({
  type,
  delay = 0,
}: {
  type: "welcome" | "thinking" | "analysis";
  delay?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!isVisible) return null;

  const content = {
    welcome: {
      avatar: { logo },
      name: "SpectraQAgent",
      message:
        "Hello! I'm SpectraQAgent, your AI-powered crypto market analyst. I'm currently in development and will soon be able to provide real-time market insights, predictions, and analysis.",
      typing: false,
    },
    thinking: {
      avatar: "/logo-colored.svg",
      name: "SpectraQAgent",
      message: "I'm analyzing market data and preparing insights...",
      typing: true,
    },
    analysis: {
      avatar: "/logo-colored.svg",
      name: "SpectraQAgent",
      message:
        "Once launched, I'll be able to provide detailed crypto market analysis, price predictions, sentiment analysis, and much more. Stay tuned!",
      typing: false,
    },
  }[type];

  return (
    <div className="flex items-start space-x-3 animate-fade-in">
      <Avatar className="h-8 w-8 bg-primary/20 text-primary avatar-centered">
        <img src={content.avatar} alt="SpectraQ Agent" className="w-5 h-5" />
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-medium text-sm">{content.name}</span>
          <Badge className="bg-orange-500/20 text-orange-600 text-xs">
            Coming Soon
          </Badge>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 max-w-md">
          <p className="text-sm text-foreground">{content.message}</p>
          {content.typing && (
            <div className="flex items-center space-x-1 mt-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              />
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FeaturePreview = () => {
  const features = [
    {
      icon: <ChartBarIcon className="w-5 h-5" />,
      title: "Market Analysis",
      description: "Real-time crypto market insights and technical analysis",
      color: "text-blue-500",
    },
    {
      icon: <BoltIcon className="w-5 h-5" />,
      title: "Price Predictions",
      description: "AI-powered price forecasting for major cryptocurrencies",
      color: "text-yellow-500",
    },
    {
      icon: <EyeIcon className="w-5 h-5" />,
      title: "Sentiment Analysis",
      description: "Social media and news sentiment tracking",
      color: "text-green-500",
    },
    {
      icon: <CurrencyDollarIcon className="w-5 h-5" />,
      title: "Whale Tracking",
      description: "Large transaction monitoring and whale movement alerts",
      color: "text-purple-500",
    },
  ];

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-center text-muted-foreground">
        Upcoming AI Capabilities
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-muted/20 rounded-lg p-3 border border-border/50"
          >
            <div className="flex items-center space-x-2 mb-2">
              <div className={feature.color}>{feature.icon}</div>
              <span className="font-medium text-sm">{feature.title}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
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
    <Card className="p-4 bg-card/50 border-border/50">
      <div className="text-center">
        <h3 className="font-medium text-foreground mb-2">Get Early Access</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Be the first to try SpectraQAgent when it launches
        </p>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-sm"
            />
            <Button type="submit" className="w-full btn-quantum text-sm">
              Notify Me
            </Button>
          </form>
        ) : (
          <div className="text-green-600 font-medium text-sm">
            ✅ Thanks! We'll notify you when SpectraQAgent launches.
          </div>
        )}
      </div>
    </Card>
  );
};

export function SpectraQAgent() {
  const { address } = useAccount();
  const [query, setQuery] = useState("");
  const [showDemo, setShowDemo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestionQueries = [
    "What's the predicted price of Bitcoin next week?",
    "Analyze the current sentiment for Ethereum",
    "Show me the top trending crypto news today",
    "Track large whale movements in the last 24 hours",
    "Compare BTC and ETH price correlation",
    "What's the Fear & Greed index today?",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Demo mode - show coming soon message
    setShowDemo(true);
    setQuery("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Launch Banner */}
      <div className="px-4 pt-4">
        <LaunchingSoonBanner />
      </div>

      {/* Agent Messages */}
      <div className="flex-1 p-4 space-y-6">
        {!showDemo ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 avatar-centered relative">
                <img src={logo} alt="SpectraQ Agent" className="w-16 h-16" />
                <CogIcon className="w-6 h-6 text-secondary animate-spin absolute -top-1 -right-1" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Welcome to SpectraQAgent
              </h2>
              <p className="text-muted-foreground max-w-md mb-4">
                Your AI assistant for crypto market insights, predictions, and
                analysis. Currently in development - launching soon!
              </p>
              {/* <Badge className="bg-orange-500/20 text-orange-600">
                <ClockIcon className="w-3 h-3 mr-1" />
                Expected Launch: Q1 2025
              </Badge> */}
            </div>

            <div className="w-full max-w-md space-y-4">
              <FeaturePreview />

              {/* <div className="space-y-2">
                <p className="text-sm font-medium text-center mb-2">
                  Try asking about (Demo Mode):
                </p>
                {suggestionQueries.slice(0, 3).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left text-sm h-auto py-2 opacity-75"
                    onClick={() => setQuery(suggestion)}
                  >
                    <ChartBarIcon className="w-4 h-4 mr-2 text-primary" />
                    {suggestion}
                  </Button>
                ))}
              </div> */}

              <NotifyForm />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Avatar className="h-8 w-8 bg-blue-500/20 text-blue-500 avatar-centered">
                {address ? address.slice(0, 2) : "U"}
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm">You</span>
                </div>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 max-w-md">
                  <p className="text-sm text-foreground">
                    {query ||
                      "What's the predicted price of Bitcoin next week?"}
                  </p>
                </div>
              </div>
            </div>

            <ComingSoonMessage type="thinking" delay={500} />
            <ComingSoonMessage type="analysis" delay={2000} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Connected Tools Display */}
      <div className="border-t border-border py-2 px-4 opacity-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <span className="text-xs font-medium mr-2">
              Connected Data Sources
            </span>
            <Badge variant="outline" className="text-xs">
              Coming Soon
            </Badge>
          </div>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" disabled>
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {["CoinGecko", "CryptoNews", "DeFiPulse", "Whale Alert"].map(
            (tool, index) => (
              <div
                key={index}
                className="flex items-center space-x-1 bg-muted/20 rounded px-2 py-1 text-xs"
              >
                <CogIcon className="w-3 h-3 animate-spin text-primary" />
                <span>{tool}</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about crypto markets (Demo Mode - Coming Soon)..."
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!query.trim()}
            className="btn-quantum"
          >
            <ArrowUpIcon className="h-4 w-4" />
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Demo mode - actual AI responses coming soon! Try typing a question to
          see the interface.
        </p>
      </div>
    </div>
  );
}
