import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Building,
  Calendar,
  ChevronDown,
  CircleUser,
  Code,
  Edit,
  LinkIcon,
  MoreHorizontal,
  NetworkIcon,
  Plus,
  Target, 
  Users,
  X
} from "lucide-react";
import { useLocation } from "wouter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function CreateObjective() {
  const [_, setLocation] = useLocation();
  const [alignmentOption, setAlignmentOption] = useState<string>("strategic-pillar");
  const [progressDriver, setProgressDriver] = useState<string>("key-results");

  const handleCancel = () => {
    setLocation("/");
  };

  const handleSave = () => {
    // Here you would normally save the data
    setLocation("/");
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Add OKR</h1>
        <button 
          onClick={handleCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Name */}
        <div>
          <Label htmlFor="name">Name</Label>
          <div className="flex gap-2 mt-1">
            <Input 
              id="name" 
              placeholder="Our onboarding process is smooth and fast" 
              className="flex-1"
            />
            <Button variant="outline" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Alignment */}
        <div>
          <Label>Alignment</Label>
          <div className="grid grid-cols-2 gap-4 mt-1">
            <Select defaultValue="strategic-pillar">
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  <Building className="h-5 w-5 mr-2 text-green-600" />
                  <span>Support a Strategic Pillar</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="strategic-pillar">
                  <div className="flex items-center">
                    <Building className="h-5 w-5 mr-2 text-green-600" />
                    Support a Strategic Pillar
                  </div>
                </SelectItem>
                <SelectItem value="team-objective">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                    Support a Team Objective
                  </div>
                </SelectItem>
                <SelectItem value="company-objective">
                  <div className="flex items-center">
                    <Target className="h-5 w-5 mr-2 text-red-600" />
                    Support a Company Objective
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Strategic Pillar..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="growth">Growth</SelectItem>
                <SelectItem value="customer-satisfaction">Customer Satisfaction</SelectItem>
                <SelectItem value="innovation">Innovation</SelectItem>
                <SelectItem value="operational-excellence">Operational Excellence</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Owner */}
        <div>
          <Label>Owner</Label>
          <div className="mt-1">
            <Select>
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  <div className="h-7 w-7 rounded-full bg-orange-100 flex items-center justify-center text-orange-800 font-medium text-sm mr-2">
                    RA
                  </div>
                  <span>RAG</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rag">
                  <div className="flex items-center">
                    <div className="h-7 w-7 rounded-full bg-orange-100 flex items-center justify-center text-orange-800 font-medium text-sm mr-2">
                      RA
                    </div>
                    RAG
                  </div>
                </SelectItem>
                <SelectItem value="alex">
                  <div className="flex items-center">
                    <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium text-sm mr-2">
                      AM
                    </div>
                    Alex Morgan
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Lead and Timeframe */}
        <div className="grid grid-cols-2 gap-4">
          {/* Lead */}
          <div>
            <Label>Lead</Label>
            <div className="mt-1">
              <Select>
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <div className="h-7 w-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-medium text-sm mr-2">
                      BG
                    </div>
                    <span>Bonface Gitonga</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bonface">
                    <div className="flex items-center">
                      <div className="h-7 w-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-medium text-sm mr-2">
                        BG
                      </div>
                      Bonface Gitonga
                    </div>
                  </SelectItem>
                  <SelectItem value="jane">
                    <div className="flex items-center">
                      <div className="h-7 w-7 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-medium text-sm mr-2">
                        JD
                      </div>
                      Jane Doe
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Timeframe */}
          <div>
            <Label>Timeframe</Label>
            <div className="mt-1">
              <Select>
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                    <span>Q2 2025</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="q1-2025">Q1 2025</SelectItem>
                  <SelectItem value="q2-2025">Q2 2025</SelectItem>
                  <SelectItem value="q3-2025">Q3 2025</SelectItem>
                  <SelectItem value="q4-2025">Q4 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Advanced Options */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="advanced-options">
            <AccordionTrigger className="text-blue-600 font-medium">
              Advanced Options
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 pt-2">
                {/* Contributors */}
                <div>
                  <Label>Contributors</Label>
                  <div className="mt-1 flex items-center">
                    <Button variant="outline" size="sm" className="mr-2">
                      <Plus className="h-4 w-4 mr-1" />
                      <span>Add Contributors</span>
                    </Button>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="description">Description</Label>
                    <span className="text-sm text-gray-500">Optional</span>
                  </div>
                  <Textarea 
                    id="description" 
                    placeholder="Why is it a priority?" 
                    className="mt-1 h-24"
                  />
                </div>

                {/* Update frequency */}
                <div>
                  <Label>Update frequency</Label>
                  <div className="mt-1">
                    <Select defaultValue="weekly">
                      <SelectTrigger className="w-full">
                        <span>Weekly</span>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Progress driver */}
                <div>
                  <Label>Progress driver</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div 
                      className={`border rounded-md p-4 flex items-center justify-between cursor-pointer ${
                        progressDriver === "key-results" ? "border-blue-500 bg-blue-50" : ""
                      }`}
                      onClick={() => setProgressDriver("key-results")}
                    >
                      <div className="flex items-center">
                        <div className={`h-4 w-4 rounded-full mr-2 flex items-center justify-center ${
                          progressDriver === "key-results" ? "bg-blue-500" : "border border-gray-300"
                        }`}>
                          {progressDriver === "key-results" && (
                            <div className="h-2 w-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span>Key Results</span>
                      </div>
                      <Target className="h-5 w-5 text-blue-600" />
                    </div>
                    
                    <div 
                      className={`border rounded-md p-4 flex items-center justify-between cursor-pointer ${
                        progressDriver === "aligned-okrs" ? "border-blue-500 bg-blue-50" : ""
                      }`}
                      onClick={() => setProgressDriver("aligned-okrs")}
                    >
                      <div className="flex items-center">
                        <div className={`h-4 w-4 rounded-full mr-2 flex items-center justify-center ${
                          progressDriver === "aligned-okrs" ? "bg-blue-500" : "border border-gray-300"
                        }`}>
                          {progressDriver === "aligned-okrs" && (
                            <div className="h-2 w-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span>Aligned OKRs</span>
                      </div>
                      <NetworkIcon className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <Label>Tags</Label>
                  <div className="mt-1 flex items-center">
                    <Button variant="outline" size="sm" className="mr-2">
                      <Plus className="h-4 w-4 mr-1" />
                      <span>Add Tags</span>
                    </Button>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Bottom buttons - Status and Save/Cancel */}
        <div className="flex justify-between pt-4 border-t">
          <div className="flex space-x-2">
            <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
              Active
            </Button>
            <Button variant="outline">
              Draft
            </Button>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white" 
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}