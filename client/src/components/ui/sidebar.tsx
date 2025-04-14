import { Link, useLocation } from "wouter";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { 
  BarChart3, BookOpen, CalendarCheck, ChevronDown, ChevronRight,
  Flag, Home, LogOut, Rocket, Settings, Tag, Users, UserCog, 
  UsersRound, PieChart, Compass, DollarSign, Target, FileEdit, FolderOpen, CheckCircle,
  PanelLeftOpen, Link as LinkIcon, Shield, Clock
} from "lucide-react";
import { Separator } from "./separator";
import { ThemeToggle } from "./theme-toggle";
import { useState } from "react";

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  subMenu?: SidebarItem[];
  isExpanded?: boolean;
  onToggle?: () => void;
}

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [location] = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    "manageOkrs": false,
    "userManagement": false,
    "configure": false
  });

  const toggleSubMenu = (key: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const menuItems: SidebarItem[] = [
    {
      icon: <Rocket className="h-5 w-5" />,
      label: "Quick Get Started Guide",
      href: "/quick-start",
    },
    {
      icon: <Home className="h-5 w-5" />,
      label: "Home",
      href: "/",
    },
    {
      icon: <Compass className="h-5 w-5" />,
      label: "Mission",
      href: "/mission",
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      label: "Dashboards",
      href: "/dashboards",
    },
    {
      icon: <Target className="h-5 w-5" />,
      label: "Manage OKRs",
      isExpanded: expandedMenus["manageOkrs"],
      onToggle: () => toggleSubMenu("manageOkrs"),
      subMenu: [
        {
          icon: <Target className="h-4 w-4" />,
          label: "My OKRs",
          href: "/my-okrs",
        },
        {
          icon: <FileEdit className="h-4 w-4" />,
          label: "Draft OKRs",
          href: "/drafts",
        },
        {
          icon: <CheckCircle className="h-4 w-4" />,
          label: "Approved OKRs",
          href: "/approved-okrs",
        },
        {
          icon: <Flag className="h-4 w-4" />,
          label: "Company Objectives",
          href: "/company-objectives",
        },
      ]
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "User Management",
      isExpanded: expandedMenus["userManagement"],
      onToggle: () => toggleSubMenu("userManagement"),
      subMenu: [
        {
          icon: <Users className="h-4 w-4" />,
          label: "Teams",
          href: "/teams",
        },
        {
          icon: <UserCog className="h-4 w-4" />,
          label: "Users",
          href: "/users",
        },
      ]
    },
    {
      icon: <UsersRound className="h-5 w-5" />,
      label: "1:1 Meetings",
      href: "/one-on-one",
    },
    {
      icon: <CalendarCheck className="h-5 w-5" />,
      label: "Check-ins",
      href: "/check-ins",
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>,
      label: "Strategy Map",
      href: "/strategy-map",
    },
    {
      icon: <PieChart className="h-5 w-5" />,
      label: "Reporting",
      href: "/reporting",
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      label: "Resources",
      href: "/resources",
    },
    {
      icon: <DollarSign className="h-5 w-5" />,
      label: "Import Financial Data",
      href: "/import-financial",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Configure",
      isExpanded: expandedMenus["configure"],
      onToggle: () => toggleSubMenu("configure"),
      subMenu: [
        {
          icon: <Settings className="h-4 w-4" />,
          label: "General Settings",
          href: "/configure",
        },
        {
          icon: <Users className="h-4 w-4" />,
          label: "Team Management",
          href: "/team-management",
        },
        {
          icon: <UserCog className="h-4 w-4" />,
          label: "Users Management",
          href: "/user-management",
        },
        {
          icon: <Shield className="h-4 w-4" />,
          label: "Access Groups",
          href: "/access-groups",
        },
        {
          icon: <PanelLeftOpen className="h-4 w-4" />,
          label: "Integrations",
          href: "/integrations",
        },
        {
          icon: <CheckCircle className="h-4 w-4" />,
          label: "Status Settings",
          href: "/status-settings",
        },
        {
          icon: <CalendarCheck className="h-4 w-4" />,
          label: "Cadences",
          href: "/cadences",
        },
        {
          icon: <Clock className="h-4 w-4" />,
          label: "Timeframes",
          href: "/timeframes",
        },
      ]
    },
  ];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 flex flex-col",
        "transform transition-transform duration-300 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        "md:fixed md:translate-x-0",
        className
      )}
      style={{
        backgroundColor: "var(--color-sidebar)",
        borderRight: "1px solid var(--color-border)"
      }}
    >
      {/* Logo and Toggle */}
      <div className="flex items-center justify-between h-16 px-4 border-b" style={{ borderColor: "var(--color-border)" }}>
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-md flex items-center justify-center overflow-hidden">
            <img src="/uploads/logo.png" alt="OKR System Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-lg font-semibold">OKR System</span>
        </Link>
        <button onClick={toggleSidebar} className="md:hidden text-neutral-500 hover:text-neutral-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        <div className="mb-6">
          <Link 
            href="/quick-start"
            className={cn(
              "flex items-center px-4 py-2.5 text-sm font-medium rounded-md menu-item",
              location === "/quick-start" && "menu-item-active"
            )}
          >
            <Rocket className={cn(
              "mr-3 text-lg menu-item-icon",
              location === "/quick-start" && "text-primary"
            )} />
            <span>Quick Get Started Guide</span>
          </Link>
        </div>

        <div className="space-y-1">
          {menuItems.slice(1).map((item, index) => 
            item.subMenu ? (
              <div key={item.label} className="mb-2">
                <button
                  onClick={item.onToggle}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-md menu-item"
                >
                  <div className="flex items-center">
                    <div className="mr-3 text-lg menu-item-icon">
                      {item.icon}
                    </div>
                    <span>{item.label}</span>
                  </div>
                  {item.isExpanded ? (
                    <ChevronDown className="h-4 w-4 menu-item-icon" />
                  ) : (
                    <ChevronRight className="h-4 w-4 menu-item-icon" />
                  )}
                </button>
                
                {item.isExpanded && (
                  <div className="mt-1 ml-6 space-y-1">
                    {item.subMenu.map((subItem) => (
                      <Link
                        key={subItem.label}
                        href={subItem.href || "/"}
                        className={cn(
                          "flex items-center px-4 py-2 text-sm font-medium rounded-md menu-item",
                          location === subItem.href && "menu-item-active"
                        )}
                      >
                        <div
                          className={cn(
                            "mr-2 text-sm menu-item-icon",
                            location === subItem.href && "text-primary"
                          )}
                        >
                          {subItem.icon}
                        </div>
                        <span>{subItem.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link 
                key={item.label} 
                href={item.href || "/"}
                className={cn(
                  "flex items-center px-4 py-2.5 text-sm font-medium rounded-md menu-item",
                  location === item.href && "menu-item-active"
                )}
              >
                <div className={cn(
                  "mr-3 text-lg menu-item-icon",
                  location === item.href && "text-primary"
                )}>
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </Link>
            )
          )}
        </div>
      </nav>

      {/* User Profile */}
      <div className="border-t p-4" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full flex items-center justify-center overflow-hidden border" 
               style={{ borderColor: "var(--color-border)" }}>
            <img src="/uploads/logo.png" alt="User" className="w-full h-full object-cover" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">Alex Morgan</p>
            <p className="text-xs opacity-70">Product Manager</p>
          </div>
          <div className="ml-auto flex items-center space-x-1">
            <ThemeToggle />
            <button className="opacity-70 hover:opacity-100">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
