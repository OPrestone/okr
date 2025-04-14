import React, { useState } from 'react';
import { StatusBadge, StatusType } from '@/components/ui/status-badge';
import { StatusSelector } from '@/components/ui/status-selector';
import { ProgressTracker } from '@/components/okr/progress-tracker';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Clock, CheckCircle, AlertTriangle, Ban } from 'lucide-react';

export default function StatusTrackingDemo() {
  // Demo state
  const [showComponent, setShowComponent] = useState<'badge' | 'selector' | 'tracker'>('badge');
  const [selectedStatus, setSelectedStatus] = useState<StatusType>('In Progress');
  const [customProgress, setCustomProgress] = useState(45);
  
  // Sample data for the demo
  const sampleObjectives = [
    {
      id: 1,
      title: "Increase customer satisfaction score by 25%",
      description: "Improve our overall customer experience to achieve higher satisfaction ratings",
      progress: 75,
      status: "In Progress" as StatusType,
      owner: "Sarah Johnson",
      dueDate: "2025-06-30"
    },
    {
      id: 2,
      title: "Launch new mobile application",
      description: "Develop and release our new mobile app with core functionality",
      progress: 25,
      status: "At Risk" as StatusType,
      owner: "David Chen",
      dueDate: "2025-05-15"
    },
    {
      id: 3,
      title: "Reduce operating costs by 15%",
      description: "Identify and implement cost-saving measures across departments",
      progress: 100,
      status: "Completed" as StatusType,
      owner: "Michael Rodriguez",
      dueDate: "2025-03-31"
    },
    {
      id: 4,
      title: "Expand to 3 new markets",
      description: "Research and enter three new geographic markets",
      progress: 10,
      status: "Behind" as StatusType,
      owner: "Emily Zhang",
      dueDate: "2025-08-31"
    },
  ];

  return (
    <div className="container max-w-6xl p-6">
      <PageHeader
        title="Status Tracking Components"
        description="Demonstration of color-coded status tracking components for OKRs"
        actions={
          <Button onClick={() => window.history.back()}>
            Back
          </Button>
        }
      />

      <Tabs defaultValue="components" className="mt-8">
        <TabsList className="mb-6">
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="components">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Component Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Component Types</CardTitle>
                <CardDescription>
                  Select a component to view and customize
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant={showComponent === 'badge' ? 'default' : 'outline'} 
                    onClick={() => setShowComponent('badge')}
                  >
                    Status Badge
                  </Button>
                  <Button 
                    variant={showComponent === 'selector' ? 'default' : 'outline'} 
                    onClick={() => setShowComponent('selector')}
                  >
                    Status Selector
                  </Button>
                  <Button 
                    variant={showComponent === 'tracker' ? 'default' : 'outline'} 
                    onClick={() => setShowComponent('tracker')}
                  >
                    Progress Tracker
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Component Customization */}
            <Card>
              <CardHeader>
                <CardTitle>Customization</CardTitle>
                <CardDescription>
                  Adjust settings for the selected component
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <StatusSelector
                      value={selectedStatus}
                      onChange={setSelectedStatus}
                    />
                  </div>

                  {showComponent === 'tracker' && (
                    <div className="space-y-2">
                      <Label>Progress: {customProgress}%</Label>
                      <Slider 
                        value={[customProgress]} 
                        min={0} 
                        max={100} 
                        step={1} 
                        onValueChange={(values) => setCustomProgress(values[0])}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Component Preview */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Component Preview</CardTitle>
                <CardDescription>
                  Live preview of the selected component with current settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-8 border rounded-md">
                  {showComponent === 'badge' && (
                    <div className="flex flex-col space-y-4 items-center">
                      <h3 className="text-lg font-medium mb-4">Status Badge</h3>
                      <div className="flex flex-wrap gap-3 justify-center">
                        <StatusBadge status={selectedStatus} size="sm" />
                        <StatusBadge status={selectedStatus} size="md" />
                        <StatusBadge status={selectedStatus} size="lg" />
                      </div>
                    </div>
                  )}

                  {showComponent === 'selector' && (
                    <div className="flex flex-col space-y-4 items-center max-w-xs w-full">
                      <h3 className="text-lg font-medium mb-4">Status Selector</h3>
                      <StatusSelector
                        value={selectedStatus}
                        onChange={setSelectedStatus}
                        className="w-full"
                      />
                    </div>
                  )}

                  {showComponent === 'tracker' && (
                    <div className="w-full max-w-md">
                      <h3 className="text-lg font-medium mb-4 text-center">Progress Tracker</h3>
                      <ProgressTracker
                        id={999}
                        title="Sample Objective"
                        description="This is a sample objective to demonstrate the progress tracker component"
                        progress={customProgress}
                        status={selectedStatus}
                        type="objective"
                        owner="John Doe"
                        dueDate="2025-06-30"
                        isEditable={true}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="examples">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Available Status Options</CardTitle>
                <CardDescription>
                  Standard status labels for tracking OKR progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  <div className="p-4 border rounded-md">
                    <StatusBadge status="Not Started" size="md" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      For objectives or key results that haven't begun yet
                    </p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <StatusBadge status="In Progress" size="md" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Work is underway and progressing as expected
                    </p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <StatusBadge status="At Risk" size="md" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      There are issues that may prevent on-time completion
                    </p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <StatusBadge status="Behind" size="md" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Progress is behind schedule and requires attention
                    </p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <StatusBadge status="Completed" size="md" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      The objective or key result has been achieved
                    </p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <StatusBadge status="Cancelled" size="md" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      The objective or key result has been cancelled
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sample Objectives With Status</CardTitle>
                <CardDescription>
                  Examples of objectives with different status values
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {sampleObjectives.map(objective => (
                    <ProgressTracker 
                      key={objective.id}
                      id={objective.id}
                      title={objective.title}
                      description={objective.description}
                      progress={objective.progress}
                      status={objective.status}
                      type="objective"
                      owner={objective.owner}
                      dueDate={objective.dueDate}
                      isEditable={false}
                      onViewDetails={() => alert(`View details for: ${objective.title}`)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}