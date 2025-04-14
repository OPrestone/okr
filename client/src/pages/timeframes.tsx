import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { 
  PlusCircle, 
  Calendar, 
  Pencil, 
  Trash, 
  FilterX, 
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
  CalendarRange,
  ArrowUpDown,
  CalendarDays
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { queryClient } from "@/lib/queryClient";
import { useSearchParams } from "@/hooks/use-search-params";

// Type definitions (simplified from schema.ts)
interface Cadence {
  id: number;
  name: string;
  description: string | null;
  color: string;
  createdById: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface Timeframe {
  id: number;
  name: string;
  cadenceId: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdById: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export default function TimeframesPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [, setLocation] = useLocation();
  const initialCadenceId = searchParams.get("cadence");
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTimeframe, setCurrentTimeframe] = useState<Timeframe | null>(null);
  const [selectedCadenceId, setSelectedCadenceId] = useState<string | null>(initialCadenceId);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortBy, setSortBy] = useState<"startDate" | "name">("startDate");
  
  const [form, setForm] = useState({
    name: "",
    cadenceId: "",
    startDate: "",
    endDate: "",
    isActive: false,
  });

  // Load cadences
  const { data: cadences, isLoading: loadingCadences } = useQuery<Cadence[]>({
    queryKey: ["/api/cadences"],
  });

  // Load timeframes with optional cadence filter
  const { data: timeframes, isLoading: loadingTimeframes } = useQuery<Timeframe[]>({
    queryKey: ["/api/timeframes", selectedCadenceId],
    queryFn: async () => {
      const url = selectedCadenceId 
        ? `/api/timeframes?cadenceId=${selectedCadenceId}` 
        : "/api/timeframes";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch timeframes");
      return res.json();
    },
  });

  // Handle URL updates when cadence filter changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCadenceId) {
      params.set("cadence", selectedCadenceId);
    }
    const newPath = `/timeframes${params.toString() ? `?${params.toString()}` : ''}`;
    setLocation(newPath, { replace: true });
  }, [selectedCadenceId, setLocation]);

  // Sort timeframes
  const sortedTimeframes = timeframes 
    ? [...timeframes].sort((a, b) => {
        if (sortBy === "startDate") {
          const aDate = new Date(a.startDate).getTime();
          const bDate = new Date(b.startDate).getTime();
          return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
        } else {
          return sortOrder === "asc" 
            ? a.name.localeCompare(b.name) 
            : b.name.localeCompare(a.name);
        }
      })
    : [];

  // Group timeframes by cadence if no filter is applied
  const timeframesByCadence = !selectedCadenceId && sortedTimeframes
    ? sortedTimeframes.reduce((acc, timeframe) => {
        const cadenceId = timeframe.cadenceId.toString();
        if (!acc[cadenceId]) {
          acc[cadenceId] = [];
        }
        acc[cadenceId].push(timeframe);
        return acc;
      }, {} as Record<string, Timeframe[]>)
    : {};

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const response = await fetch("/api/timeframes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          cadenceId: parseInt(data.cadenceId),
          startDate: data.startDate,
          endDate: data.endDate,
          isActive: data.isActive,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create timeframe");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Timeframe created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/timeframes"] });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create timeframe",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: typeof form & { id: number }) => {
      const response = await fetch(`/api/timeframes/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          cadenceId: parseInt(data.cadenceId),
          startDate: data.startDate,
          endDate: data.endDate,
          isActive: data.isActive,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update timeframe");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Timeframe updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/timeframes"] });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update timeframe",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/timeframes/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete timeframe");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Timeframe deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/timeframes"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete timeframe",
        variant: "destructive",
      });
    },
  });

  // Toggle active status mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const response = await fetch(`/api/timeframes/${id}/active`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update timeframe status");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Timeframe status updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/timeframes"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update timeframe status",
        variant: "destructive",
      });
    },
  });

  // Dialog handlers
  const handleOpenNewDialog = () => {
    // Default to the currently selected cadence if filtering
    const initialCadenceId = selectedCadenceId || "";
    
    setForm({
      name: "",
      cadenceId: initialCadenceId,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: false,
    });
    setIsEditMode(false);
    setCurrentTimeframe(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (timeframe: Timeframe) => {
    setForm({
      name: timeframe.name,
      cadenceId: timeframe.cadenceId.toString(),
      startDate: new Date(timeframe.startDate).toISOString().split('T')[0],
      endDate: new Date(timeframe.endDate).toISOString().split('T')[0],
      isActive: timeframe.isActive,
    });
    setIsEditMode(true);
    setCurrentTimeframe(timeframe);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleDeleteTimeframe = async (id: number) => {
    if (confirm("Are you sure you want to delete this timeframe? This cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleActiveStatus = (id: number, currentStatus: boolean) => {
    // Check if any other timeframes in the same cadence are active
    if (!currentStatus) {
      // If activating, deactivate others in the same cadence
      const timeframeToActivate = timeframes?.find(t => t.id === id);
      if (timeframeToActivate) {
        // Get all active timeframes in the same cadence
        const activeTimeframesInCadence = timeframes?.filter(
          t => t.cadenceId === timeframeToActivate.cadenceId && t.isActive && t.id !== id
        );
        
        // Confirm with user if other active timeframes exist
        if (activeTimeframesInCadence && activeTimeframesInCadence.length > 0) {
          if (!confirm("Another timeframe in this cadence is already active. Do you want to make this timeframe active instead?")) {
            return;
          }
          
          // Deactivate all others in the same cadence
          activeTimeframesInCadence.forEach(t => {
            toggleActiveMutation.mutate({ id: t.id, isActive: false });
          });
        }
      }
    }
    
    // Now toggle the status of the selected timeframe
    toggleActiveMutation.mutate({ id, isActive: !currentStatus });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditMode && currentTimeframe) {
      updateMutation.mutate({ ...form, id: currentTimeframe.id });
    } else {
      createMutation.mutate(form);
    }
  };

  const getCadenceName = (cadenceId: number) => {
    if (!cadences) return "Unknown";
    const cadence = cadences.find(c => c.id === cadenceId);
    return cadence ? cadence.name : "Unknown";
  };

  const getCadenceColor = (cadenceId: number) => {
    if (!cadences) return "#cccccc";
    const cadence = cadences.find(c => c.id === cadenceId);
    return cadence ? cadence.color : "#cccccc";
  };

  const isTimeframePeriodValid = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start < end;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  // Determine if "Add Timeframe" button should be disabled
  const isAddTimeframeDisabled = !cadences || cadences.length === 0;

  // Helper to determine if a timeframe is current, upcoming, or past
  const getTimeframeStatus = (startDate: string, endDate: string): "current" | "upcoming" | "past" => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return "upcoming";
    if (now > end) return "past";
    return "current";
  };

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        heading="Timeframes Configuration"
        subheading="Manage specific time periods within each cadence for your OKR planning."
      >
        <div className="flex items-center gap-3">
          <Select
            value={selectedCadenceId || ""}
            onValueChange={(value) => setSelectedCadenceId(value || null)}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="All Cadences" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Cadences</SelectItem>
              {cadences?.map((cadence) => (
                <SelectItem key={cadence.id} value={cadence.id.toString()}>
                  {cadence.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => { setSortBy("startDate"); setSortOrder("desc"); }}>
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortBy("startDate"); setSortOrder("asc"); }}>
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortBy("name"); setSortOrder("asc"); }}>
                Name (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortBy("name"); setSortOrder("desc"); }}>
                Name (Z-A)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={handleOpenNewDialog}
            className="flex items-center gap-1"
            disabled={isAddTimeframeDisabled}
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Timeframe</span>
          </Button>
        </div>
      </PageHeader>

      {isAddTimeframeDisabled && (
        <Card className="mt-6 border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-full">
                <XCircle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium">No Cadences Available</h3>
                <p className="text-sm text-muted-foreground">
                  You need to create at least one cadence before adding timeframes.
                </p>
              </div>
              <div className="ml-auto">
                <Button
                  variant="outline"
                  onClick={() => setLocation('/cadences')}
                >
                  Go to Cadences
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-6">
        {loadingCadences || loadingTimeframes ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : timeframes && timeframes.length > 0 ? (
          <>
            {/* Display timeframes grouped by cadence when no filter is applied */}
            {!selectedCadenceId ? (
              <div className="space-y-8">
                {cadences?.map(cadence => {
                  const cadenceTimeframes = timeframesByCadence[cadence.id.toString()] || [];
                  if (cadenceTimeframes.length === 0) return null;
                  
                  return (
                    <Card key={cadence.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="h-4 w-4 rounded-full" 
                              style={{ backgroundColor: cadence.color }}
                            ></div>
                            <CardTitle>{cadence.name}</CardTitle>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCadenceId(cadence.id.toString())}
                          >
                            <Filter className="h-4 w-4 mr-1" />
                            Filter
                          </Button>
                        </div>
                        <CardDescription>{cadence.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Period</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {cadenceTimeframes.map((timeframe) => (
                              <TimeframeRow 
                                key={timeframe.id}
                                timeframe={timeframe}
                                onEdit={handleOpenEditDialog}
                                onDelete={handleDeleteTimeframe}
                                onToggleActive={handleToggleActiveStatus}
                                formatDate={formatDate}
                                getTimeframeStatus={getTimeframeStatus}
                              />
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              /* Display flat list when filtered by cadence */
              <Card>
                <CardHeader>
                  {cadences && selectedCadenceId && (
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div 
                            className="h-4 w-4 rounded-full" 
                            style={{ backgroundColor: getCadenceColor(parseInt(selectedCadenceId)) }}
                          ></div>
                          <CardTitle>{getCadenceName(parseInt(selectedCadenceId))}</CardTitle>
                        </div>
                        <CardDescription>
                          Viewing all timeframes for {getCadenceName(parseInt(selectedCadenceId))} cadence
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCadenceId(null)}
                      >
                        <FilterX className="h-4 w-4 mr-1" />
                        Clear Filter
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedTimeframes.map((timeframe) => (
                        <TimeframeRow 
                          key={timeframe.id}
                          timeframe={timeframe}
                          onEdit={handleOpenEditDialog}
                          onDelete={handleDeleteTimeframe}
                          onToggleActive={handleToggleActiveStatus}
                          formatDate={formatDate}
                          getTimeframeStatus={getTimeframeStatus}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <CalendarRange className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No Timeframes Found</h3>
              <p className="text-muted-foreground mt-1 mb-4 max-w-md">
                {selectedCadenceId 
                  ? `This cadence doesn't have any timeframes yet. Add your first timeframe to get started.` 
                  : `Get started by adding your first timeframe for a cadence.`}
              </p>
              <Button 
                onClick={handleOpenNewDialog}
                disabled={isAddTimeframeDisabled}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Timeframe
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Timeframe" : "Create New Timeframe"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Modify the timeframe settings below."
                : "Set up a new timeframe within a cadence."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cadenceId" className="text-right">
                  Cadence
                </Label>
                <Select
                  value={form.cadenceId}
                  onValueChange={(value) => setForm({ ...form, cadenceId: value })}
                  required
                >
                  <SelectTrigger id="cadenceId" className="col-span-3">
                    <SelectValue placeholder="Select a cadence" />
                  </SelectTrigger>
                  <SelectContent>
                    {cadences?.map((cadence) => (
                      <SelectItem key={cadence.id} value={cadence.id.toString()}>
                        {cadence.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="col-span-3"
                  required
                  placeholder="e.g., Q1 2025, Annual 2025"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              
              {!isTimeframePeriodValid(form.startDate, form.endDate) && (
                <div className="col-span-4 text-destructive text-sm ml-auto w-3/4">
                  End date must be after start date
                </div>
              )}
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">
                  Active
                </Label>
                <div className="flex items-center col-span-3 space-x-2">
                  <Switch
                    id="isActive"
                    checked={form.isActive}
                    onCheckedChange={(checked) => setForm({ ...form, isActive: checked })}
                  />
                  <Label htmlFor="isActive" className="text-sm text-muted-foreground">
                    {form.isActive ? "Yes - this is the current active timeframe" : "No - not active"}
                  </Label>
                </div>
              </div>
              
              {form.isActive && (
                <div className="col-span-4 bg-blue-50 text-blue-700 p-2 rounded-md text-sm ml-auto w-3/4">
                  <div className="flex gap-2">
                    <InfoIcon className="h-4 w-4 text-blue-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Only one timeframe can be active per cadence</p>
                      <p className="mt-1">
                        Setting this timeframe as active will deactivate any other active timeframes in the same cadence.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={
                  createMutation.isPending || 
                  updateMutation.isPending || 
                  !isTimeframePeriodValid(form.startDate, form.endDate) ||
                  !form.cadenceId
                }
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditMode ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper component to render a timeframe row
function TimeframeRow({
  timeframe,
  onEdit,
  onDelete,
  onToggleActive,
  formatDate,
  getTimeframeStatus
}: {
  timeframe: Timeframe;
  onEdit: (timeframe: Timeframe) => void;
  onDelete: (id: number) => void;
  onToggleActive: (id: number, currentStatus: boolean) => void;
  formatDate: (date: string) => string;
  getTimeframeStatus: (startDate: string, endDate: string) => "current" | "upcoming" | "past";
}) {
  // Determine status color and icon
  const status = getTimeframeStatus(timeframe.startDate, timeframe.endDate);
  let statusColor = "";
  let StatusIcon = null;
  
  switch (status) {
    case "current":
      statusColor = "bg-green-100 text-green-800";
      StatusIcon = Clock;
      break;
    case "upcoming":
      statusColor = "bg-blue-100 text-blue-800";
      StatusIcon = CalendarDays;
      break;
    case "past":
      statusColor = "bg-gray-100 text-gray-800";
      StatusIcon = CheckCircle2;
      break;
  }
  
  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center">
          {timeframe.isActive && (
            <Badge variant="secondary" className="mr-2 bg-green-100 text-green-800 hover:bg-green-200">
              Active
            </Badge>
          )}
          {timeframe.name}
        </div>
      </TableCell>
      <TableCell>
        {formatDate(timeframe.startDate)} — {formatDate(timeframe.endDate)}
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={`${statusColor} uppercase text-xs`}>
          <StatusIcon className="h-3 w-3 mr-1" />
          {status}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleActive(timeframe.id, timeframe.isActive)}
            className={timeframe.isActive ? "text-red-500" : "text-green-500"}
          >
            {timeframe.isActive ? "Deactivate" : "Activate"}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(timeframe)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(timeframe.id)}
          >
            <Trash className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

// Helper Info Icon component
function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}