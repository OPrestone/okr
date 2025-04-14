import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface ReportLayoutProps {
  children: ReactNode;
}

export function ReportLayout({ children }: ReportLayoutProps) {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Simple top bar with back button */}
      <div className="flex items-center h-14 px-4 border-b border-gray-200 bg-white">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')}
          className="text-gray-500 flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
      
      {/* Content */}
      <main className="p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}