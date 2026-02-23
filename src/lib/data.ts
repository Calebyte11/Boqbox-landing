// import { GiftItem, Vendor } from '../types';
import { API_ENDPOINTS } from './config';


export const formatNaira = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const confirmPayment = async (reference: string): Promise<{ success: boolean; message: string; data?: any }> => {
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

