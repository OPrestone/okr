import { useState } from "react";
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
} from "lucide-react";
import { Team, User } from "@/lib/mockData";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HexColorPicker } from "react-colorful";

// Add these Team color constants
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
}: {
  isOpen: boolean;
  onClose: () => void;
  team?: Team;
  teams: Team[];
  users: User[];
  onSave: (team: any) => void;
}) => {
  const isEditing = !!team;
  const [formData, setFormData] = useState<any>(
    team
      ? { ...team }
      : {
          name: "",
          description: "",
          leaderId: 0,
          color: "#4f46e5",
          parentTeamId: undefined,
          members: [],
        }
  );
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
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
                      {user.fullName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
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

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!formData.name || !formData.leaderId}>
            {isEditing ? "Save Changes" : "Create Team"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
  
  // Simulate team members count based on team id
  const memberCount = (team.id * 3) % 7 + 2; // Just a formula to generate varying counts
  const isUserMember = team.id % 3 === 0; // Simulate current user membership

  return (
    <>
      <TableRow key={team.id}>
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
            <span>{memberCount} members</span>
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
                    <p>{owner.fullName}</p>
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
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEditTeam(team)}>
                <FileEdit className="mr-2 h-4 w-4" />
                <span>Edit Team</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
              >
                Archive Team
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
      
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

export default function TeamManagement() {
  // Get team and user data
  const { data: teams = mockTeams } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
    placeholderData: mockTeams,
  });

  const { data: users = mockUsers } = useQuery<User[]>({
    queryKey: ["/api/users"],
    placeholderData: mockUsers,
  });

  // Current user (for highlighting joined teams)
  const currentUserId = 1; // Mock current user ID
  
  // State for UI controls
  const [tab, setTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedTeams, setExpandedTeams] = useState<Record<number, boolean>>({});
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | undefined>(undefined);

  // Build team hierarchy
  const teamHierarchy = buildTeamHierarchy(teams);

  // Toggle team expansion
  const toggleTeamExpand = (teamId: number) => {
    setExpandedTeams(prev => ({
      ...prev,
      [teamId]: !prev[teamId]
    }));
  };

  // Filter teams based on search and tab
  const filteredTeams = teamHierarchy.filter(team => {
    // First, filter by search term if provided
    if (searchTerm) {
      return team.name.toLowerCase().includes(searchTerm.toLowerCase());
    }

    // Then, filter by tab
    switch (tab) {
      case "active":
        return true; // All teams are active in this mock
      case "archived":
        return false; // No archived teams in mock data
      case "my-teams":
        return team.id % 3 === 0; // Mock "joined" teams
      case "all":
        return true;
      default:
        return true;
    }
  });

  // Handle team creation/editing
  const handleSaveTeam = (teamData: any) => {
    console.log("Saving team:", teamData);
    // Would make API call here to save team
    // Then invalidate queries to refresh data
  };

  // Handle editing a team
  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
  };

  return (
    <div className="container py-6 max-w-7xl mx-auto">
      <PageHeader
        heading="Team Management"
        subheading="Create and manage teams across your organization"
      />

      <div className="mb-6 flex items-center justify-between">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
            <TabsTrigger value="my-teams">My Teams</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2 ml-auto">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search teams..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[280px]">Name</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {searchTerm 
                    ? "No teams match your search criteria" 
                    : tab === "archived" 
                      ? "No archived teams found" 
                      : tab === "my-teams" 
                        ? "You haven't joined any teams yet" 
                        : "No teams found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredTeams.map((team) => (
                <TeamRow
                  key={team.id}
                  team={team}
                  expanded={expandedTeams}
                  onToggleExpand={toggleTeamExpand}
                  currentUserId={currentUserId}
                  onEditTeam={handleEditTeam}
                  allUsers={users}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Team Dialog */}
      {createDialogOpen && (
        <TeamFormDialog
          isOpen={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          teams={teams}
          users={users}
          onSave={handleSaveTeam}
        />
      )}

      {/* Edit Team Dialog */}
      {editingTeam && (
        <TeamFormDialog
          isOpen={!!editingTeam}
          onClose={() => setEditingTeam(undefined)}
          team={editingTeam}
          teams={teams}
          users={users}
          onSave={handleSaveTeam}
        />
      )}
    </div>
  );
}