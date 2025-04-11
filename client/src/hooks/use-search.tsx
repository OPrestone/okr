import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';

// Define the types of searchable items
export type SearchableItemType = 'objective' | 'keyResult' | 'user' | 'team' | 'meeting' | 'resource';

// Interface for search result items
export interface SearchResultItem {
  id: number;
  title: string;
  description?: string;
  type: SearchableItemType;
  url: string;
  icon?: string;
  data?: any; // Additional data specific to item type
}

interface SearchContextType {
  searchTerm: string;
  searchResults: SearchResultItem[];
  isSearching: boolean;
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;
  searchInCollection: <T extends { id: number }>(
    collection: T[], 
    term: string, 
    options: { 
      fields: (keyof T)[],
      type: SearchableItemType,
      getUrl: (item: T) => string,
      getTitle: (item: T) => string,
      getDescription?: (item: T) => string,
    }
  ) => SearchResultItem[];
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch data that might be needed for search
  const { data: objectives = [] } = useQuery<any[]>({
    queryKey: ['/api/objectives'],
    enabled: searchTerm.length > 0,
  });

  const { data: keyResults = [] } = useQuery<any[]>({
    queryKey: ['/api/key-results'],
    enabled: searchTerm.length > 0,
  });

  const { data: users = [] } = useQuery<any[]>({
    queryKey: ['/api/users'],
    enabled: searchTerm.length > 0,
  });

  const { data: teams = [] } = useQuery<any[]>({
    queryKey: ['/api/teams'],
    enabled: searchTerm.length > 0,
  });

  const { data: meetings = [] } = useQuery<any[]>({
    queryKey: ['/api/meetings'],
    enabled: searchTerm.length > 0,
  });

  const { data: resources = [] } = useQuery<any[]>({
    queryKey: ['/api/resources'],
    enabled: searchTerm.length > 0,
  });

  // Search in a collection of items based on search term
  const searchInCollection = useCallback(<T extends { id: number }>(
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
    if (!term) return [];
    
    const normalizedTerm = term.toLowerCase().trim();
    
    return collection.filter(item => {
      return options.fields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(normalizedTerm);
        }
        return false;
      });
    }).map(item => ({
      id: item.id,
      title: options.getTitle(item),
      description: options.getDescription ? options.getDescription(item) : undefined,
      type: options.type,
      url: options.getUrl(item),
      data: item
    }));
  }, []);

  // Effect to update search results when search term changes
  React.useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Small delay to simulate search
    const timer = setTimeout(() => {
      const results: SearchResultItem[] = [
        // Search in objectives
        ...searchInCollection(objectives, searchTerm, {
          fields: ['title', 'description'],
          type: 'objective',
          getUrl: (item) => `/objectives/${item.id}`,
          getTitle: (item) => item.title,
          getDescription: (item) => item.description || 'No description available'
        }),

        // Search in key results
        ...searchInCollection(keyResults, searchTerm, {
          fields: ['title', 'description'],
          type: 'keyResult',
          getUrl: (item) => `/objectives/${item.objectiveId}#kr-${item.id}`,
          getTitle: (item) => item.title,
          getDescription: (item) => item.description || 'No description available'
        }),

        // Search in users
        ...searchInCollection(users, searchTerm, {
          fields: ['fullName', 'username', 'email', 'role'],
          type: 'user',
          getUrl: (item) => `/users/${item.id}`,
          getTitle: (item) => item.fullName,
          getDescription: (item) => item.role
        }),

        // Search in teams
        ...searchInCollection(teams, searchTerm, {
          fields: ['name', 'description'],
          type: 'team',
          getUrl: (item) => `/teams/${item.id}`,
          getTitle: (item) => item.name,
          getDescription: (item) => item.description || 'No description available'
        }),

        // Search in meetings
        ...searchInCollection(meetings, searchTerm, {
          fields: ['title', 'description'],
          type: 'meeting',
          getUrl: (item) => `/meetings/${item.id}`,
          getTitle: (item) => item.title,
          getDescription: (item) => item.description || 'No description available'
        }),

        // Search in resources
        ...searchInCollection(resources, searchTerm, {
          fields: ['title', 'description'],
          type: 'resource',
          getUrl: (item) => `/resources/${item.id}`,
          getTitle: (item) => item.title,
          getDescription: (item) => item.description || 'No description available'
        })
      ];

      setSearchResults(results);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [
    searchTerm, 
    searchInCollection, 
    objectives, 
    keyResults, 
    users, 
    teams, 
    meetings,
    resources
  ]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setSearchResults([]);
    setIsSearching(false);
  }, []);

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        searchResults,
        isSearching,
        setSearchTerm,
        clearSearch,
        searchInCollection
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}