import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useSidebar } from "@/hooks/use-sidebar";
import { 
  Search, Menu, Bell, X, Loader2, User, BarChart, 
  Target, Calendar, FileText, Users 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { QuickStartGuide } from "@/components/quick-start-guide";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

interface BreadcrumbItem {
  label: string;
  href: string;
}

// Define types for searchable items
type SearchableItemType = 'objective' | 'keyResult' | 'user' | 'team' | 'meeting' | 'resource';

// Interface for search result items
interface SearchResultItem {
  id: number;
  title: string;
  description?: string;
  type: SearchableItemType;
  url: string;
  data?: any;
}

export function Header() {
  const { toggleSidebar } = useSidebar();
  const [location, navigate] = useLocation();
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Load data for searching when needed
  const shouldFetch = searchValue.length >= 3;
  
  const { data: objectives = [] } = useQuery<any[]>({
    queryKey: ['/api/objectives'],
    enabled: shouldFetch,
  });
  
  const { data: users = [] } = useQuery<any[]>({
    queryKey: ['/api/users'],
    enabled: shouldFetch,
  });
  
  const { data: teams = [] } = useQuery<any[]>({
    queryKey: ['/api/teams'],
    enabled: shouldFetch,
  });
  
  const { data: resources = [] } = useQuery<any[]>({
    queryKey: ['/api/resources'],
    enabled: shouldFetch,
  });

  // Helper function to search in a specific data array
  const searchInCollection = <T extends { id: number }>(
    collection: T[],
    term: string,
    options: {
      fields: (keyof T)[],
      type: SearchableItemType,
      getUrl: (item: T) => string,
      getTitle: (item: T) => string,
      getDescription?: (item: T) => string,
    }
  ): SearchResultItem[] => {
    if (!term || !collection?.length) return [];
    
    const normalizedTerm = term.toLowerCase().trim();
    
    return collection
      .filter(item => 
        options.fields.some(field => {
          const value = item[field];
          return typeof value === 'string' && value.toLowerCase().includes(normalizedTerm);
        })
      )
      .map(item => ({
        id: item.id,
        title: options.getTitle(item),
        description: options.getDescription ? options.getDescription(item) : undefined,
        type: options.type,
        url: options.getUrl(item),
        data: item
      }));
  };

  // Function to perform search
  const performSearch = () => {
    if (searchValue.length < 3) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    // Combine results from all sources
    const results = [
      // Users
      ...searchInCollection(users, searchValue, {
        fields: ['fullName', 'username', 'email', 'role'],
        type: 'user',
        getUrl: (item) => `/users/${item.id}`,
        getTitle: (item) => item.fullName,
        getDescription: (item) => item.role
      }),
      
      // Teams
      ...searchInCollection(teams, searchValue, {
        fields: ['name', 'description'],
        type: 'team',
        getUrl: (item) => `/teams/${item.id}`,
        getTitle: (item) => item.name,
        getDescription: (item) => item.description || 'No description available'
      }),
      
      // Objectives
      ...searchInCollection(objectives, searchValue, {
        fields: ['title', 'description'],
        type: 'objective',
        getUrl: (item) => `/objectives/${item.id}`,
        getTitle: (item) => item.title,
        getDescription: (item) => item.description || 'No description available'
      }),
      
      // Resources
      ...searchInCollection(resources, searchValue, {
        fields: ['title', 'description'],
        type: 'resource',
        getUrl: (item) => `/resources/${item.id}`,
        getTitle: (item) => item.title,
        getDescription: (item) => item.description || 'No description available'
      })
    ];
    
    setSearchResults(results);
    setIsSearching(false);
    if (results.length > 0) {
      setShowResults(true);
    }
  };
  
  // Effect for live search with debounce
  useEffect(() => {
    // Only search if we have at least 3 characters
    if (searchValue.length < 3) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    
    // Debounce search
    const timer = setTimeout(() => {
      performSearch();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchValue]);
  
  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Get icon for search result
  const getIconForType = (type: SearchableItemType) => {
    switch (type) {
      case 'objective':
        return <Target className="h-4 w-4 text-blue-500" />;
      case 'keyResult':
        return <BarChart className="h-4 w-4 text-green-500" />;
      case 'user':
        return <User className="h-4 w-4 text-violet-500" />;
      case 'team':
        return <Users className="h-4 w-4 text-amber-500" />;
      case 'meeting':
        return <Calendar className="h-4 w-4 text-red-500" />;
      case 'resource':
        return <FileText className="h-4 w-4 text-neutral-500" />;
      default:
        return <Search className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  // Handle search submission
  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim().length >= 3) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setShowResults(false);
    }
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchValue('');
    setSearchResults([]);
    setShowResults(false);
  };
  
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
          <div ref={searchRef} className="relative mr-4">
            <form onSubmit={handleSubmitSearch}>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  className="w-40 md:w-64 h-9 pl-9 pr-8 rounded-md text-sm"
                  onFocus={() => {
                    if (searchValue.length >= 3) {
                      setShowResults(true);
                    }
                  }}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                
                {isSearching ? (
                  <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-neutral-400" />
                ) : searchValue ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1.5 h-6 w-6 p-0 rounded-full opacity-70 hover:opacity-100"
                    onClick={clearSearch}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear search</span>
                  </Button>
                ) : null}
              </div>
            </form>
            
            {/* Search Results Dropdown */}
            {showResults && searchValue.length >= 3 && (
              <div className="absolute right-0 mt-2 w-72 md:w-96 overflow-hidden rounded-md border border-neutral-200 bg-white shadow-lg z-50">
                {isSearching ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-5 w-5 animate-spin text-neutral-400 mr-2" />
                    <span className="text-sm text-neutral-500">Searching...</span>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-4 text-center">
                    <p className="text-sm text-neutral-500">No results found for "{searchValue}"</p>
                  </div>
                ) : (
                  <div>
                    <div className="max-h-80 overflow-y-auto">
                      <ul className="py-2">
                        {searchResults.slice(0, 7).map((result) => (
                          <li key={`${result.type}-${result.id}`}>
                            <a
                              href={result.url}
                              className="flex items-start px-4 py-2 hover:bg-neutral-50 transition-colors"
                              onClick={() => setShowResults(false)}
                            >
                              <span className="mt-0.5 mr-2 flex-shrink-0">
                                {getIconForType(result.type)}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{result.title}</p>
                                {result.description && (
                                  <p className="text-xs text-neutral-500 truncate">
                                    {result.description}
                                  </p>
                                )}
                                <p className="text-xs text-neutral-400 mt-1 capitalize">
                                  {result.type}
                                </p>
                              </div>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* See All Results Button */}
                    {searchResults.length > 7 && (
                      <div className="p-2 border-t border-neutral-200">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-primary"
                          onClick={() => {
                            navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
                            setShowResults(false);
                          }}
                        >
                          See all {searchResults.length} results
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
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
