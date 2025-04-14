import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Filter, Plus, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "../components/ui/page-header";

// Status badge component for objectives
const StatusBadge = ({ status }: { status: string }) => {
  const statusMap = {
    "Completed": {
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      icon: <CheckCircle className="h-3 w-3 mr-1" />,
    },
    "In Progress": {
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      icon: <Clock className="h-3 w-3 mr-1" />,
    },
    "At Risk": {
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
      icon: <Clock className="h-3 w-3 mr-1" />,
    },
    "Behind": {
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
      icon: <Clock className="h-3 w-3 mr-1" />,
    },
  };

  const { color, icon } = statusMap[status as keyof typeof statusMap] || {
    color: "bg-gray-100 text-gray-800",
    icon: null,
  };

  return (
    <Badge variant="outline" className={`${color} flex items-center`}>
      {icon} {status}
    </Badge>
  );
};

// Objective card component
const ObjectiveCard = ({ objective }: { objective: any }) => {
  // Calculate progress based on key results
  const progress = objective.progress || 0;
  const status = objective.status || "In Progress";

  return (
    <Card className="mb-4 overflow-hidden">
      <CardHeader className="bg-card pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{objective.title}</CardTitle>
          <StatusBadge status={status} />
        </div>
        <div className="text-sm opacity-70 mt-1">{objective.description}</div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Key Results:</div>
          {objective.keyResults?.length > 0 ? (
            <ul className="space-y-1">
              {objective.keyResults.map((kr: any, idx: number) => (
                <li
                  key={idx}
                  className="text-sm pl-2 border-l-2 border-primary flex items-center"
                >
                  <span className="truncate">{kr.title}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              No key results defined
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-2">
            <div className="text-xs px-2 py-1 bg-primary bg-opacity-10 rounded text-primary">
              {objective.cycle?.name || "Current Cycle"}
            </div>
            <div className="text-xs opacity-70">
              Owner: {objective.owner?.name || "Unassigned"}
            </div>
          </div>
          <Link href={`/objective/${objective.id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ApprovedOKRs() {
  const [activeTab, setActiveTab] = useState("all");

  // Fetch approved objectives
  const { data: objectives, isLoading } = useQuery({
    queryKey: ["/api/objectives"],
    select: (data: any[]) => 
      data.filter((obj: any) => obj.status !== "Draft" && obj.isApproved === true)
  });

  // Get team-specific objectives
  const filterByTeam = (teamId: string | null) => {
    if (!objectives) return [];
    if (teamId === null) return objectives;
    return objectives.filter((obj: any) => obj.teamId === parseInt(teamId));
  };

  const filteredObjectives = filterByTeam(activeTab === "all" ? null : activeTab);

  return (
    <div className="container max-w-6xl p-6">
      <PageHeader
        title="Approved OKRs"
        description="View and track all approved objectives and key results across the organization"
        actions={
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="gap-1">
              <Filter className="h-4 w-4" /> Filter
            </Button>
          </div>
        }
      />

      <Tabs defaultValue="all" className="mt-8" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Teams</TabsTrigger>
          <TabsTrigger value="1">Product</TabsTrigger>
          <TabsTrigger value="2">Engineering</TabsTrigger>
          <TabsTrigger value="3">Marketing</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-2">
          {isLoading ? (
            <div className="text-center p-8">Loading objectives...</div>
          ) : filteredObjectives.length === 0 ? (
            <div className="text-center p-8 border rounded-lg border-dashed">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium mb-2">No approved OKRs found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                There are no approved objectives for this view.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredObjectives.map((objective: any) => (
                <ObjectiveCard key={objective.id} objective={objective} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Same content structure for other tabs */}
        <TabsContent value="1" className="space-y-4 mt-2">
          {isLoading ? (
            <div className="text-center p-8">Loading objectives...</div>
          ) : filteredObjectives.length === 0 ? (
            <div className="text-center p-8 border rounded-lg border-dashed">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium mb-2">No approved OKRs found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                There are no approved objectives for Product team.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredObjectives.map((objective: any) => (
                <ObjectiveCard key={objective.id} objective={objective} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="2" className="space-y-4 mt-2">
          {isLoading ? (
            <div className="text-center p-8">Loading objectives...</div>
          ) : filteredObjectives.length === 0 ? (
            <div className="text-center p-8 border rounded-lg border-dashed">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium mb-2">No approved OKRs found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                There are no approved objectives for Engineering team.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredObjectives.map((objective: any) => (
                <ObjectiveCard key={objective.id} objective={objective} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="3" className="space-y-4 mt-2">
          {isLoading ? (
            <div className="text-center p-8">Loading objectives...</div>
          ) : filteredObjectives.length === 0 ? (
            <div className="text-center p-8 border rounded-lg border-dashed">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium mb-2">No approved OKRs found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                There are no approved objectives for Marketing team.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredObjectives.map((objective: any) => (
                <ObjectiveCard key={objective.id} objective={objective} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}