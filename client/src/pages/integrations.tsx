import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Check, X, CornerDownRight, AlertCircle, ExternalLink, 
  MessageSquare, Calendar, Database, MessageSquareText, 
  GitPullRequest, CheckSquare, Pen, Github 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';

// Define integration type for typechecking
interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string; // Icon name as string instead of JSX Element
  isConnected: boolean;
  status: 'active' | 'inactive' | 'error' | 'pending';
  features: string[];
  category: 'productivity' | 'communication' | 'project-management' | 'development' | 'erp';
  connectionUrl: string;
  configOptions?: {
    name: string;
    type: 'text' | 'toggle' | 'select';
    value: string | boolean;
    options?: string[];
  }[];
}

// Integration card component
function IntegrationCard({ integration, onConnect, onDisconnect, onSaveConfig }: { 
  integration: Integration;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
  onSaveConfig: (id: string, config: any) => void;
}) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [config, setConfig] = useState(integration.configOptions || []);

  // Handle config changes
  const handleConfigChange = (name: string, value: string | boolean) => {
    const newConfig = config.map(item => 
      item.name === name ? { ...item, value } : item
    );
    setConfig(newConfig);
  };

  // Save configuration
  const handleSaveConfig = () => {
    onSaveConfig(integration.id, config);
    setIsConfigOpen(false);
  };

  // Function to render icon based on service name
  const renderIcon = (iconName: string) => {
    // Map service IDs to Lucide icons
    switch (iconName) {
      case 'microsoft-teams':
        return <MessageSquare className="h-7 w-7" />;
      case 'google-workspace':
        return <Calendar className="h-7 w-7" />;
      case 'odoo':
        return <Database className="h-7 w-7" />;
      case 'slack':
        return <MessageSquareText className="h-7 w-7" />;
      case 'jira':
        return <GitPullRequest className="h-7 w-7" />;
      case 'asana':
        return <CheckSquare className="h-7 w-7" />;
      case 'miro':
        return <Pen className="h-7 w-7" />;
      case 'github':
        return <Github className="h-7 w-7" />;
      default:
        return <AlertCircle className="h-7 w-7" />;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl text-primary">
              {renderIcon(integration.icon)}
            </div>
            <div>
              <CardTitle className="text-xl">{integration.name}</CardTitle>
              <CardDescription className="mt-1">{integration.category}</CardDescription>
            </div>
          </div>
          <Badge 
            className={
              integration.status === 'active' ? 'bg-green-600' : 
              integration.status === 'inactive' ? 'bg-gray-400' :
              integration.status === 'error' ? 'bg-red-600' : 'bg-yellow-500'
            }
          >
            {integration.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm mb-4">{integration.description}</p>
        
        <div className="mb-4">
          <h4 className="font-medium mb-2">Features</h4>
          <ul className="space-y-1 text-sm">
            {integration.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <CornerDownRight className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {isConfigOpen && integration.isConnected && integration.configOptions && (
          <div className="mb-4 mt-6 border rounded-md p-3">
            <h4 className="font-medium mb-3">Configuration</h4>
            <div className="space-y-4">
              {config.map((option) => (
                <div key={option.name} className="space-y-2">
                  <Label htmlFor={option.name}>{option.name}</Label>
                  
                  {option.type === 'text' && (
                    <Input
                      id={option.name}
                      value={option.value as string}
                      onChange={(e) => handleConfigChange(option.name, e.target.value)}
                    />
                  )}
                  
                  {option.type === 'toggle' && (
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={option.name}
                        checked={option.value as boolean}
                        onCheckedChange={(checked) => handleConfigChange(option.name, checked)}
                      />
                      <Label htmlFor={option.name}>
                        {option.value ? 'Enabled' : 'Disabled'}
                      </Label>
                    </div>
                  )}

                  {option.type === 'select' && option.options && (
                    <select
                      id={option.name}
                      value={option.value as string}
                      onChange={(e) => handleConfigChange(option.name, e.target.value)}
                      className="w-full rounded-md border border-input px-3 py-2 text-sm"
                    >
                      {option.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
              
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveConfig}>
                  Save Configuration
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        {!integration.isConnected ? (
          <Button 
            className="w-full" 
            onClick={() => onConnect(integration.id)}
          >
            Connect
          </Button>
        ) : (
          <div className="w-full flex space-x-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setIsConfigOpen(!isConfigOpen)}
            >
              {isConfigOpen ? 'Hide Config' : 'Configure'}
            </Button>
            <Button 
              variant="destructive" 
              className="flex-1"
              onClick={() => onDisconnect(integration.id)}
            >
              Disconnect
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

export default function IntegrationsPage() {
  // Fetch available integrations
  const { data: integrations, isLoading, error } = useQuery<Integration[]>({
    queryKey: ['/api/integrations'],
    placeholderData: [], // Fallback when API is not available
  });

  // Connect an integration
  const handleConnect = (id: string) => {
    // In a real app, this would trigger an OAuth flow or similar
    const integration = integrations?.find(i => i.id === id);
    if (integration) {
      // Open the connection URL in a new window for OAuth flow
      window.open(integration.connectionUrl, '_blank', 'width=600,height=600');
    }
  };

  // Disconnect an integration
  const handleDisconnect = (id: string) => {
    // In a real app, this would revoke OAuth tokens
    console.log(`Disconnecting integration: ${id}`);
    // Would make API call here to disconnect
  };

  // Save integration configuration
  const handleSaveConfig = (id: string, config: any) => {
    // In a real app, this would save configuration to backend
    console.log(`Saving config for integration: ${id}`, config);
    // Would make API call here to save config
  };

  // Group integrations by category
  const categories = integrations ? [
    'All',
    'productivity',
    'communication',
    'project-management',
    'development',
    'erp'
  ] : [];

  return (
    <div className="container py-6 max-w-7xl mx-auto">
      <PageHeader
        heading="Integrations"
        subheading="Connect your OKR system with your favorite tools and services"
      />

      {error ? (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load integrations. Please try again later.
          </AlertDescription>
        </Alert>
      ) : (
        <Tabs defaultValue="All" className="mb-8">
          <TabsList className="mb-6">
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(category => (
            <TabsContent key={category} value={category}>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((_, i) => (
                    <Card key={i} className="h-full flex flex-col">
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <Skeleton className="h-12 w-12 rounded-md" />
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <div className="space-y-2 mt-4">
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-3/4" />
                          <Skeleton className="h-3 w-5/6" />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Skeleton className="h-10 w-full rounded-md" />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {integrations
                    ?.filter(integration => 
                      category === 'All' || integration.category === category
                    )
                    .map(integration => (
                      <IntegrationCard
                        key={integration.id}
                        integration={integration}
                        onConnect={handleConnect}
                        onDisconnect={handleDisconnect}
                        onSaveConfig={handleSaveConfig}
                      />
                    ))
                  }
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}

      <div className="bg-muted/50 rounded-lg p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Need a custom integration?</h2>
        <p className="mb-4">
          Don't see the integration you need? Our platform supports custom integrations through our API.
          Contact our support team to discuss your specific requirements.
        </p>
        <div className="flex space-x-4">
          <Button>
            View API Documentation
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}