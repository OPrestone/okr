import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, 
  ChevronRight, 
  MoreHorizontal, 
  ChevronUp, 
  Circle, 
  CheckCircle,
  ExternalLink
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  name: string;
  initials: string;
  color: string;
}

interface KeyResult {
  id: string;
  title: string;
  progress: number;
  progressChange: number;
  owner: User;
}

interface Objective {
  id: string;
  title: string;
  keyResults: KeyResult[];
  progress: number;
  progressChange: number;
  confidence: string;
  owner: User;
  isExpanded: boolean;
}

interface Group {
  id: string;
  name: string;
  badgeCount: number;
  objectives: Objective[];
  isExpanded: boolean;
}

interface CheckIn {
  id: string;
  team: string;
  progress: string;
  dueDate: string;
}

interface Todo {
  id: string;
  type: 'key-result' | 'check-in';
  title: string;
  dueDate: string;
}

export default function MyOKRs() {
  // Mock data for groups (quarters and teams)
  const [groups, setGroups] = useState<Group[]>([
    {
      id: 'q1-2025',
      name: 'Q1 2025',
      badgeCount: 2,
      isExpanded: true,
      objectives: [
        {
          id: 'obj-1',
          title: 'Provide technological and digital solutions to generate 1.5B in revenue and a cum audience of 37M',
          progress: 20,
          progressChange: 20,
          confidence: 'Medium',
          owner: { id: 'user-1', name: 'Alex Morgan', initials: 'AM', color: 'bg-blue-500' },
          isExpanded: true,
          keyResults: [
            {
              id: 'kr-1',
              title: '100% Implement new ERP to fully automate all divisions and processes',
              progress: 40,
              progressChange: 40,
              owner: { id: 'user-2', name: 'Jane Doe', initials: 'JD', color: 'bg-green-500' },
            },
            {
              id: 'kr-2',
              title: '100% Build and Rollout of Innovative Digital Products',
              progress: 0,
              progressChange: 0,
              owner: { id: 'user-2', name: 'Jane Doe', initials: 'JD', color: 'bg-green-500' },
            }
          ]
        },
        {
          id: 'obj-2',
          title: 'Generate 1.5Billion shillings in sales revenue and a cum audience of 37 Million listeners for the year 2025',
          progress: 0,
          progressChange: 0,
          confidence: '',
          owner: { id: 'user-3', name: 'Bonface Gitonga', initials: 'BG', color: 'bg-purple-500' },
          isExpanded: false,
          keyResults: []
        }
      ]
    },
    {
      id: 'ict',
      name: 'ICT',
      badgeCount: 1,
      isExpanded: true,
      objectives: [
        {
          id: 'obj-3',
          title: '100% System Uptime',
          progress: 0,
          progressChange: 0,
          confidence: '',
          owner: { id: 'user-2', name: 'Jane Doe', initials: 'JD', color: 'bg-green-500' },
          isExpanded: true,
          keyResults: [
            {
              id: 'kr-3',
              title: '100% Email System uptime',
              progress: 0,
              progressChange: 0,
              owner: { id: 'user-2', name: 'Jane Doe', initials: 'JD', color: 'bg-green-500' },
            }
          ]
        }
      ]
    }
  ]);

  // Mock data for check-ins
  const [checkIns, setCheckIns] = useState<CheckIn[]>([
    {
      id: 'check-1',
      team: 'Executive Team',
      progress: '0/1 published',
      dueDate: 'Due on Sunday',
    },
    {
      id: 'check-2',
      team: 'ICT Team',
      progress: '0/3 published',
      dueDate: 'Due on Sunday',
    }
  ]);

  // Mock data for todos
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: 'todo-1',
      type: 'key-result',
      title: '100% Email System uptime',
      dueDate: 'Due on 12 Apr',
    },
    {
      id: 'todo-2',
      type: 'key-result',
      title: '100% Build and Rollout of Innovative Digital Products',
      dueDate: 'Due on 24 Mar',
    },
    {
      id: 'todo-3',
      type: 'key-result',
      title: '100% Implement new ERP to fully automate all divisions...',
      dueDate: 'Due on 24 Mar',
    },
    {
      id: 'todo-4',
      type: 'check-in',
      title: 'Executive Team',
      dueDate: 'Due on Sunday',
    },
    {
      id: 'todo-5',
      type: 'check-in',
      title: 'ICT Team',
      dueDate: 'Due on Sunday',
    }
  ]);

  // Toggle group expansion
  const toggleGroup = (groupId: string) => {
    setGroups(groups.map(group => 
      group.id === groupId ? { ...group, isExpanded: !group.isExpanded } : group
    ));
  };

  // Toggle objective expansion
  const toggleObjective = (groupId: string, objectiveId: string) => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? { 
            ...group, 
            objectives: group.objectives.map(obj => 
              obj.id === objectiveId ? { ...obj, isExpanded: !obj.isExpanded } : obj
            )
          }
        : group
    ));
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">My OKRs</h1>
          <p className="text-gray-600 text-sm">Owned by me and my teams</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <ExternalLink className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export</DropdownMenuItem>
              <DropdownMenuItem>Filter</DropdownMenuItem>
              <DropdownMenuItem>Print</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main OKR Content */}
      <div className="space-y-4">
        {groups.map(group => (
          <div key={group.id} className="border rounded-md overflow-hidden bg-white shadow-sm">
            {/* Group Header */}
            <div 
              className="p-3 border-b bg-gray-50 flex items-center cursor-pointer"
              onClick={() => toggleGroup(group.id)}
            >
              {group.isExpanded ? (
                <ChevronDown className="h-4 w-4 mr-2 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-2 text-gray-500" />
              )}
              <span className="font-medium">{group.name}</span>
              {group.badgeCount > 0 && (
                <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                  {group.badgeCount}
                </span>
              )}
              <div className="flex-1" />
              <div className="grid grid-cols-3 gap-12 text-sm text-gray-500">
                <span>Confidence</span>
                <span>Owner</span>
                <span>Progress</span>
              </div>
            </div>

            {/* Group Content */}
            {group.isExpanded && (
              <div>
                {group.objectives.map(objective => (
                  <div key={objective.id} className="border-b last:border-b-0">
                    {/* Objective */}
                    <div className="flex items-start p-4">
                      <div 
                        className="p-1 cursor-pointer"
                        onClick={() => toggleObjective(group.id, objective.id)}
                      >
                        <Circle className="h-4 w-4 text-blue-500" fill="#3B82F6" />
                      </div>
                      <div className="flex-1 ml-2">
                        <div className="font-medium text-gray-900">{objective.title}</div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="w-20 text-center">
                          {objective.confidence ? (
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                              {objective.confidence}
                            </Badge>
                          ) : (
                            <span>—</span>
                          )}
                        </div>
                        <div className="w-20 flex justify-center">
                          {objective.owner ? (
                            <div className={`h-8 w-8 rounded-full ${objective.owner.color} text-white flex items-center justify-center font-medium`}>
                              {objective.owner.initials}
                            </div>
                          ) : (
                            <span>—</span>
                          )}
                        </div>
                        <div className="w-32 flex items-center">
                          <Progress className="h-2 w-16 mr-2" value={objective.progress} />
                          <span className="text-sm">{objective.progress}%</span>
                          {objective.progressChange > 0 && (
                            <span className="ml-1 text-xs text-green-600">
                              +{objective.progressChange}%
                            </span>
                          )}
                        </div>
                        <div className="ml-4">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ChevronLeft className="h-4 w-4 text-gray-400" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Key Results (if objective is expanded) */}
                    {objective.isExpanded && objective.keyResults.length > 0 && (
                      <div className="pl-12 border-t border-gray-100">
                        {objective.keyResults.map(keyResult => (
                          <div key={keyResult.id} className="flex items-center py-3 px-4 border-b last:border-b-0 border-gray-100">
                            <div className="p-1">
                              <Circle className="h-3 w-3 text-green-500" fill="#22C55E" />
                            </div>
                            <div className="flex-1 ml-2">
                              <div className="text-sm text-gray-700">{keyResult.title}</div>
                            </div>
                            <div className="flex items-center gap-8">
                              <div className="w-20 text-center">
                                {/* Empty for confidence column */}
                              </div>
                              <div className="w-20 flex justify-center">
                                <div className={`h-8 w-8 rounded-full ${keyResult.owner.color} text-white flex items-center justify-center font-medium`}>
                                  {keyResult.owner.initials}
                                </div>
                              </div>
                              <div className="w-32 flex items-center">
                                <Progress className="h-2 w-16 mr-2" value={keyResult.progress} />
                                <span className="text-sm">{keyResult.progress}%</span>
                                {keyResult.progressChange > 0 && (
                                  <span className="ml-1 text-xs text-green-600">
                                    +{keyResult.progressChange}%
                                  </span>
                                )}
                                {keyResult.progress === 0 && keyResult.progressChange === 0 && (
                                  <span className="ml-1 text-xs text-gray-500">
                                    0%
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* To-dos and Check-ins sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* To-dos Section */}
        <div className="bg-white rounded-md shadow-sm border">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-lg">To-dos</h2>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Key Results</h3>
              <div className="space-y-2">
                {todos.filter(todo => todo.type === 'key-result').map(todo => (
                  <div key={todo.id} className="flex items-center justify-between">
                    <div className="flex">
                      <div className="mt-0.5">
                        <Circle className="h-4 w-4 text-green-500 mr-2" fill="#22C55E" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm">{todo.title}</span>
                        <span className="text-xs text-gray-500">{todo.dueDate}</span>
                      </div>
                    </div>
                    <div>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        Update
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Check-ins</h3>
              <div className="space-y-2">
                {todos.filter(todo => todo.type === 'check-in').map(todo => (
                  <div key={todo.id} className="flex items-center justify-between">
                    <div className="flex">
                      <div className="mt-0.5">
                        <Circle className="h-4 w-4 text-gray-400 mr-2" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm">{todo.title}</span>
                        <span className="text-xs text-gray-500">{todo.dueDate}</span>
                      </div>
                    </div>
                    <div>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        Fill out
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Check-ins Section */}
        <div className="bg-white rounded-md shadow-sm border">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-lg">Check-ins</h2>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
          <div className="space-y-4 p-4">
            {checkIns.map(checkIn => (
              <div key={checkIn.id} className="border rounded-md p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                    {checkIn.team.substring(0, 2)}
                  </div>
                  <div>
                    <div className="font-medium">{checkIn.team}</div>
                    <div className="text-xs text-gray-500">{checkIn.progress} • {checkIn.dueDate}</div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button size="sm" variant="outline">
                    Fill out
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const ChevronLeft = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);