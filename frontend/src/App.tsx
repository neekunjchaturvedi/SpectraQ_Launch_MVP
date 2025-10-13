import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Markets from "./pages/Markets";
import MarketDetail from "./pages/MarketDetail";
import Communities from "./pages/Communities";
import CreateMarket from "./pages/CreateMarket";
import CreateProposal from "./pages/CreateProposal";
import Portfolio from "./pages/Portfolio";
import Profile from "./pages/Profile";
import Agent from "./pages/Agent";
import TestAgent from "./pages/TestAgent";
import NotFound from "./pages/NotFound";
import { Web3Provider } from "./providers/Web3Provider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Web3Provider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/markets" element={<Markets />} />
            <Route path="/markets/:id" element={<MarketDetail />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/create" element={<CreateMarket />} />
            <Route path="/markets/:id/propose" element={<CreateProposal />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/profile/:address" element={<Profile />} />
            <Route path="/agent" element={<Agent />} />
            <Route path="/test-agent" element={<TestAgent />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </Web3Provider>
  </QueryClientProvider>
);

export default App;
