/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect } from 'react';
import { Vendor } from '../types';

interface VendorsResponse {
  success: boolean;
  nextCursor: string | null;
  data: Vendor[];
}

interface UseVendorsReturn {
  vendors: Vendor[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  reset: () => Promise<void>;
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const LIMIT = 4;

export const useVendors = (): UseVendorsReturn => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchVendors = useCallback(
    async (cursor?: string | null) => {
      try {
        setLoading(true);
        setError(null);

        let url = `${API_BASE_URL}/vendors?limit=${LIMIT}`;
        if (cursor) {
          url += `&cursor=${encodeURIComponent(cursor)}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch vendors: ${response.statusText}`);
        }

        const data: VendorsResponse = await response.json();

        if (!data.success) {
          throw new Error('API returned unsuccessful response');
        }

        // Transform API response to match Vendor format
        const transformedVendors = data.data.map((vendor) => ({
          ...vendor,
          id: vendor._id,
          emoji: getEmojiForVendor(vendor.type || 'general'),
          rating: vendor.rating || 4.5,
          deliveryTime: formatDeliveryTime(vendor.deliveryTime),
        }));

        setVendors((prevVendors) =>
          cursor ? [...prevVendors, ...transformedVendors] : transformedVendors
        );
        setNextCursor(data.nextCursor);
        setHasLoaded(true);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        console.error('Error fetching vendors:', err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const loadMore = useCallback(async () => {
    if (nextCursor && !loading) {
      await fetchVendors(nextCursor);
    }
  }, [nextCursor, loading, fetchVendors]);

  const reset = useCallback(async () => {
    setVendors([]);
    setNextCursor(null);
    setError(null);
    setHasLoaded(false);
    await fetchVendors();
  }, [fetchVendors]);

  // Load initial vendors on mount only
  useEffect(() => {
    if (!hasLoaded && !loading) {
      fetchVendors();
    }
  }, []);

  return {
    vendors,
    loading,
    error,
    hasMore: nextCursor !== null,
    loadMore,
    reset,
  };
};

const getEmojiForVendor = (type: string): string => {
  const emojiMap: { [key: string]: string } = {
    'food-stuffs': '🍅',
    'drugs': '💊',
    'pharmacy': '💊',
    'general': '🏪',
    'super-market': '📦',
    'supermarket': '📦',
    'fruits': '🌿',
    'vegetables': '🌿',
    'meat': '🍖',
    'bakery': '🥖',
    'address': '📍',
    'retail': '🛒',
    'convenience': '🏢',
  };
  return emojiMap[type.toLowerCase()] || '🏪';
};

const formatDeliveryTime = (deliveryTime: string | number | undefined): string => {
  if (!deliveryTime) {
    return 'TBD';
  }
  
  if (typeof deliveryTime === 'string') {
    return deliveryTime;
  }
  
  // Convert minutes to readable format
  if (deliveryTime < 60) {
    return `${deliveryTime} mins`;
  } else {
    const hours = Math.floor(deliveryTime / 60);
    const mins = deliveryTime % 60;
    if (mins === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${mins}m`;
  }
};
