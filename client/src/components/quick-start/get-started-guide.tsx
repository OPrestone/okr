import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface GuideStep {
  title: string;
  description: string;
  completed: boolean;
  stepNumber: number;
}

export function GetStartedGuide() {
  const steps: GuideStep[] = [
    {
      title: "Define Company Objectives",
      description: "Start by setting 3-5 high-level company objectives for the current quarter or year.",
      completed: true,
      stepNumber: 1
    },
    {
      title: "Create Team Structure",
      description: "Set up your organizational structure by creating teams and assigning team leaders.",
      completed: true,
      stepNumber: 2
    },
    {
      title: "Add Team Members",
      description: "Invite your team members to join the platform and assign them to their respective teams.",
      completed: false,
      stepNumber: 3
    },
    {
      title: "Cascade Objectives to Teams",
      description: "Break down company objectives into team-specific objectives that align with the overall strategy.",
      completed: false,
      stepNumber: 4
    },
    {
      title: "Schedule Regular Check-ins",
      description: "Set up weekly or bi-weekly 1:1 meetings to review progress and provide feedback.",
      completed: false,
      stepNumber: 5
    }
  ];

  return (
    <Card className="mb-8">
      <CardHeader className="p-5 bg-primary-50 border-b border-primary-100">
        <h2 className="text-lg font-semibold text-primary-900">Quick Get Started Guide</h2>
        <p className="text-sm text-primary-700 mt-1">Follow these steps to set up your OKR system</p>
      </CardHeader>
      
      <CardContent className="p-5">
        <ol className="relative border-l border-neutral-200 ml-3">
          {steps.map((step) => (
            <li key={step.stepNumber} className="mb-6 ml-6 last:mb-0">
              <span className="absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-white">
                {step.completed ? (
                  <div className="bg-primary-100 w-full h-full rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-primary-600" />
                  </div>
                ) : (
                  <div className="bg-neutral-200 w-full h-full rounded-full flex items-center justify-center">
                    <span className="text-neutral-700 text-xs">{step.stepNumber}</span>
                  </div>
                )}
              </span>
              <h3 className="font-medium text-neutral-900">{step.title}</h3>
              <p className="text-sm text-neutral-600 mt-1">{step.description}</p>
              <a href="#" className="inline-flex items-center text-xs font-medium text-primary-600 hover:text-primary-800 mt-2">
                Learn more
                <svg className="ml-1 w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </li>
          ))}
        </ol>
      </CardContent>
      
      <CardFooter className="p-4 bg-neutral-50 border-t border-neutral-100 flex justify-between">
        <a href="/resources" className="text-sm font-medium text-primary-600 hover:text-primary-800">
          View detailed guide
        </a>
        <Button>
          Get started now
        </Button>
      </CardFooter>
    </Card>
  );
}
