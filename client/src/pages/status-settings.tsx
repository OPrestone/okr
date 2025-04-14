import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { STATUS_CONFIG, StatusBadge } from '@/components/ui/status-badge';
import { Plus, Trash2, Save } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

// Define a type for our editable status
interface EditableStatus {
  id: string;
  name: string;
  color: string;
  darkColor: string;
  description: string;
  isNew?: boolean;
  isDeleted?: boolean;
}

export default function StatusSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // In a real app, this would fetch from an API
  const { data: statusConfig, isLoading } = useQuery({
    queryKey: ['/api/status-config'],
    // Mock data for now - in a real implementation, this would come from the API
    initialData: Object.entries(STATUS_CONFIG).map(([id, config]) => ({
      id,
      name: id,
      color: config.color,
      darkColor: config.darkColor,
      description: config.description || '',
    })) as EditableStatus[],
  });

  const [activeTab, setActiveTab] = useState('objective-statuses');
  const [editableStatuses, setEditableStatuses] = useState<EditableStatus[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  // Start editing mode with a copy of the current statuses
  const startEditing = () => {
    if (statusConfig) {
      setEditableStatuses(JSON.parse(JSON.stringify(statusConfig)));
      setIsEditing(true);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditableStatuses([]);
    setIsEditing(false);
  };

  // Add a new status
  const addNewStatus = () => {
    const newId = `status-${Date.now()}`;
    setEditableStatuses([
      ...editableStatuses,
      {
        id: newId,
        name: 'New Status',
        color: 'bg-gray-100 text-gray-800',
        darkColor: 'dark:bg-gray-800 dark:text-gray-200',
        description: 'Description for new status',
        isNew: true,
      },
    ]);
  };

  // Update a status field
  const updateStatus = (id: string, field: keyof EditableStatus, value: string) => {
    setEditableStatuses(
      editableStatuses.map((status) =>
        status.id === id ? { ...status, [field]: value } : status
      )
    );
  };

  // Mark a status for deletion
  const markStatusForDeletion = (id: string) => {
    setEditableStatuses(
      editableStatuses.map((status) =>
        status.id === id ? { ...status, isDeleted: true } : status
      )
    );
  };

  // Restore a status marked for deletion
  const restoreStatus = (id: string) => {
    setEditableStatuses(
      editableStatuses.map((status) =>
        status.id === id ? { ...status, isDeleted: false } : status
      )
    );
  };

  // Save changes mutation (would connect to an API in a real app)
  const saveChangesMutation = useMutation({
    mutationFn: async (statuses: EditableStatus[]) => {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return statuses;
    },
    onSuccess: () => {
      // Update the cache with the new statuses
      queryClient.setQueryData(['/api/status-config'], 
        editableStatuses.filter(status => !status.isDeleted));
      
      // Reset editing state
      setIsEditing(false);
      setEditableStatuses([]);
      
      toast({
        title: 'Success!',
        description: 'Status settings have been updated.',
        variant: 'default',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to save status settings. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Handle save button click
  const handleSave = () => {
    saveChangesMutation.mutate(editableStatuses);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading status configurations...</div>;
  }

  return (
    <div className="container max-w-6xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Status Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure status labels and colors for objectives and key results
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => window.location.href = '/status-tracking-demo'}>
            View Demo
          </Button>
          {!isEditing ? (
            <Button onClick={startEditing}>Customize Statuses</Button>
          ) : (
            <>
              <Button variant="outline" onClick={cancelEditing}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saveChangesMutation.isPending}>
                {saveChangesMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="objective-statuses" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="objective-statuses">Objective Statuses</TabsTrigger>
          <TabsTrigger value="key-result-statuses">Key Result Statuses</TabsTrigger>
        </TabsList>

        <TabsContent value="objective-statuses">
          <Card>
            <CardHeader>
              <CardTitle>Objective Status Configuration</CardTitle>
              <CardDescription>
                Define status labels that can be applied to objectives
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button size="sm" onClick={addNewStatus} variant="outline" className="gap-1">
                      <Plus className="h-4 w-4" /> Add Status
                    </Button>
                  </div>
                  
                  {editableStatuses.length === 0 ? (
                    <div className="text-center p-8 text-muted-foreground">
                      No statuses configured. Add your first status.
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {editableStatuses.map((status) => (
                        <div 
                          key={status.id} 
                          className={`p-4 border rounded-md transition-all ${
                            status.isDeleted 
                              ? 'opacity-50 bg-gray-50 dark:bg-gray-900' 
                              : 'bg-card'
                          }`}
                        >
                          {status.isDeleted ? (
                            <div className="flex justify-between items-center mb-4">
                              <div className="text-muted-foreground">
                                This status will be deleted upon saving
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => restoreStatus(status.id)}
                              >
                                Restore
                              </Button>
                            </div>
                          ) : (
                            <div className="flex justify-between items-start mb-4">
                              <div className="font-medium">{status.isNew ? 'New Status' : status.name}</div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive h-8 w-8 p-0"
                                onClick={() => markStatusForDeletion(status.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                          
                          {!status.isDeleted && (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor={`status-name-${status.id}`}>Status Name</Label>
                                <Input
                                  id={`status-name-${status.id}`}
                                  value={status.name}
                                  onChange={(e) => updateStatus(status.id, 'name', e.target.value)}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`status-desc-${status.id}`}>Description</Label>
                                <Input
                                  id={`status-desc-${status.id}`}
                                  value={status.description}
                                  onChange={(e) => updateStatus(status.id, 'description', e.target.value)}
                                />
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`status-light-${status.id}`}>Light Mode Colors</Label>
                                  <Input
                                    id={`status-light-${status.id}`}
                                    value={status.color}
                                    onChange={(e) => updateStatus(status.id, 'color', e.target.value)}
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor={`status-dark-${status.id}`}>Dark Mode Colors</Label>
                                  <Input
                                    id={`status-dark-${status.id}`}
                                    value={status.darkColor}
                                    onChange={(e) => updateStatus(status.id, 'darkColor', e.target.value)}
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <Label>Preview</Label>
                                <div className="mt-2 p-4 bg-white dark:bg-gray-950 rounded-md border">
                                  <div className="flex flex-wrap gap-2">
                                    <div className={`inline-flex items-center text-sm font-medium rounded-md px-2 py-1 ${status.color}`}>
                                      {status.name}
                                    </div>
                                    <div className={`inline-flex items-center text-sm font-medium rounded-md px-2 py-1 ${status.darkColor}`}>
                                      {status.name} (Dark)
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {statusConfig?.map((status) => (
                      <div key={status.id} className="p-4 border rounded-md">
                        <div className="flex items-center justify-between mb-3">
                          <StatusBadge status={status.name} size="md" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {status.description || 'No description provided'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="key-result-statuses">
          <Card>
            <CardHeader>
              <CardTitle>Key Result Status Configuration</CardTitle>
              <CardDescription>
                Define status labels that can be applied to key results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Currently using the same status settings as objectives.
                </p>
                <p className="text-muted-foreground mt-2">
                  Edit configuration to create separate statuses for key results.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}