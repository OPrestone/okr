import { ReactNode } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { Header } from "./header";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isSidebarOpen } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div 
        className={cn(
          "flex-1 overflow-auto h-screen transition-all duration-300",
          isSidebarOpen ? "md:ml-64" : "md:ml-0"
        )}
      >
        {/* Header */}
        <Header />

        {/* Content */}
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
