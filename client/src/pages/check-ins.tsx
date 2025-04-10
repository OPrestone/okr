import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BarChart, LineChart, Calendar, CalendarDays, Clock, ListChecks, ArrowUpRight, CalendarClock, BarChart4, LineChart as LineChartIcon, ChevronRight, MessageSquare, ThumbsUp, AlertCircle, CheckCircle, UserRound, Users } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { 
  LineChart as ReLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend
} from "recharts";

// Mock data for demo purposes
const checkInData = [
  {
    id: 1,
    date: new Date(2023, 8, 5),
    keyResult: {
      id: 101,
      title: "Increase customer retention rate from 75% to 85%",
      objective: {
        id: 1,
        title: "Improve customer satisfaction and loyalty",
      },
      targetValue: 85,
      currentValue: 79,
      startValue: 75,
      progress: 40,
    },
    previousProgress: 30,
    progress: 40,
    comment: "We've implemented a new customer feedback system and are seeing positive results. Need to work on response time to customer inquiries.",
    confidenceLevel: "On Track",
    createdBy: {
      id: 1,
      name: "Alex Morgan",
      avatar: null,
    },
    comments: [
      {
        id: 1,
        content: "Great progress! Let's discuss the feedback system in our next meeting.",
        author: {
          id: 2,
          name: "Jamie Taylor",
          avatar: null,
        },
        createdAt: new Date(2023, 8, 5, 14, 30),
      }
    ]
  },
  {
    id: 2,
    date: new Date(2023, 8, 12),
    keyResult: {
      id: 102,
      title: "Launch new loyalty program with 5000 sign-ups",
      objective: {
        id: 1,
        title: "Improve customer satisfaction and loyalty",
      },
      targetValue: 5000,
      currentValue: 3200,
      startValue: 0,
      progress: 64,
    },
    previousProgress: 45,
    progress: 64,
    comment: "The loyalty program launch went well, and we're seeing strong sign-ups. Marketing campaign is performing above expectations.",
    confidenceLevel: "On Track",
    createdBy: {
      id: 1,
      name: "Alex Morgan",
      avatar: null,
    },
    comments: []
  },
  {
    id: 3,
    date: new Date(2023, 8, 19),
    keyResult: {
      id: 103,
      title: "Reduce customer support response time from 8 hours to 2 hours",
      objective: {
        id: 2,
        title: "Enhance customer experience",
      },
      targetValue: 2,
      currentValue: 3.5,
      startValue: 8,
      progress: 75,
    },
    previousProgress: 60,
    progress: 75,
    comment: "New ticketing system has helped reduce response times significantly. Still working on staffing during peak hours.",
    confidenceLevel: "At Risk",
    createdBy: {
      id: 3,
      name: "Jordan Lee",
      avatar: null,
    },
    comments: [
      {
        id: 2,
        content: "Can we look at additional temporary staffing for peak hours?",
        author: {
          id: 4,
          name: "Taylor Swift",
          avatar: null,
        },
        createdAt: new Date(2023, 8, 19, 16, 45),
      }
    ]
  }
];

// Mock trend data
const trendData = [
  { date: "Week 1", value: 10 },
  { date: "Week 2", value: 25 },
  { date: "Week 3", value: 30 },
  { date: "Week 4", value: 40 },
  { date: "Week 5", value: 55 },
  { date: "Week 6", value: 64 },
  { date: "Week 7", value: 68 },
  { date: "Week 8", value: 75 },
];

// Mock team data
const teamCheckInsData = [
  {
    id: 1,
    team: "Product Team",
    objective: "Launch version 2.0 of our flagship product",
    checkInCount: 24,
    avgProgress: 68,
    atRiskCount: 1,
    lastCheckIn: new Date(2023, 8, 20),
  },
  {
    id: 2,
    team: "Marketing Team",
    objective: "Increase brand awareness by 40%",
    checkInCount: 18,
    avgProgress: 72,
    atRiskCount: 0,
    lastCheckIn: new Date(2023, 8, 19),
  },
  {
    id: 3,
    team: "Engineering Team",
    objective: "Reduce system downtime by 99.9%",
    checkInCount: 22,
    avgProgress: 85,
    atRiskCount: 0,
    lastCheckIn: new Date(2023, 8, 21),
  },
  {
    id: 4,
    team: "Sales Team",
    objective: "Increase quarterly revenue by 30%",
    checkInCount: 16,
    avgProgress: 42,
    atRiskCount: 2,
    lastCheckIn: new Date(2023, 8, 18),
  }
];

