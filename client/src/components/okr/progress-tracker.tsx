import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StatusBadge, StatusType } from '@/components/ui/status-badge';
import { StatusSelector } from '@/components/ui/status-selector';
import { Button } from '@/components/ui/button';
import { Edit2, ChevronRight } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface ProgressTrackerProps {
  id: number;
  title: string;
  description?: string;
  progress: number;
  status: StatusType;
  type: 'objective' | 'keyResult';
  owner?: string;
  dueDate?: string;
  isEditable?: boolean;
  onViewDetails?: () => void;
}

export function ProgressTracker({
  id,
  title,
  description,
  progress,
  status,
  type,
  owner,
  dueDate,
  isEditable = false,
  onViewDetails
}: ProgressTrackerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = React.useState(false);
  const [editableStatus, setEditableStatus] = React.useState<StatusType>(status);
  const [editableProgress, setEditableProgress] = React.useState<number>(progress);

  // Color variations based on progress value
  const getProgressColor = (value: number) => {
    if (value < 25) return 'bg-red-500';
    if (value < 50) return 'bg-orange-500';
    if (value < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Mutation for updating status
  const updateMutation = useMutation({
    mutationFn: async (data: { id: number, status: StatusType, progress: number }) => {
      // In a real app, this would be an API call
      console.log('Updating', type, data);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return data;
    },
    onSuccess: (data) => {
      // Update cache based on what type of item we're updating
      if (type === 'objective') {
        queryClient.invalidateQueries({ queryKey: ['/api/objectives'] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['/api/key-results'] });
      }
      
      toast({
        title: 'Updated successfully',
        description: `The ${type} status has been updated.`,
      });
      
      // Reset editing state
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update ${type}. Please try again.`,
        variant: 'destructive',
      });
    }
  });

  const handleSave = () => {
    updateMutation.mutate({
      id,
      status: editableStatus,
      progress: editableProgress,
    });
  };

  const handleCancel = () => {
    setEditableStatus(status);
    setEditableProgress(progress);
    setIsEditing(false);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
          {isEditable && !isEditing && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            {isEditing ? (
              <div className="w-full sm:w-auto">
                <StatusSelector 
                  value={editableStatus} 
                  onChange={setEditableStatus} 
                  className="w-full sm:w-40"
                />
              </div>
            ) : (
              <StatusBadge status={status} />
            )}
            
            {owner && (
              <div className="text-xs text-muted-foreground">
                Owner: {owner}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span>Progress</span>
              {isEditing ? (
                <input 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={editableProgress} 
                  onChange={(e) => setEditableProgress(Number(e.target.value))}
                  className="w-16 h-6 px-1 border rounded text-right"
                />
              ) : (
                <span className="font-medium">{progress}%</span>
              )}
            </div>
            <Progress 
              value={isEditing ? editableProgress : progress} 
              className="h-2" 
            />
          </div>

          {dueDate && (
            <div className="text-xs text-muted-foreground">
              Due: {new Date(dueDate).toLocaleDateString()}
            </div>
          )}

          {isEditing ? (
            <div className="flex items-center justify-end space-x-2 mt-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
            </div>
          ) : (
            onViewDetails && (
              <Button variant="outline" size="sm" className="w-full mt-2" onClick={onViewDetails}>
                View Details <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}