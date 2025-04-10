import React, { useState } from "react";
import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HelpCircle,
  Target,
  CheckCircle2,
  Users,
  BarChart3,
  Calendar,
  ListChecks,
  BookOpen,
  ArrowRight,
} from "lucide-react";

interface StepProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  onClick: () => void;
}

function Step({ title, description, icon, action, onClick }: StepProps) {
  return (
    <Card className="mb-4 transition-all hover:border-primary/50 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-medium">{title}</h3>
            <p className="mb-3 text-sm text-muted-foreground">{description}</p>
            <Button
              onClick={onClick}
              className="flex items-center gap-1"
              size="sm"
            >
              {action}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function QuickStartGuide() {
  const [open, setOpen] = useState(false);
  const [_, setLocation] = useLocation();

  const handleNavigate = (path: string) => {
    setOpen(false);
    setLocation(path);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1.5">
          <HelpCircle className="h-4 w-4" />
          <span>Quick Start Guide</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>Quick Start Guide</span>
          </DialogTitle>
          <DialogDescription>
            Follow these steps to get started with the OKR platform
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Step
            title="1. Set Company Mission"
            description="Define your organization's mission, vision, and values to align your objectives."
            icon={<Target className="h-5 w-5" />}
            action="Go to Mission"
            onClick={() => handleNavigate("/mission")}
          />
          
          <Step
            title="2. Create Team"
            description="Set up your teams and add team members to collaborate on objectives."
            icon={<Users className="h-5 w-5" />}
            action="Create Team"
            onClick={() => handleNavigate("/create-team")}
          />
          
          <Step
            title="3. Create Objectives"
            description="Define measurable objectives that align with your organization's mission."
            icon={<BarChart3 className="h-5 w-5" />}
            action="Create Objective"
            onClick={() => handleNavigate("/create-objective")}
          />
          
          <Step
            title="4. Add Key Results"
            description="Create specific, measurable key results to track progress toward your objectives."
            icon={<CheckCircle2 className="h-5 w-5" />}
            action="Add Key Results"
            onClick={() => handleNavigate("/create-key-result")}
          />
          
          <Step
            title="5. Schedule Check-ins"
            description="Set up regular check-ins to track progress and update your OKRs."
            icon={<Calendar className="h-5 w-5" />}
            action="Schedule Check-ins"
            onClick={() => handleNavigate("/check-ins")}
          />
          
          <Step
            title="6. Track Progress"
            description="Use dashboards to monitor progress and identify areas that need attention."
            icon={<ListChecks className="h-5 w-5" />}
            action="View Dashboards"
            onClick={() => handleNavigate("/dashboards")}
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close Guide
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}