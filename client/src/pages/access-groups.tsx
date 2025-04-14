import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  AccessGroup, 
  Permission, 
  User, 
  mockAccessGroups, 
  mockPermissions, 
  mockUsers 
} from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { 
  MoreHorizontal, 
  Search, 
  FileEdit, 
  Trash2,
  Shield,
  UsersRound,
  Plus,
  KeyRound,
  BarChart3,
  Settings,
  ClipboardCheck,
  Users,
  Calendar,
  Target
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// Group Form for creating and editing access groups
const AccessGroupForm = ({
  isOpen,
  onClose,
  accessGroup,
  permissions,
  users,
  onSave,
  onDelete,
}: {
  isOpen: boolean;
  onClose: () => void;
  accessGroup?: AccessGroup;
  permissions: Permission[];
  users: User[];
  onSave: (groupData: any) => void;
  onDelete?: (groupId: number) => void;
}) => {
  const isEditing = !!accessGroup;
  const [formData, setFormData] = useState<any>(
    accessGroup
      ? { ...accessGroup }
      : {
          name: "",
          description: "",
          permissions: [],
        }
  );
  const [activeTab, setActiveTab] = useState("permissions");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Group permissions by category
  const permissionsByCategory = useMemo(() => {
    const grouped: Record<string, Permission[]> = {};
    
    permissions.forEach(permission => {
      if (!grouped[permission.category]) {
        grouped[permission.category] = [];
      }
      grouped[permission.category].push(permission);
    });
    
    return grouped;
  }, [permissions]);
  
  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePermissionToggle = (permissionId: number) => {
    setFormData((prev: any) => {
      const currentPermissions = prev.permissions || [];
      if (currentPermissions.includes(permissionId)) {
        return {
          ...prev,
          permissions: currentPermissions.filter((id: number) => id !== permissionId),
        };
      } else {
        return {
          ...prev,
          permissions: [...currentPermissions, permissionId],
        };
      }
    });
  };
  
  // Toggle all permissions in a category
  const handleCategoryToggle = (categoryPermissions: Permission[]) => {
    const permissionIds = categoryPermissions.map(p => p.id);
    const currentPermissions = formData.permissions || [];
    
    // Check if all permissions in this category are already selected
    const allSelected = permissionIds.every(id => currentPermissions.includes(id));
    
    if (allSelected) {
      // Remove all permissions in this category
      setFormData((prev: any) => ({
        ...prev,
        permissions: prev.permissions.filter((id: number) => !permissionIds.includes(id)),
      }));
    } else {
      // Add all permissions in this category that aren't already included
      const newPermissions = [...currentPermissions];
      
      permissionIds.forEach(id => {
        if (!newPermissions.includes(id)) {
          newPermissions.push(id);
        }
      });
      
      setFormData((prev: any) => ({
        ...prev,
        permissions: newPermissions,
      }));
    }
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.name) {
      return;
    }

    onSave(formData);
    onClose();
  };

  const handleDelete = () => {
    if (onDelete && accessGroup) {
      onDelete(accessGroup.id);
      onClose();
    }
  };
  
  // Get users assigned to this group
  const assignedUsers = useMemo(() => {
    if (!isEditing) return [];
    
    return users.filter(user => 
      user.accessGroups && user.accessGroups.includes(accessGroup!.id)
    );
  }, [users, accessGroup, isEditing]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Access Group" : "Create New Access Group"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Edit the access group's information and permissions."
                : "Fill out the form below to create a new access group."}
            </DialogDescription>
          </DialogHeader>

          <Tabs 
            defaultValue="permissions" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              {isEditing && (
                <TabsTrigger value="members">Members ({assignedUsers.length})</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="permissions" className="flex-1 overflow-hidden flex flex-col">
              <div className="space-y-4 mb-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Group Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="col-span-3"
                    placeholder="OKR Contributors"
                  />
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right pt-2">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description || ""}
                    onChange={(e) => handleChange("description", e.target.value)}
                    className="col-span-3"
                    placeholder="Brief explanation of the group's purpose"
                  />
                </div>
              </div>

              <div className="text-sm font-medium mb-2">
                Permissions
              </div>
              
              <ScrollArea className="flex-1 border rounded-lg p-4">
                <Accordion type="multiple" className="w-full">
                  {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => {
                    const permissionIds = categoryPermissions.map(p => p.id);
                    const allSelected = permissionIds.every(id => 
                      (formData.permissions || []).includes(id)
                    );
                    const someSelected = permissionIds.some(id => 
                      (formData.permissions || []).includes(id)
                    );
                    
                    const icon = (() => {
                      switch(category) {
                        case "Objectives & Key Results":
                          return <Target className="h-4 w-4 mr-2" />;
                        case "Administration":
                          return <Settings className="h-4 w-4 mr-2" />;
                        case "Reporting":
                          return <BarChart3 className="h-4 w-4 mr-2" />;
                        case "Meetings":
                          return <Calendar className="h-4 w-4 mr-2" />;
                        case "Check-ins":
                          return <ClipboardCheck className="h-4 w-4 mr-2" />;
                        default:
                          return <KeyRound className="h-4 w-4 mr-2" />;
                      }
                    })();
                    
                    return (
                      <AccordionItem key={category} value={category}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center">
                            {icon}
                            <span>{category}</span>
                          </div>
                          <div className="flex items-center mr-4">
                            <Checkbox
                              id={`category-${category}`}
                              checked={allSelected}
                              indeterminate={!allSelected && someSelected}
                              onCheckedChange={() => handleCategoryToggle(categoryPermissions)}
                              onClick={(e) => e.stopPropagation()}
                              className="mr-2 data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground"
                            />
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 ml-6">
                            {categoryPermissions.map((permission) => (
                              <div key={permission.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`permission-${permission.id}`}
                                  checked={(formData.permissions || []).includes(permission.id)}
                                  onCheckedChange={() => handlePermissionToggle(permission.id)}
                                />
                                <label
                                  htmlFor={`permission-${permission.id}`}
                                  className="text-sm font-medium leading-none cursor-pointer"
                                >
                                  {permission.name.replace(/_/g, ' ')}
                                </label>
                                <span className="text-xs text-muted-foreground">
                                  ({permission.description})
                                </span>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </ScrollArea>
            </TabsContent>
            
            {isEditing && (
              <TabsContent value="members" className="flex-1 overflow-hidden flex flex-col">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    Users assigned to this access group. To change a user's access group, edit the user from the User Management page.
                  </p>
                </div>
                
                <ScrollArea className="flex-1 border rounded-lg">
                  {assignedUsers.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No users assigned to this group
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Position</TableHead>
                          <TableHead>Email</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assignedUsers.map(user => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.fullName}</TableCell>
                            <TableCell>{user.position || "—"}</TableCell>
                            <TableCell>{user.email}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </ScrollArea>
              </TabsContent>
            )}
          </Tabs>

          <DialogFooter className={isEditing ? "justify-between mt-4" : "justify-end mt-4"}>
            {isEditing && (
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                type="button"
              >
                Delete Group
              </Button>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!formData.name}
                type="button"
              >
                {isEditing ? "Save Changes" : "Create Group"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      {isEditing && (
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the access group "{accessGroup?.name}"? This action cannot be undone.
                {assignedUsers.length > 0 && (
                  <div className="mt-2 text-red-500">
                    Warning: This group has {assignedUsers.length} assigned users who will lose these permissions.
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete Group
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

// Helper to get key permissions summary
const getKeyPermissionsSummary = (permissions: number[], allPermissions: Permission[]): string => {
  const keyPermissionMap: Record<string, string[]> = {
    "Objectives & Key Results": [
      "objectives_create",
      "objectives_edit",
      "objectives_delete",
      "view_all_okrs"
    ],
    "Administration": [
      "user_management",
      "team_management",
      "access_group_management",
      "settings_management"
    ]
  };
  
  const summary: string[] = [];
  
  Object.entries(keyPermissionMap).forEach(([category, permissionNames]) => {
    const categoryPermissions = allPermissions
      .filter(p => p.category === category && permissionNames.includes(p.name))
      .map(p => p.id);
    
    const hasPermissions = categoryPermissions.some(id => permissions.includes(id));
    
    if (hasPermissions) {
      summary.push(category);
    }
  });
  
  return summary.join(", ");
};

// Main component
export default function AccessGroupsManagement() {
  const { toast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentEditingGroup, setCurrentEditingGroup] = useState<AccessGroup | undefined>(undefined);
  
  // Fetch access groups, permissions, and users
  const { data: accessGroups = mockAccessGroups, refetch: refetchAccessGroups } = useQuery({
    queryKey: ['/api/access-groups'],
    queryFn: () => mockAccessGroups,
  });
  
  const { data: permissions = mockPermissions } = useQuery({
    queryKey: ['/api/permissions'],
    queryFn: () => mockPermissions,
  });
  
  const { data: users = mockUsers } = useQuery({
    queryKey: ['/api/users'],
    queryFn: () => mockUsers,
  });
  
  // Filtered access groups based on search
  const filteredAccessGroups = useMemo(() => {
    if (!searchQuery) return accessGroups;
    
    return accessGroups.filter((group) => 
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [accessGroups, searchQuery]);
  
  // Open edit modal for an access group
  const handleEditGroup = (group: AccessGroup) => {
    setCurrentEditingGroup(group);
    setIsCreateModalOpen(true);
  };
  
  // Create or update an access group
  const handleSaveGroup = async (groupData: any) => {
    try {
      // Since we're working with mock data, we'll simulate API operations
      if (groupData.id) {
        // Update existing group
        const groupIndex = mockAccessGroups.findIndex(g => g.id === groupData.id);
        if (groupIndex >= 0) {
          mockAccessGroups[groupIndex] = { ...mockAccessGroups[groupIndex], ...groupData };
        }
        
        toast({
          title: "Access group updated",
          description: `${groupData.name} has been updated successfully.`,
        });
      } else {
        // Create new group with a new ID
        const newId = Math.max(...mockAccessGroups.map(g => g.id)) + 1;
        const newGroup = {
          ...groupData,
          id: newId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        mockAccessGroups.push(newGroup);
        
        toast({
          title: "Access group created",
          description: `${groupData.name} has been created successfully.`,
        });
      }
      
      // Refetch access groups to update UI
      await refetchAccessGroups();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving the access group.",
        variant: "destructive",
      });
      console.error("Error creating/updating access group:", error);
    }
  };
  
  // Delete an access group
  const handleDeleteGroup = async (groupId: number) => {
    try {
      // Check if any users are assigned to this group
      const usersInGroup = users.filter(user => 
        user.accessGroups && user.accessGroups.includes(groupId)
      );
      
      // Find group index
      const groupIndex = mockAccessGroups.findIndex(g => g.id === groupId);
      
      if (groupIndex >= 0) {
        // Remove the group
        const deletedGroup = mockAccessGroups[groupIndex];
        mockAccessGroups.splice(groupIndex, 1);
        
        // Update users who had this group
        for (const user of usersInGroup) {
          user.accessGroups = user.accessGroups!.filter(id => id !== groupId);
        }
        
        toast({
          title: "Access group deleted",
          description: `${deletedGroup.name} has been deleted successfully.`,
        });
        
        // Refetch access groups after deletion
        await refetchAccessGroups();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error deleting the access group.",
        variant: "destructive",
      });
      console.error("Error deleting access group:", error);
    }
  };
  
  // Get number of users in a group
  const getUserCount = (groupId: number): number => {
    return users.filter(user => 
      user.accessGroups && user.accessGroups.includes(groupId)
    ).length;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        heading="Access Groups Management"
        subheading="Manage access groups and their permissions to control system access."
      >
        <Button onClick={() => {
          setCurrentEditingGroup(undefined);
          setIsCreateModalOpen(true);
        }}>
          <Shield className="mr-2 h-4 w-4" />
          Create Access Group
        </Button>
      </PageHeader>

      <div className="flex flex-col space-y-6">
        {/* Search */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search access groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Access Groups table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Key Permissions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccessGroups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No access groups found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAccessGroups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>{group.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {group.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        <UsersRound className="h-3 w-3 mr-1" />
                        {getUserCount(group.id)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm truncate max-w-xs">
                        {getKeyPermissionsSummary(group.permissions, permissions)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditGroup(group)}>
                            <FileEdit className="mr-2 h-4 w-4" />
                            <span>Edit Group</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteGroup(group.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete Group</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Create/Edit Group Modal */}
      <AccessGroupForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        accessGroup={currentEditingGroup}
        permissions={permissions}
        users={users}
        onSave={handleSaveGroup}
        onDelete={handleDeleteGroup}
      />
    </div>
  );
}