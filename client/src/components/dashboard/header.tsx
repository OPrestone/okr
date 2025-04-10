import { useState } from "react";
import { useLocation } from "wouter";
import { useSidebar } from "@/hooks/use-sidebar";
import { Search, Menu, Bell, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { QuickStartGuide } from "@/components/quick-start-guide";

interface BreadcrumbItem {
  label: string;
  href: string;
}

export function Header() {
  const { toggleSidebar } = useSidebar();
  const [location] = useLocation();
  const [searchValue, setSearchValue] = useState("");

  // Generate breadcrumbs based on current route
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = location.split("/").filter(Boolean);
    
    // Home page breadcrumb
    if (paths.length === 0) {
      return [{ label: "Home", href: "/" }];
    }
    
    // Convert path to breadcrumb format
    const formatPath = (path: string) => {
      return path
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };
    
    // Generate breadcrumb items
    return [
      { label: "Home", href: "/" },
      ...paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join("/")}`;
        return { label: formatPath(path), href };
      }),
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-neutral-200">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Mobile Menu Button */}
        <button 
          onClick={toggleSidebar} 
          className="text-neutral-500 md:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Breadcrumbs */}
        <nav className="hidden md:flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-1 text-sm">
            {breadcrumbs.map((item, index) => (
              <li key={item.href} className="flex items-center">
                {index > 0 && (
                  <svg 
                    className="h-4 w-4 text-neutral-400" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                )}
                <a 
                  href={item.href} 
                  className={index === breadcrumbs.length - 1 
                    ? "ml-1 font-medium text-neutral-900" 
                    : "ml-1 text-neutral-500 hover:text-neutral-700"
                  }
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Search and Actions */}
        <div className="flex items-center">
          {/* Search */}
          <div className="relative mr-4">
            <Input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              className="w-40 md:w-64 h-9 pl-9 pr-4 rounded-md text-sm"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          </div>

          {/* Notifications */}
          <button className="p-1 rounded-full text-neutral-500 hover:text-neutral-700 relative">
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary-500"></span>
          </button>

          {/* Quick Start Guide */}
          <div className="ml-2">
            <QuickStartGuide />
          </div>
        </div>
      </div>
    </header>
  );
}
