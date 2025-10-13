import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { checkBackendHealth, checkApiEndpoints } from '@/lib/api/healthCheck';

interface HealthStatus {
  backend: 'checking' | 'healthy' | 'unhealthy';
  api: 'checking' | 'healthy' | 'unhealthy';
  backendData?: unknown;
  apiData?: unknown;
  errors?: string[];
}

export function BackendConnectionTest() {
  const [status, setStatus] = useState<HealthStatus>({
    backend: 'checking',
    api: 'checking',
    errors: []
  });

  const runHealthCheck = async () => {
    setStatus({
      backend: 'checking',
      api: 'checking',
      errors: []
    });

    // Check backend health
    const backendHealth = await checkBackendHealth();
    const apiHealth = await checkApiEndpoints();

    const errors = [];
    if (backendHealth.status === 'unhealthy') {
      errors.push(`Backend: ${backendHealth.error}`);
    }
    if (apiHealth.status === 'unhealthy') {
      errors.push(`API: ${apiHealth.error}`);
    }

    setStatus({
      backend: backendHealth.status as 'healthy' | 'unhealthy',
      api: apiHealth.status as 'healthy' | 'unhealthy',
      backendData: backendHealth.data,
      apiData: apiHealth.data,
      errors
    });
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  const getStatusIcon = (statusType: 'checking' | 'healthy' | 'unhealthy') => {
    switch (statusType) {
      case 'checking':
        return <ClockIcon className="h-5 w-5 text-yellow-500 animate-spin" />;
      case 'healthy':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'unhealthy':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusBadge = (statusType: 'checking' | 'healthy' | 'unhealthy') => {
    switch (statusType) {
      case 'checking':
        return <Badge variant="secondary">Checking...</Badge>;
      case 'healthy':
        return <Badge variant="default" className="bg-green-500">Healthy</Badge>;
      case 'unhealthy':
        return <Badge variant="destructive">Unhealthy</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Backend Connection Status
          <Button variant="outline" size="sm" onClick={runHealthCheck}>
            Refresh
          </Button>
        </CardTitle>
        <CardDescription>
          Testing connection to SpectraQ Agent Backend
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Backend Health */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            {getStatusIcon(status.backend)}
            <div>
              <p className="font-medium">Backend Server</p>
              <p className="text-sm text-muted-foreground">http://localhost:8000/health</p>
            </div>
          </div>
          {getStatusBadge(status.backend)}
        </div>

        {/* API Health */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            {getStatusIcon(status.api)}
            <div>
              <p className="font-medium">API Endpoints</p>
              <p className="text-sm text-muted-foreground">http://localhost:8000/api/v1/agent/status</p>
            </div>
          </div>
          {getStatusBadge(status.api)}
        </div>

        {/* Backend Data */}
        {status.backendData && (
          <div className="p-3 border rounded-lg bg-muted/50">
            <p className="font-medium mb-2">Backend Response:</p>
            <pre className="text-xs bg-background p-2 rounded overflow-x-auto">
              {JSON.stringify(status.backendData, null, 2)}
            </pre>
          </div>
        )}

        {/* API Data */}
        {status.apiData && (
          <div className="p-3 border rounded-lg bg-muted/50">
            <p className="font-medium mb-2">API Response:</p>
            <pre className="text-xs bg-background p-2 rounded overflow-x-auto">
              {JSON.stringify(status.apiData, null, 2)}
            </pre>
          </div>
        )}

        {/* Errors */}
        {status.errors && status.errors.length > 0 && (
          <div className="p-3 border rounded-lg bg-red-50 border-red-200">
            <p className="font-medium text-red-800 mb-2">Errors:</p>
            <ul className="text-sm text-red-700 space-y-1">
              {status.errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Instructions */}
        <div className="p-3 border rounded-lg bg-blue-50 border-blue-200">
          <p className="font-medium text-blue-800 mb-2">Troubleshooting:</p>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Make sure the backend server is running on http://localhost:8000</li>
            <li>• Check if CORS is properly configured in the backend</li>
            <li>• Verify the backend is in development mode with CORS_ORIGINS including this frontend</li>
            <li>• Try running: <code className="bg-blue-100 px-1 rounded">cd backend && uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload</code></li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
