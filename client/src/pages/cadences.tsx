import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  PlusCircle, 
  Calendar, 
  Pencil, 
  Trash, 
  CircleCheck, 
  Loader2 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { queryClient } from "@/lib/queryClient";

// Cadence type definition (simplified from what's in schema.ts)
interface Cadence {
  id: number;
  name: string;
  description: string | null;
  color: string;
  createdById: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export default function CadencesPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCadence, setCurrentCadence] = useState<Cadence | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    color: "#4f46e5",
  });

  const { data: cadences, isLoading } = useQuery<Cadence[]>({
    queryKey: ["/api/cadences"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const response = await fetch("/api/cadences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to create cadence");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Cadence created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cadences"] });
      handleCloseDialog();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create cadence",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: typeof form & { id: number }) => {
      const response = await fetch(`/api/cadences/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          color: data.color,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update cadence");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Cadence updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cadences"] });
      handleCloseDialog();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update cadence",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/cadences/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete cadence");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Cadence deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cadences"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete cadence",
        variant: "destructive",
      });
    },
  });

  const handleOpenNewDialog = () => {
    setForm({
      name: "",
      description: "",
      color: "#4f46e5",
    });
    setIsEditMode(false);
    setCurrentCadence(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (cadence: Cadence) => {
    setForm({
      name: cadence.name,
      description: cadence.description || "",
      color: cadence.color,
    });
    setIsEditMode(true);
    setCurrentCadence(cadence);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setForm({
      name: "",
      description: "",
      color: "#4f46e5",
    });
  };

  const handleDeleteCadence = async (id: number) => {
    if (confirm("Are you sure you want to delete this cadence? This cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && currentCadence) {
      updateMutation.mutate({ ...form, id: currentCadence.id });
    } else {
      createMutation.mutate(form);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        heading="Cadences Configuration"
        subheading="Manage OKR cadence types such as quarterly, annual, or monthly planning cycles."
      >
        <Button
          onClick={handleOpenNewDialog}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Cadence</span>
        </Button>
      </PageHeader>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Cadence Types</CardTitle>
            <CardDescription>
              Cadences determine the rhythm of your OKR planning cycles. Each cadence can have multiple timeframes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : cadences && cadences.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Timeframes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cadences.map((cadence) => (
                    <TableRow key={cadence.id}>
                      <TableCell>
                        <div 
                          className="h-6 w-6 rounded-full" 
                          style={{ backgroundColor: cadence.color }}
                        ></div>
                      </TableCell>
                      <TableCell className="font-medium">{cadence.name}</TableCell>
                      <TableCell>{cadence.description || "—"}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => {
                            // Navigate to timeframes filtered for this cadence
                            window.location.href = `/timeframes?cadence=${cadence.id}`;
                          }}
                        >
                          <Calendar className="h-3.5 w-3.5" />
                          <span>View Timeframes</span>
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEditDialog(cadence)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCadence(cadence.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No Cadences Found</h3>
                <p className="text-muted-foreground mt-1 mb-4">
                  Get started by adding your first cadence type.
                </p>
                <Button onClick={handleOpenNewDialog}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Cadence
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Cadence" : "Create New Cadence"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Modify the cadence settings below."
                : "Set up a new cadence type for your OKR cycles."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
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
                  placeholder="e.g., Quarterly, Annual, Monthly"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="col-span-3"
                  placeholder="Optional description of this cadence type"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="color" className="text-right">
                  Color
                </Label>
                <div className="col-span-3 flex items-center gap-3">
                  <div 
                    className="h-8 w-8 rounded-full border cursor-pointer"
                    style={{ backgroundColor: form.color }}
                    onClick={() => {
                      // Open color picker or show options
                      document.getElementById('color-input')?.click();
                    }}
                  ></div>
                  <Input
                    id="color-input"
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-12 h-8 p-0 overflow-hidden"
                  />
                  <Input
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="flex-1"
                    placeholder="#RRGGBB"
                    pattern="^#([A-Fa-f0-9]{6})$"
                    title="Hex color code (e.g., #4f46e5)"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending || updateMutation.isPending}
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