// Mock key results data needing check-in
const needsCheckInData = [
  {
    id: 201,
    title: "Increase website conversion rate from 2% to 3.5%",
    objective: {
      id: 3, 
      title: "Optimize digital marketing performance"
    },
    owner: {
      id: 4,
      name: "Taylor Swift",
      avatar: null,
    },
    dueDate: new Date(2023, 8, 22),
    lastCheckIn: new Date(2023, 8, 8)
  },
  {
    id: 202,
    title: "Reduce customer acquisition cost by 20%",
    objective: {
      id: 3, 
      title: "Optimize digital marketing performance"
    },
    owner: {
      id: 1,
      name: "Alex Morgan",
      avatar: null,
    },
    dueDate: new Date(2023, 8, 23),
    lastCheckIn: new Date(2023, 8, 9)
  },
  {
    id: 203,
    title: "Complete security audit and fix all critical issues",
    objective: {
      id: 4, 
      title: "Strengthen security and compliance"
    },
    owner: {
      id: 3,
      name: "Jordan Lee",
      avatar: null,
    },
    dueDate: new Date(2023, 8, 24),
    lastCheckIn: new Date(2023, 8, 10)
  }
];

function ConfidenceBadge({ level }: { level: string }) {
  switch (level) {
    case "On Track":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          <span>On Track</span>
        </Badge>
      );
    case "At Risk":
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          <span>At Risk</span>
        </Badge>
      );
    case "Off Track":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          <span>Off Track</span>
        </Badge>
      );
    default:
      return null;
  }
}

function ProgressIndicator({ previous, current }: { previous: number; current: number }) {
  const change = current - previous;
  const indicator = change > 0 ? "positive" : change < 0 ? "negative" : "neutral";
  
  return (
    <div className="flex items-center gap-1">
      <div className="h-2 bg-gray-100 rounded-full w-24 overflow-hidden">
        <div 
          className="h-full bg-primary-600 rounded-full" 
          style={{ width: `${current}%` }}
        />
      </div>
      <span className="text-sm">{current}%</span>
      {indicator !== "neutral" && (
        <span 
          className={cn(
            "text-xs flex items-center",
            indicator === "positive" ? "text-green-600" : "text-red-600"
          )}
        >
          {indicator === "positive" ? "+" : ""}{change}%
          {indicator === "positive" && <ArrowUpRight className="h-3 w-3" />}
        </span>
      )}
    </div>
  );
}

