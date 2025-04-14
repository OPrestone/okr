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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Team, 
  AccessGroup, 
  mockUsers, 
  mockTeams, 
  mockAccessGroups 
} from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { 
  UserCog, 
  MoreHorizontal, 
  UserPlus, 
  Search, 
  Mail, 
  FileEdit, 
  Trash2,
  Shield,
  UserCheck,
  XCircle,
  CheckCircle2,
  Languages
} from "lucide-react";

// Helper to get initials from a name
const getInitials = (name: string) => {
  const parts = name.split(" ");
  return parts.length > 1
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`
    : parts[0].substring(0, 2);
};

// User form for creating and editing users
const UserForm = ({
  isOpen,
  onClose,
  user,
  teams,
  accessGroups,
  users,
  onSave,
  onDelete,
}: {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
  teams: Team[];
  accessGroups: AccessGroup[];
  users: User[];
  onSave: (userData: any) => void;
  onDelete?: (userId: number) => void;
}) => {
  const isEditing = !!user;
  const [formData, setFormData] = useState<any>(
    user
      ? { ...user }
      : {
          username: "",
          fullName: "",
          email: "",
          role: "user",
          teamId: undefined,
          position: "",
          managerId: undefined,
          preferredLanguage: "en",
          accessGroups: [],
          status: "active",
        }
  );
  const [sendInvitation, setSendInvitation] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAccessGroupToggle = (groupId: number) => {
    setFormData((prev: any) => {
      const currentGroups = prev.accessGroups || [];
      if (currentGroups.includes(groupId)) {
        return {
          ...prev,
          accessGroups: currentGroups.filter((id: number) => id !== groupId),
        };
      } else {
        return {
          ...prev,
          accessGroups: [...currentGroups, groupId],
        };
      }
    });
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.fullName || !formData.email) {
      return;
    }

    // Generate username if not provided
    if (!formData.username) {
      const nameToUsername = formData.fullName
        .toLowerCase()
        .replace(/\s+/g, "");
      formData.username = nameToUsername;
    }

    onSave(formData);
    onClose();
  };

  const handleDelete = () => {
    if (onDelete && user) {
      onDelete(user.id);
      onClose();
    }
  };

  // Get potential managers (all users except current user)
  const potentialManagers = users.filter(
    (u) => !user || u.id !== user.id
  );

  // Available language options
  const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "zh", label: "Chinese" },
    { value: "ja", label: "Japanese" },
    { value: "pt", label: "Portuguese" },
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit User" : "Create New User"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Edit the user's information and permissions."
                : "Fill out the form below to create a new user."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Input
                id="firstName"
                value={formData.fullName.split(" ")[0] || ""}
                onChange={(e) => {
                  const lastName = formData.fullName.split(" ").slice(1).join(" ");
                  handleChange(
                    "fullName",
                    `${e.target.value} ${lastName}`.trim()
                  );
                }}
                className="col-span-3"
                placeholder="John"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={formData.fullName.split(" ").slice(1).join(" ") || ""}
                onChange={(e) => {
                  const firstName = formData.fullName.split(" ")[0] || "";
                  handleChange(
                    "fullName",
                    `${firstName} ${e.target.value}`.trim()
                  );
                }}
                className="col-span-3"
                placeholder="Doe"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Official Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                className="col-span-3"
                placeholder="john.doe@example.com"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Position
              </Label>
              <Input
                id="position"
                value={formData.position || ""}
                onChange={(e) => handleChange("position", e.target.value)}
                className="col-span-3"
                placeholder="Product Manager"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="team" className="text-right">
                Team
              </Label>
              <Select
                value={formData.teamId?.toString()}
                onValueChange={(value) =>
                  handleChange("teamId", value ? parseInt(value) : undefined)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None</SelectItem>
                  <SelectGroup>
                    <SelectLabel>Teams</SelectLabel>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id.toString()}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="manager" className="text-right">
                Manager
              </Label>
              <Select
                value={formData.managerId?.toString()}
                onValueChange={(value) =>
                  handleChange("managerId", value ? parseInt(value) : undefined)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None</SelectItem>
                  <SelectGroup>
                    <SelectLabel>Potential Managers</SelectLabel>
                    {potentialManagers.map((manager) => (
                      <SelectItem
                        key={manager.id}
                        value={manager.id.toString()}
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>
                              {getInitials(manager.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{manager.fullName}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="language" className="text-right">
                Preferred Language
              </Label>
              <Select
                value={formData.preferredLanguage || "en"}
                onValueChange={(value) =>
                  handleChange("preferredLanguage", value)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Languages</SelectLabel>
                    {languageOptions.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Access Groups</Label>
              <div className="col-span-3 space-y-2">
                {accessGroups.map((group) => (
                  <div key={group.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`group-${group.id}`}
                      checked={(formData.accessGroups || []).includes(group.id)}
                      onCheckedChange={() => handleAccessGroupToggle(group.id)}
                    />
                    <label
                      htmlFor={`group-${group.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {group.name}
                    </label>
                    <span className="text-xs text-muted-foreground">
                      ({group.description})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {!isEditing && (
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-start-2 col-span-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="send-invitation"
                      checked={sendInvitation}
                      onCheckedChange={(checked) =>
                        setSendInvitation(!!checked)
                      }
                    />
                    <label
                      htmlFor="send-invitation"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Send invitation by email
                    </label>
                  </div>
                </div>
              </div>
            )}

            {isEditing && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={formData.status || "active"}
                  onValueChange={(value) => handleChange("status", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>User Status</SelectLabel>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="invited">Invited</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter className={isEditing ? "justify-between" : "justify-end"}>
            {isEditing && (
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                type="button"
              >
                Delete User
              </Button>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!formData.fullName || !formData.email}
                type="button"
              >
                {isEditing ? "Save Changes" : "Create User"}
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
                Are you sure you want to delete the user "{user?.fullName}"? This action cannot be undone.
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
                Delete User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

// Status badge component
const UserStatusBadge = ({ status }: { status?: string }) => {
  if (status === "active") {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        <CheckCircle2 className="h-3 w-3 mr-1" />
        Active
      </Badge>
    );
  } else if (status === "invited") {
    return (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        <Mail className="h-3 w-3 mr-1" />
        Invited
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
        <XCircle className="h-3 w-3 mr-1" />
        Inactive
      </Badge>
    );
  }
};

// Main component
export default function UserManagement() {
  const { toast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentEditingUser, setCurrentEditingUser] = useState<User | undefined>(undefined);
  
  // Fetch users, teams, and access groups
  const { data: users = mockUsers, refetch: refetchUsers } = useQuery({
    queryKey: ['/api/users'],
    queryFn: () => mockUsers,
  });
  
  const { data: teams = mockTeams } = useQuery({
    queryKey: ['/api/teams'],
    queryFn: () => mockTeams,
  });
  
  const { data: accessGroups = mockAccessGroups } = useQuery({
    queryKey: ['/api/access-groups'],
    queryFn: () => mockAccessGroups,
  });
  
  // Filtered users based on search
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    
    return users.filter((user) => 
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.position?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);
  
  // Open edit modal for a user
  const handleEditUser = (user: User) => {
    setCurrentEditingUser(user);
    setIsCreateModalOpen(true);
  };
  
  // Create or update a user
  const handleSaveUser = async (userData: any) => {
    try {
      // Since we're working with mock data, we'll simulate API operations
      if (userData.id) {
        // Update existing user
        const userIndex = mockUsers.findIndex(u => u.id === userData.id);
        if (userIndex >= 0) {
          mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
        }
        
        toast({
          title: "User updated",
          description: `${userData.fullName} has been updated successfully.`,
        });
      } else {
        // Create new user with a new ID
        const newId = Math.max(...mockUsers.map(u => u.id)) + 1;
        const newUser = {
          ...userData,
          id: newId,
        };
        
        mockUsers.push(newUser);
        
        toast({
          title: "User created",
          description: `${userData.fullName} has been created successfully.`,
        });
      }
      
      // Refetch users to update UI
      await refetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving the user.",
        variant: "destructive",
      });
      console.error("Error creating/updating user:", error);
    }
  };
  
  // Delete a user
  const handleDeleteUser = async (userId: number) => {
    try {
      // Find user index
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      
      if (userIndex >= 0) {
        // Check if user is a team leader
        const isTeamLeader = teams.some(t => t.leaderId === userId);
        
        if (isTeamLeader) {
          toast({
            title: "Cannot delete user",
            description: "This user is a team leader. Please reassign team leadership first.",
            variant: "destructive",
          });
          return;
        }
        
        // Remove the user
        const deletedUser = mockUsers[userIndex];
        mockUsers.splice(userIndex, 1);
        
        toast({
          title: "User deleted",
          description: `${deletedUser.fullName} has been deleted successfully.`,
        });
        
        // Refetch users after deletion
        await refetchUsers();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error deleting the user.",
        variant: "destructive",
      });
      console.error("Error deleting user:", error);
    }
  };
  
  // Helper to get team name
  const getTeamName = (teamId?: number) => {
    if (!teamId) return "—";
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : "—";
  };
  
  // Helper to get manager name
  const getManagerName = (managerId?: number) => {
    if (!managerId) return "—";
    const manager = users.find(u => u.id === managerId);
    return manager ? manager.fullName : "—";
  };
  
  // Helper to get access group names
  const getAccessGroupNames = (groupIds?: number[]) => {
    if (!groupIds || groupIds.length === 0) return "—";
    
    return groupIds.map(id => {
      const group = accessGroups.find(g => g.id === id);
      return group ? group.name : "";
    }).filter(Boolean).join(", ");
  };
  
  // Helper to get language name
  const getLanguageName = (code?: string) => {
    const languageMap: Record<string, string> = {
      "en": "English",
      "es": "Spanish",
      "fr": "French",
      "de": "German",
      "zh": "Chinese",
      "ja": "Japanese",
      "pt": "Portuguese"
    };
    
    return code ? languageMap[code] || code : "English";
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        heading="Users Management"
        subheading="Manage users, their roles, and access permissions."
      >
        <Button onClick={() => {
          setCurrentEditingUser(undefined);
          setIsCreateModalOpen(true);
        }}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </PageHeader>

      <div className="flex flex-col space-y-6">
        {/* Search and filters */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Users table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Access Group(s)</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div>{user.fullName}</div>
                          <div className="text-xs text-muted-foreground">{user.position || '—'}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {user.accessGroups && user.accessGroups.length > 0 ? (
                          user.accessGroups.map(groupId => {
                            const group = accessGroups.find(g => g.id === groupId);
                            return group ? (
                              <Badge key={group.id} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                <Shield className="h-3 w-3 mr-1" />
                                {group.name}
                              </Badge>
                            ) : null;
                          })
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Languages className="h-4 w-4 mr-1 text-muted-foreground" />
                        {getLanguageName(user.preferredLanguage)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.managerId ? (
                        <div className="flex items-center space-x-1">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>
                              {getInitials(getManagerName(user.managerId))}
                            </AvatarFallback>
                          </Avatar>
                          <span>{getManagerName(user.managerId)}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <UserStatusBadge status={user.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <FileEdit className="mr-2 h-4 w-4" />
                            <span>Edit User</span>
                          </DropdownMenuItem>
                          {user.status === "invited" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                <span>Resend Invitation</span>
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete User</span>
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

      {/* Create/Edit User Modal */}
      <UserForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        user={currentEditingUser}
        teams={teams}
        accessGroups={accessGroups}
        users={users}
        onSave={handleSaveUser}
        onDelete={handleDeleteUser}
      />
    </div>
  );
}