import React from 'react';
import Nav from '../components/Nav';
import { GiftOrder } from '../types';
import { formatNaira } from '../lib/data';

interface PaymentResponse {
  total_amount_paid: number;
  vendor: string;
  recipient: string;
  delivery_address: string;
  type: 'gift' | 'purchase';
}

interface ConfirmationPageProps {
  order: GiftOrder;
  paymentData?: PaymentResponse;
  onReset: () => void;
}

export default function ConfirmationPage({ order, paymentData, onReset }: ConfirmationPageProps) {
  // Fallback values if paymentData is not provided
  const confirmationType = paymentData?.type || 'gift';
  const totalAmount = paymentData?.total_amount_paid || 0;
  const vendorName = paymentData?.vendor || 'N/A';
  const recipientName = paymentData?.recipient || order.recipient.fullName;
  const deliveryAddress = paymentData?.delivery_address || `${order.recipient.address}, ${order.recipient.city}`;

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
          {confirmationType === 'purchase' ? 'Order Placed!' : 'Gift Sent!'}
        </h2>
        <p className="confirm-subtitle">
          {confirmationType === 'purchase'
            ? 'pads, condoms... discrete delivery - plain bag, no label'
            : `Your gift is on its way to ${recipientName}. They'll love it!`}
        </p>

        <div className="confirm-details">
          {order.items.map((oi) => (
            <div key={oi.item.id} className="confirm-detail-row">
              <span className="confirm-detail-label">Gift</span>
              <span className="confirm-detail-value">
                {oi.item.emoji} {oi.item.name} × {oi.quantity}
              </span>
            </div>
          ))}
          <div className="confirm-detail-row">
            <span className="confirm-detail-label">Vendor</span>
            <span className="confirm-detail-value">
              {vendorName}
            </span>
          </div>
          <div className="confirm-detail-row">
            <span className="confirm-detail-label">Recipient</span>
            <span className="confirm-detail-value">{recipientName}</span>
          </div>
          <div className="confirm-detail-row">
            <span className="confirm-detail-label">Delivering to</span>
            <span className="confirm-detail-value" style={{ textAlign: 'right', maxWidth: 180 }}>
              {deliveryAddress}
            </span>
          </div>
          <div className="confirm-detail-row" style={{ paddingTop: 12, borderTop: '1.5px solid #E5E7EB', marginTop: 4 }}>
            <span className="confirm-detail-label">Total Paid</span>
            <span className="confirm-detail-value" style={{ color: '#F97316', fontSize: 18 }}>
              {formatNaira(totalAmount)}
            </span>
          </div>
        </div>

        <button className="confirm-new-btn" onClick={onReset}>
          {confirmationType === 'purchase' ? 'Order Another Item 🛒' : 'Send Another Gift 🎁'}
        </button>
      </div>
    </div>
  );
}
