import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CalendarPlus, 
  Clock, 
  Filter, 
  Search, 
  UserPlus, 
  MoreHorizontal,
  CalendarIcon
} from "lucide-react";
import { formatTime, formatDate, getInitials } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function OneOnOne() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch meetings data
  const { data: meetings, isLoading: meetingsLoading } = useQuery({
    queryKey: ['/api/meetings/upcoming'],
  });
  
  // Fetch users data
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['/api/users'],
  });
  
  const isLoading = meetingsLoading || usersLoading;
  
  // Get user by ID
  const getUserById = (userId: number) => {
    if (!users) return null;
    return users.find((user: any) => user.id === userId);
  };
  
  // Filter meetings by search query
  const filteredMeetings = meetings ? meetings.filter((meeting: any) => {
    const user1 = getUserById(meeting.userId1);
    const user2 = getUserById(meeting.userId2);
    
    if (!user1 || !user2) return false;
    
    return (
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user1.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user2.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }) : [];
  
  // Get status badge for meeting
  const getMeetingStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
            Completed
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
            Cancelled
          </Badge>
        );
      case 'scheduled':
      default:
        return (
          <Badge variant="outline" className="bg-primary-50 text-primary-700 hover:bg-primary-50">
            Scheduled
          </Badge>
        );
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">1:1 Meetings</h1>
          <p className="text-neutral-600">Schedule and manage one-on-one meetings with your team</p>
        </div>
        <Button className="flex items-center gap-1">
          <CalendarPlus className="h-4 w-4" />
          Schedule Meeting
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Calendar */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
            <div className="mt-4 space-y-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-primary-500 mr-2"></div>
                <span className="text-sm">Scheduled Meetings</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-neutral-300 mr-2"></div>
                <span className="text-sm">No Meetings</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Meetings */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Today's Meetings</CardTitle>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-auto flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{date ? formatDate(date) : "Select date"}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              // Loading state
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <Skeleton className="h-4 w-36 mb-1" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </div>
                      <div className="mt-2 flex items-center">
                        <Skeleton className="h-4 w-4 mr-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : meetings && meetings.length > 0 ? (
              <div className="space-y-4">
                {meetings.slice(0, 3).map((meeting: any) => {
                  const participant = getUserById(meeting.userId2);
                  if (!participant) return null;
                  
                  return (
                    <div key={meeting.id} className="flex items-start group">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{getInitials(participant.fullName)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-neutral-900">{participant.fullName}</p>
                            <p className="text-xs text-neutral-500 mt-0.5">{participant.role}</p>
                          </div>
                          <Badge 
                            variant="outline"
                            className="bg-primary-100 text-primary-800 hover:bg-primary-100"
                          >
                            {formatDate(meeting.startTime)}
                          </Badge>
                        </div>
                        <div className="mt-2 flex items-center text-xs text-neutral-600">
                          <Clock className="h-4 w-4 text-neutral-400 mr-1" />
                          <span>{formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500">
                No meetings scheduled for today
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search meetings..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          <Tabs defaultValue="upcoming">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="all">All Meetings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="pt-4">
              {isLoading ? (
                // Loading state
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-9 w-16 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                // Data table
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMeetings.length > 0 ? (
                      filteredMeetings.map((meeting: any) => {
                        const participant1 = getUserById(meeting.userId1);
                        const participant2 = getUserById(meeting.userId2);
                        
                        if (!participant1 || !participant2) return null;
                        
                        return (
                          <TableRow key={meeting.id}>
                            <TableCell className="font-medium">{meeting.title}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>{getInitials(participant1.fullName)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{participant1.fullName}</span>
                                <span className="text-neutral-400 mx-1">and</span>
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>{getInitials(participant2.fullName)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{participant2.fullName}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="text-sm">{formatDate(meeting.startTime)}</p>
                                <p className="text-xs text-neutral-500">{formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getMeetingStatusBadge(meeting.status)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">View</Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-neutral-500">
                          No meetings found matching your search
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
            
            <TabsContent value="past" className="pt-4">
              <div className="text-neutral-600 py-8 text-center">
                Past meetings would be displayed here
              </div>
            </TabsContent>
            
            <TabsContent value="all" className="pt-4">
              <div className="text-neutral-600 py-8 text-center">
                All meetings history would be displayed here
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
