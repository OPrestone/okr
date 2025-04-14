import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { API_CONFIG } from './config';
import mockData from './mockData';

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Function to get authentication headers
function getAuthHeaders(): Record<string, string> {
  const headers = { ...API_CONFIG.DEFAULT_HEADERS };
  
  if (API_CONFIG.AUTH.INCLUDE_AUTH) {
    const token = localStorage.getItem(API_CONFIG.AUTH.TOKEN_KEY);
    if (token) {
      headers[API_CONFIG.AUTH.AUTH_HEADER] = `${API_CONFIG.AUTH.TOKEN_PREFIX}${token}`;
    }
  }
  
  return headers;
}

export async function apiRequest(
  method: string,
  endpoint: string,
  data?: unknown | undefined,
): Promise<Response> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const headers = getAuthHeaders();
  
  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  await throwIfResNotOk(res);
  return res;
}

// Mock data service for development - can be used when API is not available
class MockDataService {
  static mockData: Record<string, any> = mockData;

  static getData(endpoint: string) {
    // Remove any query parameters
    const path = endpoint.split('?')[0];
    return this.mockData[path] || null;
  }
  
  // Simulate API latency in development
  static async getDataWithDelay(endpoint: string, delayMs: number = 300) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.getData(endpoint));
      }, delayMs);
    });
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const endpoint = queryKey[0] as string;
    
    // Use mock data when configured to do so
    if (API_CONFIG.USE_MOCK_DATA) {
      // Add artificial delay to simulate network request in development
      const mockData = await MockDataService.getDataWithDelay(endpoint);
      if (mockData) return mockData;
      // If no mock data is found for this endpoint, fall through to API request
      console.warn(`No mock data found for endpoint: ${endpoint}`);
    }
    
    const url = endpoint.startsWith('http') ? endpoint : `${API_CONFIG.BASE_URL}${endpoint}`;
    const headers = getAuthHeaders();
    
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
