import { GiftItem, Vendor } from '../types';
import { API_ENDPOINTS } from './config';

export const giftItems: GiftItem[] = [
  {
    id: '1',
    name: 'Wine Fruits Republik',
    description: 'Fresh produce, dairy & pantry essentials',
    price: 15000,
    emoji: '🧺',
    category: 'Groceries',
  },
  {
    id: '2',
    name: 'Fresh Fruit Bundle',
    description: 'Seasonal fruits hand-picked daily',
    price: 8500,
    emoji: '🍎',
    category: 'Produce',
  },
  {
    id: '3',
    name: 'Protein Pack',
    description: 'Premium cuts, chicken & seafood',
    price: 22000,
    emoji: '🥩',
    category: 'Protein',
  },
  {
    id: '4',
    name: 'Breakfast Box',
    description: 'Bread, eggs, milk & morning essentials',
    price: 11000,
    emoji: '🥚',
    category: 'Breakfast',
  },
  {
    id: '5',
    name: 'Snack Crate',
    description: 'Curated snacks, drinks & treats',
    price: 9500,
    emoji: '🍿',
    category: 'Snacks',
  },
  {
    id: '6',
    name: 'Baby Essentials',
    description: 'Formula, diapers & baby care items',
    price: 18000,
    emoji: '🍼',
    category: 'Baby',
  },
];

export const vendors: Vendor[] = [
  {
    id: 'v1',
    name: 'Wine Fruits Republik',
    rating: 4.5,
    deliveryTime: '45 mins',
    // emoji: '🏪',
    emoji: '🍷',
  },
  {
    id: 'v2',
    name: 'Mama Ik fresh Fruits',
    rating: 4.6,
    deliveryTime: '45 mins',
    emoji: '🌿',
  },
  {
    id: 'v3',
    name: 'Tamara Food stuffs',
    rating: 4.6,
    deliveryTime: '45 mins',
    emoji: '⚡',
  },
  {
    id: 'v4',
    name: 'Shopwise supermarket',
    rating: 4.6,
    deliveryTime: '45 mins',
    emoji: '📦',
  },
  {
    id: 'v5',
    name: 'IBB vegetables',
    rating: 4.6,
    deliveryTime: '45 mins',
    emoji: '🌿',
  },
  {
    id: 'v6',
    name: 'Pax pharmacy',
    rating: 4.6,
    deliveryTime: '45 mins',
    emoji: '💊',
  },
  {
    id: 'v7',
    name: 'Mama Ebuka food stuffs',
    rating: 4.5,
    deliveryTime: '45 mins',
    emoji: '🍅',
  },

  {
    id: 'v8',
    name: 'Suya Palace',
    rating: 4.6,
    deliveryTime: '45 mins',
    emoji: '🍖',
  },
  {
    id: 'v9',
    name: 'Nwanyi Okpa',
    rating: 4.5,
    deliveryTime: '45 mins',
    emoji: '🌿',
  },
  {
    id: 'v10',
    name: 'Nwanyi Abacha',
    rating: 4.5,
    deliveryTime: '45 mins',
    emoji: '🍜',
  },
  {
    id: 'v11',
    name: 'Nwanyi Akara',
    rating: 4.4,
    deliveryTime: '45 mins',
    emoji: '🥜',
  },

];

export const formatNaira = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const confirmPayment = async (reference: string): Promise<{ success: boolean; message: string }> => {
  try {
    const url = `${API_ENDPOINTS.PAYMENT_CONFIRM}?reference=${encodeURIComponent(reference)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return { success: false, message: `Error confirming payment: ${errorMessage}` };
  }
};

