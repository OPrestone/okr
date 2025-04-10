import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, BarChart, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials } from "@/lib/utils";

// Team card component
function TeamCard({ team, users }: { team: any; users: any[] }) {
  // Get team leader
  const teamLeader = users.find(user => user.id === team.leaderId);
  
  // Get team members
  const teamMembers = users.filter(user => user.teamId === team.id);
  
  // Determine progress color
  const getProgressColor = (performance: number) => {
    if (performance >= 85) return "bg-green-500";
    if (performance >= 70) return "bg-primary-500";
    return "bg-amber-500";
  };

  // Team colors for avatar
  const teamColors = [
    { bg: "bg-primary-100", text: "text-primary-700" },
    { bg: "bg-indigo-100", text: "text-indigo-700" },
    { bg: "bg-amber-100", text: "text-amber-700" },
    { bg: "bg-rose-100", text: "text-rose-700" },
    { bg: "bg-green-100", text: "text-green-700" },
    { bg: "bg-purple-100", text: "text-purple-700" }
  ];
  
  // Random index for team colors
  const colorIndex = team.id % teamColors.length;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full ${teamColors[colorIndex].bg} flex items-center justify-center ${teamColors[colorIndex].text} font-medium`}>
              {getInitials(team.name)}
            </div>
            <CardTitle className="ml-3 text-lg">{team.name}</CardTitle>
          </div>
          <Button variant="ghost" size="sm">View</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-2 mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-neutral-500">Performance</span>
            <span className="text-sm font-medium">{team.performance}%</span>
          </div>
          <Progress 
            value={team.performance} 
            className={getProgressColor(team.performance)}
          />
        </div>
        
        {teamLeader && (
          <div className="mb-4">
            <span className="text-sm text-neutral-500 block mb-2">Team Lead</span>
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarFallback>{getInitials(teamLeader.fullName)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{teamLeader.fullName}</span>
            </div>
          </div>
        )}
        
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-neutral-500">Team Members</span>
            <span className="text-sm font-medium">{team.memberCount}</span>
          </div>
          <div className="flex -space-x-2">
            {teamMembers.slice(0, 5).map(member => (
              <Avatar key={member.id} className="h-7 w-7 border-2 border-white">
                <AvatarFallback>{getInitials(member.fullName)}</AvatarFallback>
              </Avatar>
            ))}
            {team.memberCount > 5 && (
              <div className="h-7 w-7 rounded-full bg-neutral-100 border-2 border-white flex items-center justify-center text-xs text-neutral-600 font-medium">
                +{team.memberCount - 5}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Teams() {
  const { data: teams, isLoading: teamsLoading } = useQuery({
    queryKey: ['/api/teams'],
  });
  
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['/api/users'],
  });
  
  const isLoading = teamsLoading || usersLoading;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Teams</h1>
          <p className="text-neutral-600">Manage and track team performance and objectives</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <BarChart className="h-4 w-4" />
            Performance Report
          </Button>
          <Button className="flex items-center gap-1" asChild>
            <Link href="/create-team">
              <Plus className="h-4 w-4" />
              Add Team
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading state
          [...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-5 w-32 ml-3" />
                  </div>
                  <Skeleton className="h-9 w-16" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="mt-2 mb-4">
                  <div className="flex justify-between mb-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
                <div className="mb-4">
                  <Skeleton className="h-4 w-16 mb-2" />
                  <div className="flex items-center">
                    <Skeleton className="h-6 w-6 mr-2 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-6" />
                  </div>
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-7 w-7 rounded-full" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          // Data view
          teams && users && teams.map((team: any) => (
            <TeamCard key={team.id} team={team} users={users} />
          ))
        )}
        
        {/* Add Team Card */}
        <Card className="flex flex-col items-center justify-center py-8 border-dashed">
          <Users className="h-12 w-12 text-neutral-300 mb-3" />
          <h3 className="text-lg font-medium text-neutral-900 mb-1">Create a New Team</h3>
          <p className="text-sm text-neutral-500 text-center mb-4 px-8">
            Set up a new team and assign team members and objectives
          </p>
          <Button variant="default" className="flex items-center gap-1" asChild>
            <Link href="/create-team">
              <Plus className="h-4 w-4" />
              Add Team
            </Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
