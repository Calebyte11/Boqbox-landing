import { useState, useCallback, useEffect } from 'react';
import { GiftItem } from '../types';

interface ItemsResponse {
  success: boolean;
  nextCursor: string | null;
  data: GiftItem[];
}

interface UseSubscribableItemsReturn {
  items: GiftItem[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  reset: () => Promise<void>;
}

// =========== FOR DEVELOPMENT =============
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://boqbox-mini.onrender.com/api/v1';

// =============== FOR PRODUCTION =================
const API_BASE_URL = 'https://boqbox.ng/api/v1';

const LIMIT = 4;

export const useSubscribableItems = (): UseSubscribableItemsReturn => {
  const [items, setItems] = useState<GiftItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchItems = useCallback(
    async (cursor?: string | null) => {
      try {
        setLoading(true);
        setError(null);

        let url = `${API_BASE_URL}/items?type=subscription&limit=${LIMIT}`;
        if (cursor) {
          url += `&cursor=${encodeURIComponent(cursor)}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch subscribeable items: ${response.statusText}`);
        }

        const data: ItemsResponse = await response.json();

        if (!data.success) {
          throw new Error('API returned unsuccessful response');
        }

        // Transform API response to match GiftItem format
        const transformedItems = data.data.map((item) => ({
          ...item,
          id: item._id, // Use _id as id for consistency
          emoji: getEmojiForCategory(item.category),
        }));

        setItems((prevItems) =>
          cursor ? [...prevItems, ...transformedItems] : transformedItems
        );
        setNextCursor(data.nextCursor);
        setHasLoaded(true);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        console.error('Error fetching subscribeable items:', err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const loadMore = useCallback(async () => {
    if (nextCursor && !loading) {
      await fetchItems(nextCursor);
    }
  }, [nextCursor, loading, fetchItems]);

  const reset = useCallback(async () => {
    setItems([]);
    setNextCursor(null);
    setError(null);
    setHasLoaded(false);
    await fetchItems();
  }, [fetchItems]);

  // Load initial items on mount only
  useEffect(() => {
    if (!hasLoaded && !loading) {
      fetchItems();
    }
  }, []);

  return {
    items,
    loading,
    error,
    hasMore: nextCursor !== null,
    loadMore,
    reset,
  };
};

const getEmojiForCategory = (category: string): string => {
  const emojiMap: { [key: string]: string } = {
    lunch: '🍱',
    breakfast: '🥚',
    dinner: '🍽️',
    snacks: '🍿',
    beverages: '🥤',
    desserts: '🍰',
    protein: '🥩',
    produce: '🍎',
    groceries: '🧺',
    baby: '🍼',
  };
  return emojiMap[category.toLowerCase()] || '🎁';
};
