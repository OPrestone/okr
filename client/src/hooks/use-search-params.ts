/**
 * Custom hook to parse and access URL search parameters
 * @returns An object with methods to interact with the URL search parameters
 */
export function useSearchParams() {
  // Get the URL search params
  const searchParams = new URLSearchParams(window.location.search);

  return {
    /**
     * Get the value of a specific URL parameter
     * @param key - The parameter name to retrieve
     * @returns The parameter value or null if it doesn't exist
     */
    get: (key: string): string | null => {
      return searchParams.get(key);
    },

    /**
     * Check if a specific URL parameter exists
     * @param key - The parameter name to check
     * @returns True if the parameter exists, false otherwise
     */
    has: (key: string): boolean => {
      return searchParams.has(key);
    },

    /**
     * Get all values for a specific URL parameter (for parameters that can have multiple values)
     * @param key - The parameter name to retrieve values for
     * @returns An array of values
     */
    getAll: (key: string): string[] => {
      return searchParams.getAll(key);
    },

    /**
     * Convert the URLSearchParams object to a plain JavaScript object
     * @returns An object with all parameters as key-value pairs
     */
    toObject: (): Record<string, string> => {
      const result: Record<string, string> = {};
      for (const [key, value] of searchParams.entries()) {
        result[key] = value;
      }
      return result;
    }
  };
}