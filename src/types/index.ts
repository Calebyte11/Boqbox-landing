export type Step = 'landing' | 'sender' | 'recipient' | 'items' | 'vendor' | 'payment' | 'payment-callback' | 'confirmation' | 'subscribe';

export interface SenderInfo {
  email: string;
  fullName: string;
  phone: string;
}

export interface RecipientInfo {
  email: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  message?: string;
}

export interface SubscriptionOption {
  name: string; // 'weekly', 'monthly', etc.
  price: number;
  quantity: string; // e.g., '1 Crate', '4 Crates'
  _id?: string;
}

export interface GiftItem {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  price?: number;
  emoji?: string;
  category: string;
  image_url?: string;
  createdAt?: string;
  type?: string; // 'subscription' or regular
  options?: SubscriptionOption[];
}

export interface Vendor {
  id?: string;
  _id?: string;
  name: string;
  rating?: number;
  deliveryTime?: string;
  emoji?: string;
  address?: string;
  type?: string;
  description?: string;
  createdAt?: string;
  isCustom?: boolean;
}

export interface PaymentInfo {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export interface OrderItem {
  item: GiftItem;
  quantity: number;
  subscriptionOption?: SubscriptionOption; // For subscription items
  dropOffDay?: string; // Day of week for subscription (e.g., 'Monday', 'Tuesday')
}

export interface GiftOrder {
  sender: SenderInfo;
  recipient: RecipientInfo;
  items: OrderItem[];
  vendor: Vendor | null;
  isGetMe?: boolean;
  isSubscribe?: boolean;
  subscriptionDuration?: number;
  subscriptionSchedule?: string;
}
