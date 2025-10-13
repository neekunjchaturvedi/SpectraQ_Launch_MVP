// Integration test for SpectraQ Agent frontend and backend
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { sendQuery, fetchAvailableTools } from "@/lib/agent/backendService";

const TestAgentIntegration = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rawResponse, setRawResponse] = useState({});

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  // Fetch available tools on component mount
  useEffect(() => {
    const getTools = async () => {
      try {
        setLoading(true);
        const toolsData = await fetchAvailableTools();
        setTools(toolsData);
        setError("");
      } catch (err) {
        setError("Failed to fetch tools: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    getTools();
  }, []);

  // Handle query submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError("");

      // Send the query to the backend
      const result = await sendQuery(query);

      // Store the raw response for the debug tab
      setRawResponse(result);

      // Extract and display the final response
      setResponse(result.final_response.content);
    } catch (err) {
      setError("Error: " + err.message);
      setResponse("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto pt-28 pb-8 px-4 max-w-4xl">
      {/* Header with Back Button */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={handleGoBack}
          className="flex items-center space-x-2 hover:bg-muted"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back</span>
        </Button>
        <h1 className="text-2xl font-bold">SpectraQ Agent Integration Test</h1>
      </div>

      {/* Query input */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Send a Query</CardTitle>
          <CardDescription>
            Test the connection between frontend and backend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your query (e.g., What's the current price of Bitcoin?)"
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={loading || !query.trim()}
              className="self-end"
            >
              {loading ? "Sending..." : "Send Query"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Available tools */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Available Tools</CardTitle>
          <CardDescription>Tools fetched from the backend</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && tools.length === 0 ? (
            <p>Loading tools...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tools.map((tool) => (
                <Badge
                  key={tool.id}
                  variant={tool.connected ? "default" : "outline"}
                  className={tool.connected ? "bg-green-600" : "text-red-500"}
                >
                  {tool.name}
                </Badge>
              ))}

              {tools.length === 0 && !loading && !error && (
                <p>No tools available from the backend.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Response display */}
      {(response || error) && (
        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="formatted">
              <TabsList>
                <TabsTrigger value="formatted">Formatted</TabsTrigger>
                <TabsTrigger value="raw">Raw JSON</TabsTrigger>
              </TabsList>

              <TabsContent value="formatted" className="mt-4">
                {error ? (
                  <p className="text-red-500">{error}</p>
                ) : (
                  <div className="whitespace-pre-wrap p-4 bg-muted rounded-md">
                    {response}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="raw" className="mt-4">
                <Textarea
                  readOnly
                  value={JSON.stringify(rawResponse, null, 2)}
                  className="font-mono h-80"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TestAgentIntegration;
