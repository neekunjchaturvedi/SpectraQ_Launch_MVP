import { Link, useLocation } from "react-router-dom";
import { ConnectWallet } from "@/components/web3/ConnectWallet";
import {
  ChartBarIcon,
  PlusIcon,
  UserIcon,
  CurrencyDollarIcon,
  Bars3Icon,
  XMarkIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import logo from "/logo.png";

export function Navigation() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home", icon: ChartBarIcon },
    {
      href: "/markets",
      label: "Markets",
      icon: CurrencyDollarIcon,
      badge: "Hot",
    },
    { href: "/communities", label: "Communities", icon: UserIcon },
    { href: "/portfolio", label: "Portfolio", icon: UserIcon },
    { href: "/agent", label: "Agent", icon: SparklesIcon, badge: "New" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-card/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-md logo-container flex items-center justify-center transition-all duration-300">
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

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 relative ${
                    isActive
                      ? "text-primary bg-primary/10 shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 px-1.5 py-0.2 text-[10px]"
                    >
                      {link.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </Button>
          </div>

          {/* Connect Wallet */}
          <div className="hidden lg:block">
            <ConnectWallet />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-smooth ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <Badge
                      variant="destructive"
                      className="ml-2 px-1.5 py-0.5 text-xs"
                    >
                      {link.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
            <div className="pt-2 pb-1">
              <ConnectWallet />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
