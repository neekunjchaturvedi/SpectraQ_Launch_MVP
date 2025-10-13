import { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { SpectraQAgent } from "@/components/agent/SpectraQAgent";
import { AgentProvider } from "@/providers/AgentProvider";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Navigation } from "@/components/layout/Navigation";

// Create a client
const queryClient = new QueryClient();

export default function AgentPage(): ReactElement {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <>
      <Navigation />
      <div className="container pt-28 pb-8">
        {/* Header with Back Button */}

        <div className="grid grid-cols-1 gap-4">
          <Card className="p-0 overflow-hidden">
            <QueryClientProvider client={queryClient}>
              <AgentProvider>
                <SpectraQAgent />
              </AgentProvider>
            </QueryClientProvider>
          </Card>
        </div>
      </div>
    </>
  );
}