// Main Check-in form component
function CheckInForm({ keyResult, onClose }: { keyResult: any; onClose: () => void }) {
  const [progress, setProgress] = useState(keyResult.progress || 0);
  const [confidence, setConfidence] = useState("On Track");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Check-in submitted",
        description: "Your progress update has been recorded.",
      });
      onClose();
    }, 1000);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-500">Objective</h3>
        <p className="text-base font-medium">{keyResult.objective.title}</p>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-500">Key Result</h3>
        <p className="text-base font-medium">{keyResult.title}</p>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Current Progress ({progress}%)</h3>
        <Slider
          value={[progress]}
          onValueChange={(value) => setProgress(value[0])}
          max={100}
          step={1}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">Confidence Level</h3>
        <Select
          value={confidence}
          onValueChange={setConfidence}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select confidence level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="On Track">On Track</SelectItem>
            <SelectItem value="At Risk">At Risk</SelectItem>
            <SelectItem value="Off Track">Off Track</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">Comments & Context</h3>
        <Textarea
          placeholder="Share updates, blockers, or context about your progress..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="resize-none"
        />
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Check-in"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function CheckIns() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedKeyResult, setSelectedKeyResult] = useState<any>(null);
  
  // Function to handle opening the check-in modal
  const handleOpenCheckIn = (keyResult: any) => {
    setSelectedKeyResult(keyResult);
    setOpenModal(true);
  };
  
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Check-ins</h1>
          <p className="text-muted-foreground">
            Keep track of progress and updates on objectives and key results
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>Set Reminder</span>
          </Button>
          <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <ListChecks className="h-4 w-4" />
                <span>Create Check-in</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create New Check-in</DialogTitle>
                <DialogDescription>
                  Update progress on a key result and provide context on your work.
                </DialogDescription>
              </DialogHeader>
              {selectedKeyResult && (
                <CheckInForm 
                  keyResult={selectedKeyResult} 
                  onClose={() => setOpenModal(false)} 
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            <span>Upcoming Check-ins</span>
          </TabsTrigger>
          <TabsTrigger value="my-checkins" className="flex items-center gap-2">
            <UserRound className="h-4 w-4" />
            <span>My Check-ins</span>
          </TabsTrigger>
          <TabsTrigger value="team-checkins" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Team Check-ins</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <LineChartIcon className="h-4 w-4" />
            <span>Trends</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Upcoming Check-ins Tab */}
        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Needs Check-in</h2>
              
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Key Result</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Last Check-in</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {needsCheckInData.map((kr) => (
                        <TableRow key={kr.id} className="h-16">
                          <TableCell>
                            <div>
                              <p className="font-medium">{kr.title}</p>
                              <p className="text-sm text-muted-foreground">{kr.objective.title}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>{getInitials(kr.owner.name)}</AvatarFallback>
                              </Avatar>
                              <span>{kr.owner.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {format(kr.lastCheckIn, "MMM d")}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <CalendarClock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{format(kr.dueDate, "MMM d")}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              onClick={() => handleOpenCheckIn(kr)}
                            >
                              Check-in
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Check-in Schedule</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Schedule</CardTitle>
                  <CardDescription>Your regular check-in schedule</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between gap-2 py-2 border-b">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Team OKRs</p>
                        <p className="text-sm text-muted-foreground">Weekly update</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Monday</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between gap-2 py-2 border-b">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center">
                        <BarChart className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Personal OKRs</p>
                        <p className="text-sm text-muted-foreground">Weekly update</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Wednesday</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between gap-2 py-2">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center">
                        <LineChart className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Project OKRs</p>
                        <p className="text-sm text-muted-foreground">Bi-weekly update</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Friday</Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Configure Reminders
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* My Check-ins Tab */}
        <TabsContent value="my-checkins">
          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Check-ins</h2>
              <div className="flex items-center space-x-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Check-ins</SelectItem>
                    <SelectItem value="mine">Created by me</SelectItem>
                    <SelectItem value="team">My team's</SelectItem>
                  </SelectContent>
                </Select>
                <Input 
                  placeholder="Search check-ins..." 
                  className="w-64"
                />
              </div>
            </div>
            
            {checkInData.map((checkIn) => (
              <Card key={checkIn.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-4">
                    <div className="p-6 md:border-r">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {format(checkIn.date, "MMMM d, yyyy")}
                          </p>
                          <h3 className="text-lg font-semibold">
                            {checkIn.keyResult.objective.title}
                          </h3>
                        </div>
                        <ConfidenceBadge level={checkIn.confidenceLevel} />
                      </div>
                      
                      <p className="font-medium mb-1">{checkIn.keyResult.title}</p>
                      
                      <div className="mt-4">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Progress</p>
                        <ProgressIndicator 
                          previous={checkIn.previousProgress} 
                          current={checkIn.progress} 
                        />
                      </div>
                      
                      <div className="flex items-center gap-2 mt-4">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{getInitials(checkIn.createdBy.name)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{checkIn.createdBy.name}</span>
                      </div>
                    </div>
                    
                    <div className="p-6 md:col-span-3">
                      <div>
                        <p className="font-medium text-muted-foreground mb-2">Comments & Context</p>
                        <p>{checkIn.comment}</p>
                      </div>
                      
                      {checkIn.comments.length > 0 && (
                        <div className="mt-6">
                          <p className="font-medium text-muted-foreground mb-2">
                            Feedback ({checkIn.comments.length})
                          </p>
                          <div className="space-y-4">
                            {checkIn.comments.map((comment) => (
                              <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-center gap-2 mb-1">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback>{getInitials(comment.author.name)}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm font-medium">{comment.author.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {format(comment.createdAt, "MMM d, h:mm a")}
                                  </span>
                                </div>
                                <p className="text-sm">{comment.content}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4 pt-4 border-t flex items-center space-x-2">
                        <Input 
                          placeholder="Add a comment or feedback..." 
                          className="flex-1"
                        />
                        <Button variant="secondary" size="sm" className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>Comment</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Team Check-ins Tab */}
        <TabsContent value="team-checkins">
          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Team Check-in Statistics</h2>
              <Select defaultValue="all">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  <SelectItem value="product">Product Team</SelectItem>
                  <SelectItem value="marketing">Marketing Team</SelectItem>
                  <SelectItem value="engineering">Engineering Team</SelectItem>
                  <SelectItem value="sales">Sales Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Check-ins</p>
                      <p className="text-3xl font-bold">86</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
                      <ListChecks className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg. Completion</p>
                      <p className="text-3xl font-bold">67%</p>
                    </div>
                    <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
                      <BarChart className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">At Risk Items</p>
                      <p className="text-3xl font-bold">3</p>
                    </div>
                    <div className="h-12 w-12 bg-amber-50 rounded-full flex items-center justify-center">
                      <AlertCircle className="h-6 w-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Engagement</p>
                      <p className="text-3xl font-bold">92%</p>
                    </div>
                    <div className="h-12 w-12 bg-purple-50 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Team Check-in Overview</CardTitle>
                <CardDescription>Recent check-ins by team</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team</TableHead>
                      <TableHead>Primary Objective</TableHead>
                      <TableHead>Check-ins</TableHead>
                      <TableHead>Avg Progress</TableHead>
                      <TableHead>At Risk</TableHead>
                      <TableHead>Last Check-in</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamCheckInsData.map((team) => (
                      <TableRow key={team.id}>
                        <TableCell className="font-medium">{team.team}</TableCell>
                        <TableCell>{team.objective}</TableCell>
                        <TableCell>{team.checkInCount}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-2 bg-gray-100 rounded-full w-24 overflow-hidden">
                              <div 
                                className="h-full bg-primary-600 rounded-full" 
                                style={{ width: `${team.avgProgress}%` }}
                              />
                            </div>
                            <span>{team.avgProgress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{team.atRiskCount}</TableCell>
                        <TableCell>{format(team.lastCheckIn, "MMM d")}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Trends Tab */}
        <TabsContent value="trends">
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Progress Trend</CardTitle>
                  <CardDescription>Key result completion over time</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Confidence Levels</CardTitle>
                  <CardDescription>
                    Distribution of confidence ratings over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { week: "Week 1", onTrack: 5, atRisk: 3, offTrack: 1 },
                        { week: "Week 2", onTrack: 6, atRisk: 2, offTrack: 1 },
                        { week: "Week 3", onTrack: 8, atRisk: 1, offTrack: 0 },
                        { week: "Week 4", onTrack: 7, atRisk: 2, offTrack: 0 },
                        { week: "Week 5", onTrack: 8, atRisk: 1, offTrack: 0 },
                        { week: "Week 6", onTrack: 9, atRisk: 0, offTrack: 0 },
                        { week: "Week 7", onTrack: 8, atRisk: 1, offTrack: 0 },
                        { week: "Week 8", onTrack: 7, atRisk: 2, offTrack: 0 },
                      ]}
                      stackOffset="none"
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="onTrack"
                        stackId="1"
                        stroke="#22c55e"
                        fill="#22c55e"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="atRisk"
                        stackId="1"
                        stroke="#f59e0b"
                        fill="#f59e0b"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="offTrack"
                        stackId="1"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Check-in Activity</CardTitle>
                <CardDescription>
                  Team member participation and engagement
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team Member</TableHead>
                      <TableHead>Check-ins</TableHead>
                      <TableHead>Comments</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Engagement</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>AM</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Alex Morgan</p>
                            <p className="text-xs text-muted-foreground">Product Manager</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>24</TableCell>
                      <TableCell>18</TableCell>
                      <TableCell>Today</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <div className="h-2 bg-gray-100 rounded-full w-24 overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full" 
                              style={{ width: "90%" }}
                            />
                          </div>
                          <span>High</span>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>JL</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Jordan Lee</p>
                            <p className="text-xs text-muted-foreground">Engineering Lead</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>18</TableCell>
                      <TableCell>12</TableCell>
                      <TableCell>Yesterday</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <div className="h-2 bg-gray-100 rounded-full w-24 overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full" 
                              style={{ width: "85%" }}
                            />
                          </div>
                          <span>High</span>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>TS</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Taylor Swift</p>
                            <p className="text-xs text-muted-foreground">Marketing Director</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>16</TableCell>
                      <TableCell>23</TableCell>
                      <TableCell>Yesterday</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <div className="h-2 bg-gray-100 rounded-full w-24 overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full" 
                              style={{ width: "95%" }}
                            />
                          </div>
                          <span>High</span>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>JT</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Jamie Taylor</p>
                            <p className="text-xs text-muted-foreground">Sales Director</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>12</TableCell>
                      <TableCell>8</TableCell>
                      <TableCell>2 days ago</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <div className="h-2 bg-gray-100 rounded-full w-24 overflow-hidden">
                            <div 
                              className="h-full bg-amber-500 rounded-full" 
                              style={{ width: "65%" }}
                            />
                          </div>
                          <span>Medium</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}