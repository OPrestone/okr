import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Info, 
  Calendar, 
  ChevronDown, 
  CheckCircle2, 
  EyeIcon, 
  Edit, 
  AlertCircle,
  Clock,
  CheckCircle,
  PlusCircle,
  UserCircle2,
  Target,
  RefreshCw,
  Medal,
  Tag
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ObjectiveDetailProps {
  objectiveId: number;
  isOpen: boolean;
  onClose: () => void;
}

// Status badge component
function StatusBadge({ status }: { status: string | null }) {
  switch (status) {
    case "complete":
      return (
        <Badge variant="outline" className="text-green-600 border-green-300 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          <span>Complete</span>
        </Badge>
      );
    case "on_track":
      return (
        <Badge variant="outline" className="text-blue-600 border-blue-300 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>On Track</span>
        </Badge>
      );
    case "at_risk":
      return (
        <Badge variant="outline" className="text-amber-600 border-amber-300 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          <span>At Risk</span>
        </Badge>
      );
    case "behind":
      return (
        <Badge variant="outline" className="text-red-600 border-red-300 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          <span>Behind</span>
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-slate-600 border-slate-300 flex items-center gap-1">
          <Info className="h-3 w-3" />
          <span>No Status</span>
        </Badge>
      );
  }
}

// Key result status component
function KeyResultStatus({ progress }: { progress: number }) {
  if (progress === 100) {
    return (
      <div className="flex items-center text-green-600">
        <CheckCircle className="w-4 h-4 mr-1" />
        <span>Completed</span>
      </div>
    );
  } else if (progress >= 70) {
    return (
      <div className="flex items-center text-blue-600">
        <Clock className="w-4 h-4 mr-1" />
        <span>On Track</span>
      </div>
    );
  } else {
    return (
      <div className="flex items-center text-amber-600">
        <AlertCircle className="w-4 h-4 mr-1" />
        <span>At Risk</span>
      </div>
    );
  }
}

