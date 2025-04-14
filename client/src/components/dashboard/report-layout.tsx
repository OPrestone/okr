import { ReactNode } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportLayoutProps {
  children: ReactNode;
}

export function ReportLayout({ children }: ReportLayoutProps) {
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content without Header */}
      <div 
        className={cn(
          "flex-1 overflow-auto h-screen transition-all duration-300",
          isSidebarOpen ? "md:ml-[30px]" : "md:ml-0"
        )}
        style={{
          marginLeft: isSidebarOpen ? "calc(256px - 30px)" : "0px"
        }}
      >
        {/* Simple top bar with only menu toggle for mobile */}
        <div className="flex items-center h-14 px-4 border-b border-gray-200 md:hidden bg-white">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="text-gray-500"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
        
        {/* Content */}
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}