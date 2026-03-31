import { useState, useCallback } from 'react';
import { GiftItem } from '../types';

interface SearchResponse {
  success: boolean;
  total: number;
  data: GiftItem[];
}

interface UseSearchItemsReturn {
  results: GiftItem[];
  loading: boolean;
  error: string | null;
  search: (query: string, type?: 'subscription' | 'regular') => Promise<void>;
  reset: () => void;
}

// =========== FOR DEVELOPMENT =============
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://boqbox-mini.onrender.com/api/v1';

// =============== FOR PRODUCTION =================
const API_BASE_URL = 'https://boqbox.ng/api/v1';

export const useSearchItems = (): UseSearchItemsReturn => {
  const [results, setResults] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, type?: 'subscription' | 'regular') => {
    if (!query.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let url = `${API_BASE_URL}/items/search?q=${encodeURIComponent(query)}`;
      if (type === 'subscription') {
        url += `&type=subscription`;
      }
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to search items: ${response.statusText}`);
      }

      const data: SearchResponse = await response.json();

      if (data.success && data.data) {
        // Apply client-side filtering based on type
        let filteredData = data.data;
        
        if (type === 'subscription') {
          // For subscription flow, only keep items with options or type=subscription
          filteredData = data.data.filter((item) => item.options && item.options.length > 0);
        } else if (type === 'regular') {
          // For regular flow, only keep items without options
          filteredData = data.data.filter((item) => !item.options || item.options.length === 0);
        }
        
        if (filteredData.length === 0) {
          setError('No items found matching your search');
          setResults([]);
        } else {
          setResults(filteredData);
        }
      } else {
        setError('No items found matching your search');
        setResults([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error searching items');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResults([]);
    setError(null);
    setLoading(false);
  }, []);

  return {
    results,
    loading,
    error,
    search,
    reset,
  };
};
