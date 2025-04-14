import { useState, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { mockUsers, mockTeams } from "@/lib/mockData";
import {
  Check,
  ChevronRight,
  CircleUser,
  FileEdit,
  MoreHorizontal,
  Plus,
  Search,
  Users,
  FolderOpen,
  FolderClosed,
  ChevronDown,
  Code,
  Figma,
  Star,
  Globe,
  Shield,
  Phone,
  Server,
  Building,
  Rocket,
  Brush,
  BadgeAlert,
  X,
  Filter
} from "lucide-react";
import { Team, User } from "@/lib/mockData";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HexColorPicker } from "react-colorful";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Team color constants
const TEAM_COLORS = [
  "#4f46e5", // indigo
  "#0ea5e9", // sky
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#f97316", // orange
  "#14b8a6", // teal
  "#6366f1", // indigo
];

// Helper to get initials from a name
const getInitials = (name: string) => {
  const parts = name.split(" ");
  return parts.length > 1
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`
    : parts[0].substring(0, 2);
};

// Generate a team hierarchy with children
const buildTeamHierarchy = (teams: Team[]) => {
  const teamMap = new Map<number, Team & { children: (Team & { children: Team[]; level: number })[]; level: number }>();
  
  // Initialize map with all teams
  teams.forEach(team => {
    teamMap.set(team.id, { ...team, children: [], level: 0 });
  });

  // Build hierarchy
  const rootTeams: (Team & { children: any[]; level: number })[] = [];
  
  teams.forEach(team => {
    if (team.parentTeamId) {
      const parent = teamMap.get(team.parentTeamId);
      if (parent) {
        const childTeam = teamMap.get(team.id)!;
        childTeam.level = parent.level + 1;
        parent.children.push(childTeam);
      }
    } else {
      rootTeams.push(teamMap.get(team.id)!);
    }
  });

  return rootTeams;
};

// Component for creating/editing a team
const TeamFormDialog = ({
  isOpen,
  onClose,
  team,
  teams,
  users,
  onSave,
  onDelete,
}: {
  isOpen: boolean;
  onClose: () => void;
  team?: Team;
  teams: Team[];
  users: User[];
  onSave: (team: any) => void;
  onDelete?: (teamId: number) => void;
}) => {
  const isEditing = !!team;
  const [formData, setFormData] = useState<any>(
    team
      ? { ...team }
      : {
          name: "",
          description: "",
          leaderId: users.length > 0 ? users[0].id : 0,
          color: "#4f46e5",
          parentTeamId: undefined,
          members: [],
          icon: "users", // Default icon
        }
  );
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<number[]>(team?.members || []);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Available icons for the icon picker
  const availableIcons = [
    { name: "users", icon: <Users className="h-4 w-4" /> },
    { name: "code", icon: <Code className="h-4 w-4" /> },
    { name: "figma", icon: <Figma className="h-4 w-4" /> },
    { name: "star", icon: <Star className="h-4 w-4" /> },
    { name: "globe", icon: <Globe className="h-4 w-4" /> },
    { name: "shield", icon: <Shield className="h-4 w-4" /> },
    { name: "phone", icon: <Phone className="h-4 w-4" /> },
    { name: "server", icon: <Server className="h-4 w-4" /> },
    { name: "building", icon: <Building className="h-4 w-4" /> },
    { name: "rocket", icon: <Rocket className="h-4 w-4" /> },
    { name: "brush", icon: <Brush className="h-4 w-4" /> },
    { name: "megaphone", icon: <BadgeAlert className="h-4 w-4" /> },
  ];

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMemberToggle = (userId: number) => {
    setSelectedMembers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSubmit = () => {
    const updatedFormData = {
      ...formData,
      members: selectedMembers,
    };
    onSave(updatedFormData);
    onClose();
  };

  const handleDelete = () => {
    if (onDelete && team) {
      onDelete(team.id);
      onClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Team" : "Create New Team"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Edit team details and members."
                : "Create a new team by filling out the information below."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Team Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="col-span-3"
                placeholder="Engineering Team"
              />
            </div>

            {/* Icon Picker */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Team Icon</Label>
              <div className="col-span-3 flex flex-wrap gap-2">
                {availableIcons.map((iconObj) => (
                  <Button
                    key={iconObj.name}
                    type="button"
                    variant={formData.icon === iconObj.name ? "default" : "outline"}
                    className="h-8 w-8 p-0"
                    onClick={() => handleChange("icon", iconObj.name)}
                  >
                    {iconObj.icon}
                  </Button>
                ))}
              </div>
            </div>

            {/* Color Picker */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Team Color</Label>
              <div className="col-span-3 flex items-center gap-2">
                <div
                  className="h-8 w-8 rounded-full border cursor-pointer"
                  style={{ backgroundColor: formData.color || "#4f46e5" }}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                />
                <div className="flex gap-1 flex-wrap">
                  {TEAM_COLORS.map((color) => (
                    <div
                      key={color}
                      className="h-5 w-5 rounded-full border cursor-pointer hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        handleChange("color", color);
                        setShowColorPicker(false);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {showColorPicker && (
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-start-2 col-span-3">
                  <HexColorPicker
                    color={formData.color || "#4f46e5"}
                    onChange={(color) => handleChange("color", color)}
                    className="w-full max-w-[200px]"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                className="col-span-3"
                placeholder="Team description and responsibilities"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="owner" className="text-right">
                Team Owner
              </Label>
              <Select
                value={formData.leaderId?.toString()}
                onValueChange={(value) => handleChange("leaderId", parseInt(value))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a team owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Users</SelectLabel>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                          </Avatar>
                          <span>{user.fullName}</span>
                          <span className="text-xs text-muted-foreground">{user.position}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">
                Team Members
              </Label>
              <div className="col-span-3 border rounded-md p-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedMembers.length > 0 ? (
                    selectedMembers.map(memberId => {
                      const user = users.find(u => u.id === memberId);
                      return user ? (
                        <Badge 
                          key={user.id} 
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {getInitials(user.fullName)}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => handleMemberToggle(user.id)}
                          />
                        </Badge>
                      ) : null;
                    })
                  ) : (
                    <div className="text-sm text-muted-foreground">No members selected</div>
                  )}
                </div>
                <div className="max-h-32 overflow-y-auto">
                  {users.filter(u => !selectedMembers.includes(u.id)).map(user => (
                    <div 
                      key={user.id}
                      className="flex items-center gap-2 p-1 rounded hover:bg-muted cursor-pointer"
                      onClick={() => handleMemberToggle(user.id)}
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                      </Avatar>
                      <span>{user.fullName}</span>
                      <span className="text-xs text-muted-foreground">{user.position}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="parent" className="text-right">
                Parent Team
              </Label>
              <Select
                value={formData.parentTeamId?.toString() || ""}
                onValueChange={(value) =>
                  handleChange(
                    "parentTeamId",
                    value ? parseInt(value) : undefined
                  )
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="None (Top-level team)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None (Top-level team)</SelectItem>
                  <SelectGroup>
                    <SelectLabel>Teams</SelectLabel>
                    {teams
                      .filter((t) => t.id !== (team?.id || -1))
                      .map((t) => (
                        <SelectItem key={t.id} value={t.id.toString()}>
                          {t.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className={isEditing ? "justify-between" : "justify-end"}>
            {isEditing && (
              <Button 
                variant="destructive" 
                onClick={() => setShowDeleteConfirm(true)}
                type="button"
              >
                Delete Team
              </Button>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!formData.name || !formData.leaderId}
                type="button"
              >
                {isEditing ? "Save Changes" : "Create Team"}
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
                Are you sure you want to delete the team "{team?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete Team</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

// Team row with expandable sub-teams
const TeamRow = ({
  team, 
  level = 0, 
  expanded = {}, 
  onToggleExpand, 
  currentUserId,
  onEditTeam,
  allUsers
}: { 
  team: any; 
  level?: number; 
  expanded: Record<number, boolean>; 
  onToggleExpand: (id: number) => void;
  currentUserId: number;
  onEditTeam: (team: Team) => void;
  allUsers: User[];
}) => {
  const isExpanded = expanded[team.id];
  const hasChildren = team.children && team.children.length > 0;
  
  // Get owner user object
  const owner = allUsers.find(user => user.id === team.leaderId);
  
  // Check if current user is a member of this team
  const isUserMember = team.members.includes(currentUserId);

  return (
    <>
      <TableRow key={team.id} className="transition-colors hover:bg-muted/30">
        <TableCell className="font-medium">
          <div className="flex items-center">
            <div style={{ width: `${level * 24}px` }} />
            
            {hasChildren ? (
              <button 
                onClick={() => onToggleExpand(team.id)} 
                className="mr-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            ) : (
              <div className="w-6" />
            )}
            
            <div 
              className="h-6 w-6 rounded-md flex items-center justify-center mr-2"
              style={{ backgroundColor: team.color || '#4f46e5' }}
            >
              {hasChildren ? (
                isExpanded ? 
                  <FolderOpen className="h-3 w-3 text-white" /> : 
                  <FolderClosed className="h-3 w-3 text-white" />
              ) : (
                <Users className="h-3 w-3 text-white" />
              )}
            </div>
            
            <span>{team.name}</span>
          </div>
        </TableCell>
        
        <TableCell>
          <div className="flex items-center space-x-2">
            <span>{team.members.length} members</span>
            {isUserMember && (
              <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                <Check className="h-3 w-3 mr-1" />
                Joined
              </Badge>
            )}
          </div>
        </TableCell>
        
        <TableCell>
          {owner && (
            <div className="flex items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                      <AvatarFallback>{getInitials(owner.fullName)}</AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Owner: {owner.fullName}</p>
                    <p className="text-xs text-muted-foreground">{owner.position || "Team Lead"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="ml-2">{owner.fullName}</span>
            </div>
          )}
        </TableCell>
        
        <TableCell>
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
            <span>Active</span>
          </div>
        </TableCell>
        
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEditTeam(team)}>
                <FileEdit className="mr-2 h-4 w-4" />
                <span>Edit Team</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                <span>Add Members</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {/* Render child teams when expanded */}
      {isExpanded && hasChildren && team.children.map((child: any) => (
        <TeamRow 
          key={child.id}
          team={child}
          level={level + 1}
          expanded={expanded}
          onToggleExpand={onToggleExpand}
          currentUserId={currentUserId}
          onEditTeam={onEditTeam}
          allUsers={allUsers}
        />
      ))}
    </>
  );
};

// Card for team preview
const TeamCard = ({ 
  team, 
  onEditTeam,
  currentUserId,
  allUsers
}: { 
  team: Team; 
  onEditTeam: (team: Team) => void;
  currentUserId: number;
  allUsers: User[];
}) => {
  const owner = allUsers.find(user => user.id === team.leaderId);
  const isUserMember = team.members.includes(currentUserId);
  
  return (
    <Card className="h-full">
      <CardHeader className="relative pb-2">
        <div className="absolute right-2 top-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEditTeam(team)}>
                <FileEdit className="mr-2 h-4 w-4" />
                <span>Edit Team</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                <span>Manage Members</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-3">
          <div 
            className="h-10 w-10 rounded-md flex items-center justify-center"
            style={{ backgroundColor: team.color || '#4f46e5' }}
          >
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{team.name}</h3>
            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
              {team.description}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Members</span>
            <Badge variant="outline" className="font-normal">
              {team.members.length}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">Owner</span>
              {owner && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-xs">{getInitials(owner.fullName)}</AvatarFallback>
                        </Avatar>
                        <span className="ml-1 text-sm text-muted-foreground">{owner.fullName}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Owner: {owner.fullName}</p>
                      <p className="text-xs text-muted-foreground">{owner.position || "Team Lead"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Status</span>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-1.5" />
              <span className="text-sm">Active</span>
            </div>
          </div>
          
          {isUserMember && (
            <Badge variant="outline" className="mt-2 bg-green-50 text-green-700 border-green-200 w-full justify-center">
              <Check className="h-3 w-3 mr-1" />
              You are a member
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Main component
export default function TeamManagement() {
  const { toast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("hierarchy");
  const [expandedTeams, setExpandedTeams] = useState<Record<number, boolean>>({});
  const [currentEditingTeam, setCurrentEditingTeam] = useState<Team | undefined>(undefined);
  
  // Fetch teams and users (from mock data for now)
  // In a real app, this would use the queryClient to fetch from the API
  const { data: users = mockUsers } = useQuery({
    queryKey: ['/api/users'],
    queryFn: () => mockUsers,
  });
  
  const { data: teams = mockTeams, refetch: refetchTeams } = useQuery({
    queryKey: ['/api/teams'],
    queryFn: () => mockTeams,
  });
  
  // Current user - just for demonstration
  const currentUser = users[0];

  // Get hierarchical team structure
  const hierarchicalTeams = useMemo(() => buildTeamHierarchy(teams), [teams]);
  
  // Filtered teams based on search
  const filteredTeams = useMemo(() => {
    if (!searchQuery) return teams;
    
    return teams.filter((team) => 
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [teams, searchQuery]);
  
  // Toggle team expansion in hierarchy view
  const toggleTeamExpand = (teamId: number) => {
    setExpandedTeams((prev) => ({
      ...prev,
      [teamId]: !prev[teamId],
    }));
  };
  
  // Open edit modal for a team
  const handleEditTeam = (team: Team) => {
    setCurrentEditingTeam(team);
    setIsCreateModalOpen(true);
  };
  
  // Create or update a team
  const handleSaveTeam = async (teamData: any) => {
    try {
      if (teamData.id) {
        // Update existing team
        toast({
          title: "Team updated",
          description: `${teamData.name} has been updated successfully.`,
        });
      } else {
        // Create new team
        toast({
          title: "Team created",
          description: `${teamData.name} has been created successfully.`,
        });
      }
      
      // Refetch teams after changes (would make an API call in a real implementation)
      await refetchTeams();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving the team.",
        variant: "destructive",
      });
      console.error("Error creating team:", error);
    }
  };
  
  // Delete a team
  const handleDeleteTeam = async (teamId: number) => {
    try {
      // Would make an API call to delete in a real implementation
      toast({
        title: "Team deleted",
        description: "The team has been deleted successfully.",
      });
      
      // Refetch teams after deletion
      await refetchTeams();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error deleting the team.",
        variant: "destructive",
      });
      console.error("Error deleting team:", error);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        heading="Team Management"
        subheading="Create, organize, and manage teams across your organization."
      >
        <Button onClick={() => {
          setCurrentEditingTeam(undefined);
          setIsCreateModalOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Create Team
        </Button>
      </PageHeader>

      <div className="w-full flex items-center space-x-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="hierarchy">Hierarchy View</TabsTrigger>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="hierarchy" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Team Name</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hierarchicalTeams.map((team) => (
                  <TeamRow
                    key={team.id}
                    team={team}
                    expanded={expandedTeams}
                    onToggleExpand={toggleTeamExpand}
                    currentUserId={currentUser.id}
                    onEditTeam={handleEditTeam}
                    allUsers={users}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="grid">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTeams.map((team) => (
              <TeamCard 
                key={team.id} 
                team={team} 
                onEditTeam={handleEditTeam}
                currentUserId={currentUser.id}
                allUsers={users}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Team create/edit modal */}
      <TeamFormDialog
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        team={currentEditingTeam}
        teams={teams}
        users={users}
        onSave={handleSaveTeam}
        onDelete={handleDeleteTeam}
      />
    </div>
  );
}