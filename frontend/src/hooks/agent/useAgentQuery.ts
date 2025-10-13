import { useMutation, useQuery } from "@tanstack/react-query";
import { handleAgentQuery, getAvailableTools } from "@/lib/agent/agentService";
import { Message } from "@/hooks/agent/types";

// Hook to handle agent queries
export function useAgentQuery() {
  return useMutation({
    mutationFn: async ({
      query,
      messages,
    }: {
      query: string;
      messages: Message[];
    }) => {
      return await handleAgentQuery(query, messages);
    },
  });
}

// Hook to get available tools
export function useAvailableTools() {
  return useQuery({
    queryKey: ["agentTools"],
    queryFn: async () => {
      return getAvailableTools();
    },
    // Cache for 5 minutes
    staleTime: 5 * 60 * 1000,
  });
}
