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
  search: (query: string) => Promise<void>;
  reset: () => void;
}

// =========== FOR DEVELOPMENT =============
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://boqbox-mini.onrender.com';

// =============== FOR PRODUCTION =================
const API_BASE_URL = 'https://boqbox.ng';

export const useSearchItems = (): UseSearchItemsReturn => {
  const [results, setResults] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const url = `${API_BASE_URL}/items/search?q=${encodeURIComponent(query)}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to search items: ${response.statusText}`);
      }

      const data: SearchResponse = await response.json();

      if (data.success && data.data) {
        setResults(data.data);
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
