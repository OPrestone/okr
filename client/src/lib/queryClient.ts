import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Base URL for API requests - can be configured from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  endpoint: string,
  data?: unknown | undefined,
): Promise<Response> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  // Handle authentication - this could be updated to use API keys, OAuth tokens, etc.
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  // You could add an API key or auth token here
  // headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
  
  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  await throwIfResNotOk(res);
  return res;
}

// Import mock data for development
import mockData from './mockData';

// Mock data service for development - can be used when API is not available
class MockDataService {
  static mockData: Record<string, any> = mockData;

  static getData(endpoint: string) {
    // Remove any query parameters
    const path = endpoint.split('?')[0];
    return this.mockData[path] || null;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const endpoint = queryKey[0] as string;
    
    // Use mock data when running in development or testing without a real API
    const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (useMockData) {
      const mockData = MockDataService.getData(endpoint);
      if (mockData) return mockData;
    }
    
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    // Add authentication headers as needed
    const headers: Record<string, string> = {};
    // You could add an API key or auth token here
    // headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    
    const res = await fetch(url, {
      headers
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
