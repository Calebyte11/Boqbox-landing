export type Step = 'landing' | 'sender' | 'recipient' | 'items' | 'vendor' | 'payment' | 'payment-callback' | 'confirmation';

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

export interface GiftItem {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  emoji?: string;
  category: string;
  image_url?: string;
  createdAt?: string;
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
}

export interface GiftOrder {
  sender: SenderInfo;
  recipient: RecipientInfo;
  items: OrderItem[];
  vendor: Vendor | null;
  isGetMe?: boolean;
}
