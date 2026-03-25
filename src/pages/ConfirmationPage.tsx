import React from 'react';
import Nav from '../components/Nav';
import { GiftOrder } from '../types';
import { formatNaira } from '../lib/data';
import itemsImgOne from '../assets/images/itemsImgOne.jpeg';
import itemsImgTwo from '../assets/images/itemsImgTwo.jpeg';
import itemsImgThree from '../assets/images/itemsImgThree.jpeg';

interface PaymentResponse {
  total_amount_paid: number;
  vendor: string;
  recipient?: string;
  subscribed_for?: string;
  delivery_address?: string;
  type: 'gift' | 'purchase' | 'self';
}

interface ConfirmationPageProps {
  order: GiftOrder;
  paymentData?: PaymentResponse;
  onReset: () => void;
}

export default function ConfirmationPage({ order, paymentData, onReset }: ConfirmationPageProps) {
  // Fallback values if paymentData is not provided
  const confirmationType = paymentData?.type || 'gift';
  const isSubscription = confirmationType === 'self' || order.isSubscribe;
  const totalAmount = paymentData?.total_amount_paid || 0;
  const vendorName = paymentData?.vendor || 'N/A';
  const recipientName = paymentData?.subscribed_for || paymentData?.recipient || order.recipient.fullName;
  const deliveryAddress = paymentData?.delivery_address || `${order.recipient.address}, ${order.recipient.city}`;
  const currentDate = new Date().toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Get subscription frequency from order items
  const getSubscriptionFrequency = (): string => {
    const subscriptionItem = order.items.find((oi) => oi.subscriptionOption);
    return subscriptionItem?.subscriptionOption?.name || 'weekly';
  };

  // Get subscription price from the first item
  const getSubscriptionPrice = (): number => {
    const subscriptionItem = order.items.find((oi) => oi.subscriptionOption);
    return subscriptionItem?.subscriptionOption?.price || 0;
  };

  const getItemImage = (index: number) => {
    const images = [itemsImgOne, itemsImgTwo, itemsImgThree];
    return images[index % 3];
  };

  // Ensure we have valid rendering data
  if (!paymentData) {
    return (
      <div className="app-frame page-enter">
        <Nav />
        <div className="confirmation-page">
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <h2>Loading confirmation...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-frame page-enter">
      <Nav />
      <div className="confirmation-page">
        <div className="confirm-icon">🎉</div>
        <h2 className="confirm-title">
          {isSubscription
            ? 'Subscription Done! ✓'
            : confirmationType === 'purchase'
              ? 'Order Placed!'
              : 'Gift Sent!'}
        </h2>
        <p className="confirm-subtitle">
          {isSubscription
            ? `Your subscription to ${recipientName} is active. Your first delivery starts ${currentDate}.`
            : confirmationType === 'purchase'
              ? 'pads, condoms... discrete delivery - plain bag, no label'
              : `Your gift is on its way to ${recipientName}. They'll love it!`}
        </p>

        <div className="confirm-details">
          {order.items.map((oi, index) => (
            <div key={oi.item.id} className="confirm-detail-row">
              <span className="confirm-detail-label">{isSubscription ? 'Item' : 'Gift'}</span>
              <span className="confirm-detail-value" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src={getItemImage(index)} alt={oi.item.name} style={{ width: 24, height: 24, objectFit: 'cover', borderRadius: 4 }} />
                {oi.item.name}
                {oi.subscriptionOption && (
                  <span style={{ fontSize: 12, opacity: 0.7, textTransform: 'capitalize' }}>({oi.subscriptionOption.name})</span>
                )}
              </span>
            </div>
          ))}
          {isSubscription && (
            <>
              <div className="confirm-detail-row">
                <span className="confirm-detail-label">Frequency</span>
                <span className="confirm-detail-value" style={{ textTransform: 'capitalize' }}>
                  {getSubscriptionFrequency()}
                </span>
              </div>
              <div className="confirm-detail-row">
                <span className="confirm-detail-label">Per Delivery</span>
                <span className="confirm-detail-value">
                  {formatNaira(getSubscriptionPrice())}
                </span>
              </div>
              <div className="confirm-detail-row">
                <span className="confirm-detail-label">Start Date</span>
                <span className="confirm-detail-value">{currentDate}</span>
              </div>
            </>
          )}
          <div className="confirm-detail-row">
            <span className="confirm-detail-label">Vendor</span>
            <span className="confirm-detail-value">
              {vendorName}
            </span>
          </div>
          <div className="confirm-detail-row">
            <span className="confirm-detail-label">{isSubscription ? 'Subscribed For' : 'Recipient'}</span>
            <span className="confirm-detail-value">{recipientName}</span>
          </div>
          <div className="confirm-detail-row">
            <span className="confirm-detail-label">Delivering to</span>
            <span className="confirm-detail-value" style={{ textAlign: 'right', maxWidth: 180 }}>
              {deliveryAddress}
            </span>
          </div>
          <div className="confirm-detail-row" style={{ paddingTop: 12, borderTop: '1.5px solid #E5E7EB', marginTop: 4 }}>
            <span className="confirm-detail-label">{isSubscription ? 'First Payment' : 'Total Paid'}</span>
            <span className="confirm-detail-value" style={{ color: '#F97316', fontSize: 18 }}>
              {formatNaira(totalAmount)}
            </span>
          </div>
        </div>

        <button className="confirm-new-btn" onClick={onReset}>
          {isSubscription
            ? 'Subscribe again 📦'
            : confirmationType === 'purchase'
              ? 'Order Another Item 🛒'
              : 'Send Another Gift 🎁'}
        </button>
      </div>
    </div>
  );
}