export function ObjectiveDetailView({ objectiveId, isOpen, onClose }: ObjectiveDetailProps) {
  const [descriptionOpen, setDescriptionOpen] = useState(true);
  
  // Fetch objective details
  const { 
    data: objective, 
    isLoading: objectiveLoading, 
    error: objectiveError 
  } = useQuery<any>({
    queryKey: [`/api/objectives/${objectiveId}`],
    enabled: isOpen && !!objectiveId
  });
  
  // Fetch key results for this objective
  const { 
    data: keyResults = [], 
    isLoading: keyResultsLoading, 
    error: keyResultsError 
  } = useQuery<any[]>({
    queryKey: [`/api/objectives/${objectiveId}/key-results`],
    enabled: isOpen && !!objectiveId
  });
  
  // Calculate status based on progress
  const getStatusFromProgress = (progress: number): string => {
    if (progress === 100) return "complete";
    if (progress >= 70) return "on_track";
    if (progress > 30) return "at_risk";
    return "behind";
  };
  
  // Determine if we should show loading state
  const isLoading = objectiveLoading || keyResultsLoading;
  
  // Determine if we have an error
  const hasError = objectiveError || keyResultsError;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-y-auto">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-36 w-full" />
          </div>
        ) : hasError ? (
          <div className="text-center p-6">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-600 mb-2">Failed to load objective</h3>
            <p className="text-sm text-neutral-600">
              There was an error loading the objective details. Please try again later.
            </p>
            <Button onClick={onClose} className="mt-4">Close</Button>
          </div>
        ) : objective ? (
          <>
            <DialogHeader>
              <div className="flex items-start justify-between">
                <DialogTitle className="text-xl font-bold">{objective.title}</DialogTitle>
                <Button variant="outline" size="icon" onClick={onClose}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                  <span className="sr-only">Close</span>
                </Button>
              </div>
              <div className="flex gap-2 mt-2">
                <StatusBadge status={objective.status || getStatusFromProgress(objective.progress)} />
                <Badge variant="outline" className="border-neutral-300">
                  Q{Math.floor(new Date(objective.startDate).getMonth() / 3) + 1} {new Date(objective.startDate).getFullYear()}
                </Badge>
              </div>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="col-span-2">
                <Collapsible open={descriptionOpen} onOpenChange={setDescriptionOpen}>
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-neutral-700 mb-2 flex items-center">
                      <Info className="h-4 w-4 mr-1 text-neutral-500" />
                      Description
                    </h3>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-0 h-7 w-7">
                        <ChevronDown className={`h-4 w-4 transition-transform ${descriptionOpen ? 'transform rotate-180' : ''}`} />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent>
                    <div className="text-sm text-neutral-600 mb-4">
                      {objective.description || "No description provided."}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                
                <div className="space-y-6 mt-4">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-700 mb-2 flex items-center">
                      <Target className="h-4 w-4 mr-1 text-neutral-500" />
                      Key Results & Initiatives
                    </h3>
                    
                    {keyResults.length === 0 ? (
                      <div className="text-center py-6 border border-dashed rounded-md border-neutral-300">
                        <p className="text-sm text-neutral-500 mb-3">You haven't created any Key Results yet.</p>
                        <Button size="sm" className="gap-1">
                          <PlusCircle className="h-4 w-4" />
                          Add Key Result
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {keyResults.map((keyResult) => (
                          <Card key={keyResult.id} className="overflow-hidden">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-neutral-900">{keyResult.title}</h4>
                                  <p className="text-sm text-neutral-600 mt-1">{keyResult.description || "No description"}</p>
                                  
                                  <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                      <span className="text-neutral-500 block">Start Value</span>
                                      <span className="font-medium">{keyResult.startValue !== null ? keyResult.startValue : 'N/A'}</span>
                                    </div>
                                    <div>
                                      <span className="text-neutral-500 block">Current Value</span>
                                      <span className="font-medium">{keyResult.currentValue !== null ? keyResult.currentValue : 'N/A'}</span>
                                    </div>
                                    <div>
                                      <span className="text-neutral-500 block">Target Value</span>
                                      <span className="font-medium">{keyResult.targetValue !== null ? keyResult.targetValue : 'N/A'}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="ml-4 flex flex-col items-end">
                                  <KeyResultStatus progress={keyResult.progress} />
                                  <div className="flex items-center space-x-2 mt-2">
                                    <Progress value={keyResult.progress} className="w-[120px]" />
                                    <span className="text-sm font-medium">{keyResult.progress}%</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-neutral-700 mb-2 flex items-center">
                      <RefreshCw className="h-4 w-4 mr-1 text-neutral-500" />
                      Aligned OKRs
                    </h3>
                    
                    <div className="text-center py-6 border border-dashed rounded-md border-neutral-300">
                      <p className="text-sm text-neutral-500">No aligned OKRs found</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-neutral-700 mb-2 flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-neutral-500" />
                      Activity
                    </h3>
                    
                    <div className="text-center py-6 border border-dashed rounded-md border-neutral-300">
                      <p className="text-sm text-neutral-500">No recent activity</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Objective details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                    <div>
                      <p className="text-sm font-medium text-neutral-700 flex items-center gap-1">
                        <Medal className="h-4 w-4 text-neutral-500" /> 
                        <span>Progress</span>
                      </p>
                      <div className="mt-1">
                        <div className="h-7 w-7 rounded-full bg-neutral-100 flex items-center justify-center relative mb-1">
                          <span className="text-xs font-medium">{objective.progress}%</span>
                        </div>
                        <Progress value={objective.progress} className="h-2" />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <p className="text-sm font-medium text-neutral-700 flex items-center gap-1">
                        <Info className="h-4 w-4 text-neutral-500" /> 
                        <span>Status</span>
                      </p>
                      <div className="mt-1">
                        <StatusBadge status={objective.status || getStatusFromProgress(objective.progress)} />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <p className="text-sm font-medium text-neutral-700 flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-neutral-500" /> 
                        <span>Timeframe</span>
                      </p>
                      <div className="mt-1 text-sm">
                        {formatDate(objective.startDate)} - {formatDate(objective.endDate)}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <p className="text-sm font-medium text-neutral-700 flex items-center gap-1">
                        <UserCircle2 className="h-4 w-4 text-neutral-500" /> 
                        <span>Owner</span>
                      </p>
                      <div className="mt-1 text-sm">
                        {objective.ownerName || "ICT Department"}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <p className="text-sm font-medium text-neutral-700 flex items-center gap-1">
                        <UserCircle2 className="h-4 w-4 text-neutral-500" /> 
                        <span>Lead</span>
                      </p>
                      <div className="mt-1 text-sm">
                        {objective.leadName || "Immaculate Okeke"}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <p className="text-sm font-medium text-neutral-700 flex items-center gap-1">
                        <RefreshCw className="h-4 w-4 text-neutral-500" /> 
                        <span>Update frequency</span>
                      </p>
                      <div className="mt-1 text-sm">
                        Weekly
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <p className="text-sm font-medium text-neutral-700 flex items-center gap-1">
                        <Tag className="h-4 w-4 text-neutral-500" /> 
                        <span>Tags</span>
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        <Badge variant="secondary" className="text-xs">build</Badge>
                        <Badge variant="secondary" className="text-xs">innovate</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <DialogFooter className="mt-6 gap-2 sm:gap-0">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button variant="default" className="gap-1">
                <Edit className="h-4 w-4" />
                Edit Objective
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="text-center p-6">
            <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Objective not found</h3>
            <p className="text-sm text-neutral-600">
              The selected objective could not be found.
            </p>
            <Button onClick={onClose} className="mt-4">Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}