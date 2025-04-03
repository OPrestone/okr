import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { CheckCircle, Clock, AlertTriangle, Plus, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// Status badge component
function StatusBadge({ progress }: { progress: number }) {
  if (progress === 100) {
    return (
      <div className="flex items-center text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full text-xs font-medium">
        <CheckCircle className="w-3 h-3 mr-1" />
        Completed
      </div>
    );
  } else if (progress >= 70) {
    return (
      <div className="flex items-center text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full text-xs font-medium">
        <Clock className="w-3 h-3 mr-1" />
        On Track
      </div>
    );
  } else {
    return (
      <div className="flex items-center text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full text-xs font-medium">
        <AlertTriangle className="w-3 h-3 mr-1" />
        At Risk
      </div>
    );
  }
}

export default function CompanyObjectives() {
  const { data: objectives, isLoading, error } = useQuery({
    queryKey: ['/api/objectives/company'],
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Company Objectives</h1>
          <p className="text-neutral-600">Track and manage organization-wide objectives</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Add Objective
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Objectives</TabsTrigger>
          <TabsTrigger value="current">Current Quarter</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>All Company Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                // Loading state
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-2 w-full" />
                    </div>
                  ))}
                </div>
              ) : error ? (
                // Error state
                <div className="text-red-500">Error loading objectives</div>
              ) : (
                // Data table
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Objective</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Timeline</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {objectives && objectives.map((objective: any) => (
                      <TableRow key={objective.id}>
                        <TableCell className="font-medium">
                          <div>
                            <p>{objective.title}</p>
                            <p className="text-sm text-neutral-500">{objective.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge progress={objective.progress} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={objective.progress} className="w-[80px]" />
                            <span className="text-sm font-medium">{objective.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{formatDate(objective.startDate)} - {formatDate(objective.endDate)}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="current" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Quarter Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600">
                Filtered view of objectives for the current quarter would be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600">
                History of completed objectives would be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
